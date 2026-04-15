const OrderModel = require('../models/order.model');
const { sendOrderConfirmation } = require('../utils/email');
const pool = require('../config/db');

// Default mock user until auth is implemented
const USER_ID = 1;

const OrderController = {
    async createOrder(req, res) {
        try {
            const { shipping_name, shipping_address, cart_item_ids, optional_email } = req.body;
            
            // 1. Create the order in the DB
            const result = await OrderModel.create(USER_ID, shipping_name, shipping_address, cart_item_ids);
            
            // 2. Fetch the newly created order with full details to send in the email
            const fullOrders = await OrderModel.getByUserId(USER_ID);
            const newOrder = fullOrders.find(o => o.internal_order_id === result.internal_order_id);

            // 3. Determine recipient email
            let recipientEmail = optional_email;
            if (!recipientEmail) {
                const [users] = await pool.query('SELECT email FROM users WHERE id = ?', [USER_ID]);
                recipientEmail = users[0]?.email || 'tharun.s23@iiits.in';
            }

            // 4. Send email (async, don't block the response)
            if (newOrder) {
                sendOrderConfirmation(recipientEmail, newOrder);
            }

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
            const { timeframe, search } = req.query;
            const orders = await OrderModel.getByUserId(USER_ID, { timeframe, search });
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
    },

    async getOrderDetails(req, res) {
        try {
            const order = await OrderModel.getByInternalId(req.params.internalId);
            if (!order) return res.status(404).json({ error: 'Order not found' });
            res.json(order);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = OrderController;
