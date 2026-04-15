const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cart.controller');

router.get('/', CartController.getCart);
router.post('/', CartController.addToCart);
router.put('/:id', CartController.updateQuantity);
router.delete('/:id', CartController.removeItem);

module.exports = router;
