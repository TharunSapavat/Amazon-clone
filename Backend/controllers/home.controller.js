const HomeModel = require('../models/home.model');

const HomeController = {
    async getCategories(req, res) {
        try {
            const categories = await HomeModel.getCategories();
            res.json(categories);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getBanners(req, res) {
        try {
            const banners = await HomeModel.getBanners();
            res.json(banners);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getHomeSections(req, res) {
        try {
            const sections = await HomeModel.getHomeSections();
            res.json(sections);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getAllData(req, res) {
        try {
            const data = await HomeModel.getAllData();
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = HomeController;
