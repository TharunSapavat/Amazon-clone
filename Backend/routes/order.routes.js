const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.controller');

router.get('/', OrderController.getOrders);
router.post('/', OrderController.createOrder);
router.get('/:internalId', OrderController.getOrderDetails);

module.exports = router;
