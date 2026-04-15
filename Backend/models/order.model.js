const pool = require('../config/db');

const OrderModel = {
    /**
     * Create an order from cart items (uses transaction).
     * Batch inserts order_items instead of per-item INSERT.
     */
    async create(userId, shippingName, shippingAddress, cartItemIds = null) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            // Build query to fetch cart items
            let cartSql = `
                SELECT ci.id, ci.product_id, ci.quantity, p.price, p.title,
                       (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order LIMIT 1) AS image_url
                FROM cart_items ci
                JOIN products p ON ci.product_id = p.id
                WHERE ci.user_id = ?`;
            const cartParams = [userId];

            if (cartItemIds?.length) {
                cartSql += ` AND ci.id IN (${cartItemIds.map(() => '?').join(',')})`;
                cartParams.push(...cartItemIds);
            }

            const [itemsToOrder] = await conn.query(cartSql, cartParams);
            if (itemsToOrder.length === 0) throw new Error('Cart is empty');

            // Calculate total
            const totalAmount = itemsToOrder.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
            const internalOrderId = 'ORDER-' + Date.now();

            // Create order
            const [orderResult] = await conn.query(
                `INSERT INTO orders (user_id, internal_order_id, total_amount, shipping_name, shipping_address, estimated_delivery)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [userId, internalOrderId, totalAmount, shippingName || 'John Doe',
                 shippingAddress || '123 Amazon St',
                 new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)]
            );
            const orderId = orderResult.insertId;

            // Batch insert order items
            const orderItemVals = itemsToOrder.map(item => [orderId, item.product_id, item.quantity, item.price]);
            await conn.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ?',
                [orderItemVals]
            );

            // Clear ordered items from cart
            if (cartItemIds?.length) {
                await conn.query(
                    `DELETE FROM cart_items WHERE user_id = ? AND id IN (${cartItemIds.map(() => '?').join(',')})`,
                    [userId, ...cartItemIds]
                );
            } else {
                await conn.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
            }

            await conn.commit();
            return { success: true, order_id: orderId.toString(), internal_order_id: internalOrderId };

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    },

    /**
     * Get all orders for a user, with items and filtering.
     */
    async getByUserId(userId, filters = {}) {
        let sql = 'SELECT * FROM orders WHERE user_id = ?';
        const params = [userId];

        // 1. Timeframe filtering
        if (filters.timeframe && filters.timeframe !== 'Archived orders') {
            const now = new Date();
            if (filters.timeframe === 'past 30 days') {
                sql += ' AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
            } else if (filters.timeframe === 'past 3 months') {
                sql += ' AND created_at >= DATE_SUB(NOW(), INTERVAL 3 MONTH)';
            } else if (/^\d{4}$/.test(filters.timeframe)) {
                // Specific year filtering
                sql += ' AND YEAR(created_at) = ?';
                params.push(filters.timeframe);
            }
        }

        // 2. Search filtering (Matches product name or Order ID)
        if (filters.search) {
            sql += ` AND (
                internal_order_id LIKE ? OR 
                id IN (
                    SELECT oi.order_id FROM order_items oi 
                    JOIN products p ON oi.product_id = p.id 
                    WHERE p.title LIKE ?
                )
            )`;
            const term = `%${filters.search}%`;
            params.push(term, term);
        }

        sql += ' ORDER BY created_at DESC';

        const [orders] = await pool.query(sql, params);
        if (orders.length === 0) return [];

        // Single query for ALL order items across all returned orders
        const orderIds = orders.map(o => o.id);
        const [allItems] = await pool.query(
            `SELECT oi.id, oi.order_id, oi.product_id, oi.quantity, oi.price_at_purchase, oi.is_returned,
                    p.title AS name,
                    (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order LIMIT 1) AS image_url
             FROM order_items oi
             JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id IN (${orderIds.map(() => '?').join(',')})`,
            orderIds
        );

        // Group items by order_id using a Map for O(1) lookups
        const itemsByOrder = new Map();
        for (const item of allItems) {
            const orderId = item.order_id;
            if (!itemsByOrder.has(orderId)) itemsByOrder.set(orderId, []);
            itemsByOrder.get(orderId).push({
                id: item.id.toString(),
                product_id: item.product_id,
                quantity: item.quantity,
                price_at_purchase: Number(item.price_at_purchase),
                name: item.name,
                image_url: item.image_url,
                is_returned: Boolean(item.is_returned)
            });
        }

        // Assemble final response
        return orders.map(order => ({
            ...order,
            id: order.id.toString(),
            total_amount: Number(order.total_amount),
            items: itemsByOrder.get(Number(order.id)) || []
        }));
    },

    /**
     * Process a return for an order item.
     */
    async returnItem(orderId, orderItemId) {
        const [result] = await pool.query(
            'UPDATE order_items SET is_returned = TRUE WHERE id = ? AND order_id = ?',
            [orderItemId, orderId]
        );
        if (result.affectedRows === 0) return null;
        return { success: true };
    },

    async getByInternalId(internalId) {
        const [rows] = await pool.query(
            'SELECT shipping_name, shipping_address, estimated_delivery FROM orders WHERE internal_order_id = ?',
            [internalId]
        );
        return rows[0];
    }
};

module.exports = OrderModel;
