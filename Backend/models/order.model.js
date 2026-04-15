const pool = require('../config/db');
const CartModel = require('./cart.model');

const OrderModel = {
    /**
     * Create an order from cart items (uses transaction).
     */
    async create(userId, shippingName, shippingAddress, cartItemIds = null) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            // Get items to order
            let itemsToOrder;
            if (cartItemIds && cartItemIds.length > 0) {
                const placeholders = cartItemIds.map(() => '?').join(',');
                const [rows] = await conn.query(
                    `SELECT ci.id, ci.product_id, ci.quantity, p.price, p.title,
                            (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order LIMIT 1) AS image_url
                     FROM cart_items ci
                     JOIN products p ON ci.product_id = p.id
                     WHERE ci.user_id = ? AND ci.id IN (${placeholders})`,
                    [userId, ...cartItemIds]
                );
                itemsToOrder = rows;
            } else {
                const [rows] = await conn.query(
                    `SELECT ci.id, ci.product_id, ci.quantity, p.price, p.title,
                            (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order LIMIT 1) AS image_url
                     FROM cart_items ci
                     JOIN products p ON ci.product_id = p.id
                     WHERE ci.user_id = ?`,
                    [userId]
                );
                itemsToOrder = rows;
            }

            if (itemsToOrder.length === 0) {
                throw new Error('Cart is empty');
            }

            // Calculate total
            const totalAmount = itemsToOrder.reduce((sum, item) => {
                return sum + (Number(item.price) * item.quantity);
            }, 0);

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

            // Create order items
            for (const item of itemsToOrder) {
                await conn.query(
                    `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
                     VALUES (?, ?, ?, ?)`,
                    [orderId, item.product_id, item.quantity, item.price]
                );
            }

            // Clear ordered items from cart
            if (cartItemIds && cartItemIds.length > 0) {
                const placeholders = cartItemIds.map(() => '?').join(',');
                await conn.query(
                    `DELETE FROM cart_items WHERE user_id = ? AND id IN (${placeholders})`,
                    [userId, ...cartItemIds]
                );
            } else {
                await conn.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
            }

            await conn.commit();
            return {
                success: true,
                order_id: orderId.toString(),
                internal_order_id: internalOrderId
            };

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    },

    /**
     * Get all orders for a user, with items.
     */
    async getByUserId(userId) {
        const [orders] = await pool.query(
            `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
            [userId]
        );

        // Enrich each order with its items
        for (const order of orders) {
            const [items] = await pool.query(
                `SELECT oi.id, oi.product_id, oi.quantity, oi.price_at_purchase, oi.is_returned,
                        p.title AS name,
                        (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order LIMIT 1) AS image_url
                 FROM order_items oi
                 JOIN products p ON oi.product_id = p.id
                 WHERE oi.order_id = ?`,
                [order.id]
            );

            order.items = items.map(item => ({
                id: item.id.toString(),
                product_id: item.product_id,
                quantity: item.quantity,
                price_at_purchase: Number(item.price_at_purchase),
                name: item.name,
                image_url: item.image_url,
                is_returned: Boolean(item.is_returned)
            }));

            // Map order fields to match frontend expectations
            order.id = order.id.toString();
            order.total_amount = Number(order.total_amount);
        }

        return orders;
    },

    /**
     * Process a return for an order item.
     */
    async returnItem(orderId, orderItemId) {
        const [result] = await pool.query(
            `UPDATE order_items SET is_returned = TRUE
             WHERE id = ? AND order_id = ?`,
            [orderItemId, orderId]
        );
        if (result.affectedRows === 0) return null;
        return { success: true };
    }
};

module.exports = OrderModel;
