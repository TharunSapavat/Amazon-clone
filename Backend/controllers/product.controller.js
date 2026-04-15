const ProductModel = require('../models/product.model');

const ProductController = {
    async getAll(req, res) {
        try {
            const { category, search, freeShipping, brands, minRating, minPrice, maxPrice } = req.query;
            const products = await ProductModel.getAll({
                category, search, freeShipping, brands, minRating, minPrice, maxPrice
            });
            res.json(products);
        } catch (err) {
            console.error('Products API error:', err);
            res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const product = await ProductModel.getById(req.params.id);
            if (!product) return res.status(404).json({ error: 'Not found' });
            res.json(product);
        } catch (err) {
            console.error('Product detail API error:', err);
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = ProductController;
