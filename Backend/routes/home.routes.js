const express = require('express');
const router = express.Router();
const HomeController = require('../controllers/home.controller');

router.get('/categories', HomeController.getCategories);
router.get('/banners', HomeController.getBanners);
router.get('/home-sections', HomeController.getHomeSections);
router.get('/data', HomeController.getAllData);

module.exports = router;
