const CartModel = require('../models/cart.model');

// Default mock user until auth is implemented
const USER_ID = 1;

const CartController = {
    async getCart(req, res) {
        try {
            const cart = await CartModel.getByUserId(USER_ID);
            res.json(cart);
        } catch (err) {
            console.error('Cart get error:', err);
            res.status(500).json({ error: err.message });
        }
    },

    async addToCart(req, res) {
        try {
            const { product_id, quantity } = req.body;
            const result = await CartModel.addItem(USER_ID, product_id, quantity || 1);
            res.json(result);
        } catch (err) {
            console.error('Cart post error:', err);
            res.status(500).json({ error: err.message });
        }
    },

    async updateQuantity(req, res) {
        try {
            const { quantity } = req.body;
            const result = await CartModel.updateQuantity(req.params.id, quantity);
            if (!result) return res.status(404).json({ error: 'Cart item not found' });
            res.json(result);
        } catch (err) {
            console.error('Cart put error:', err);
            res.status(500).json({ error: err.message });
        }
    },

    async removeItem(req, res) {
        try {
            const result = await CartModel.removeItem(req.params.id);
            res.json(result);
        } catch (err) {
            console.error('Cart delete error:', err);
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = CartController;
