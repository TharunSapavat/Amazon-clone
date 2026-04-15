const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./config/db');

// Import route modules
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const homeRoutes = require('./routes/home.routes');

// Import order controller for returns (single endpoint)
const OrderController = require('./controllers/order.controller');

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// ============================================
//               HEALTH CHECK
// ============================================
app.get('/api/health', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT COUNT(*) as count FROM products');
        res.json({ status: 'Connected to MySQL!', productsCount: rows[0].count });
    } catch (err) {
        res.status(500).json({ error: 'Failed to connect to MySQL', details: err.message });
    }
});

// ============================================
//               MOUNT ROUTES
// ============================================
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', homeRoutes);  // /api/categories, /api/banners, /api/home-sections, /api/data

// Returns endpoint (standalone)
app.post('/api/returns', OrderController.returnItem);

// ============================================
//               START SERVER
// ============================================
app.listen(port, () => {
    console.log(`🚀 Backend API Server running on port ${port} (MySQL)`);
});
