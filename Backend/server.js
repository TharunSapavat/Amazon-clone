const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./config/db');

// Import routes
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const homeRoutes = require('./routes/home.routes');
const OrderController = require('./controllers/order.controller');

const app = express();

// Middleware
const allowedOrigins = [
    process.env.FRONTEND_URL, 
    'http://localhost:5173', 
    'http://localhost:3000'
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : '*',
    credentials: true
}));
app.use(express.json());

// ====================== HEALTH CHECK ======================
app.get('/api/health', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT COUNT(*) as count FROM products');
        res.json({
            status: 'ok',
            message: 'Backend is running and connected to MySQL!',
            productsCount: rows[0].count,
            environment: process.env.NODE_ENV || 'development',
            dbHost: process.env.DATABASE_URL ? 'Using DATABASE_URL' : (process.env.DB_HOST || 'MISSING')
        });
    } catch (err) {
        console.error('Database Error:', err.message);
        res.status(500).json({
            status: 'error',
            message: 'Failed to connect to MySQL',
            error: err.message,
            hint: 'Check DB_HOST, DB_USER, DB_PASSWORD, DB_NAME in Render Environment Variables'
        });
    }
});

// Mount routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', homeRoutes);
app.post('/api/returns', OrderController.returnItem);

// Start server
const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Backend API Server running on port ${port}`);
    console.log(`Health check available at: /api/health`);
});