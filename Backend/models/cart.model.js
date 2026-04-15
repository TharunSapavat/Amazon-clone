const pool = require('../config/db');

const CartModel = {
    /**
     * Get all cart items for a user, enriched with product details.
     */
    async getByUserId(userId) {
        const [rows] = await pool.query(
            `SELECT ci.id, ci.product_id, ci.quantity,
                    p.title AS name, p.price, p.original_price AS mrp,
                    p.discount_label,
                    (SELECT co.color_name FROM product_color_options co WHERE co.product_id = p.id LIMIT 1) AS color,
                    (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order LIMIT 1) AS image_url
             FROM cart_items ci
             JOIN products p ON ci.product_id = p.id
             WHERE ci.user_id = ?
             ORDER BY ci.created_at DESC`,
            [userId]
        );

        return rows.map(row => ({
            id: row.id.toString(),
            product_id: row.product_id,
            quantity: row.quantity,
            name: row.name,
            price: Number(row.price),
            mrp: Number(row.mrp),
            discount: parseInt((row.discount_label || '0').replace('% off', '')) || 0,
            color: row.color || 'Default',
            image_url: row.image_url
        }));
    },

    /**
     * Add a product to cart using ON DUPLICATE KEY UPDATE.
     * Single query instead of SELECT + INSERT/UPDATE.
     */
    async addItem(userId, productId, quantity = 1) {
        await pool.query(
            `INSERT INTO cart_items (user_id, product_id, quantity)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
            [userId, productId, quantity]
        );
        return { success: true };
    },

    /**
     * Update quantity of a specific cart item.
     */
    async updateQuantity(cartItemId, quantity) {
        const [result] = await pool.query(
            'UPDATE cart_items SET quantity = ? WHERE id = ?',
            [quantity, cartItemId]
        );
        if (result.affectedRows === 0) return null;
        return { success: true };
    },

    /**
     * Remove a cart item by ID.
     */
    async removeItem(cartItemId) {
        await pool.query('DELETE FROM cart_items WHERE id = ?', [cartItemId]);
        return { success: true };
    },

    /**
     * Clear all or specific cart items for a user.
     */
    async clearItems(userId, cartItemIds = null) {
        if (cartItemIds?.length) {
            const placeholders = cartItemIds.map(() => '?').join(',');
            await pool.query(
                `DELETE FROM cart_items WHERE user_id = ? AND id IN (${placeholders})`,
                [userId, ...cartItemIds]
            );
        } else {
            await pool.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
        }
    }
};

module.exports = CartModel;
