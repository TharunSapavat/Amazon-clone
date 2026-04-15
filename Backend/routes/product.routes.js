const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');

router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getById);

module.exports = router;
