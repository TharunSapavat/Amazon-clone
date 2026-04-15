const OrderModel = require('../models/order.model');

// Default mock user until auth is implemented
const USER_ID = 1;

const OrderController = {
    async createOrder(req, res) {
        try {
            const { shipping_name, shipping_address, cart_item_ids } = req.body;
            const result = await OrderModel.create(USER_ID, shipping_name, shipping_address, cart_item_ids);
            res.json(result);
        } catch (err) {
            console.error('Orders post error:', err);
            if (err.message === 'Cart is empty') {
                return res.status(400).json({ error: 'Cart is empty' });
            }
            res.status(500).json({ error: err.message });
        }
    },

    async getOrders(req, res) {
        try {
            const orders = await OrderModel.getByUserId(USER_ID);
            res.json(orders);
        } catch (err) {
            console.error('Orders get error:', err);
            res.status(500).json({ error: err.message });
        }
    },

    async returnItem(req, res) {
        try {
            const { order_id, order_item_id } = req.body;
            const result = await OrderModel.returnItem(order_id, order_item_id);
            if (!result) return res.status(404).json({ error: 'Order or item not found' });
            res.json(result);
        } catch (err) {
            console.error('Returns error:', err);
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = OrderController;
