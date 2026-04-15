const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'amazon_clone',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// DEFAULT MOCK USER
const USER_ID = 1;

app.get('/api/health', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        connection.release();
        res.json({ status: 'Connected to MySQL!' });
    } catch (err) {
        res.status(500).json({ error: 'DB connection failed' });
    }
});

// ============================================
//               PRODUCTS API
// ============================================
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products');
        for (let product of rows) {
            const [images] = await pool.query('SELECT image_url FROM product_images WHERE product_id = ? LIMIT 1', [product.id]);
            product.image_url = images.length > 0 ? images[0].image_url : null;
        }
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        
        const product = rows[0];
        const [images] = await pool.query('SELECT image_url FROM product_images WHERE product_id = ?', [req.params.id]);
        product.images = images.map(img => img.image_url);
        product.specs = { capacity: product.capacity };
        res.json(product);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ============================================
//               CART API
// ============================================
app.get('/api/cart', async (req, res) => {
    try {
        const query = `
            SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.mrp, p.discount, p.capacity as color,
            (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) as image_url
            FROM cart_items c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ?
        `;
        const [rows] = await pool.query(query, [USER_ID]);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/cart', async (req, res) => {
    try {
        const { product_id, quantity } = req.body;
        const [existing] = await pool.query('SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?', [USER_ID, product_id]);
        
        if (existing.length > 0) {
            await pool.query('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?', [quantity || 1, existing[0].id]);
        } else {
            await pool.query('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)', [USER_ID, product_id, quantity || 1]);
        }
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/cart/:id', async (req, res) => {
    try {
        const { quantity } = req.body;
        await pool.query('UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?', [quantity, req.params.id, USER_ID]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/cart/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [req.params.id, USER_ID]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ============================================
//               ORDERS API
// ============================================
app.post('/api/orders', async (req, res) => {
    try {
        const { shipping_name, shipping_address, cart_item_ids } = req.body;
        
        let cartQuery = 'SELECT c.id, c.product_id, c.quantity, p.price FROM cart_items c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?';
        let queryParams = [USER_ID];
        
        if (cart_item_ids && cart_item_ids.length > 0) {
            cartQuery += ` AND c.id IN (?)`;
            queryParams.push(cart_item_ids);
        }

        const [cartItems] = await pool.query(cartQuery, queryParams);
        if (cartItems.length === 0) return res.status(400).json({ error: 'Cart is empty' });

        const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const internalOrderId = 'ORDER-' + Date.now();

        // Create Order
        const [orderResult] = await pool.query(
            'INSERT INTO orders (user_id, internal_order_id, total_amount, shipping_name, shipping_address, estimated_delivery) VALUES (?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 3 DAY))',
            [USER_ID, internalOrderId, totalAmount, shipping_name || 'John Doe', shipping_address || '123 Amazon St']
        );
        const orderId = orderResult.insertId;

        // Create Order Items
        for (let item of cartItems) {
            await pool.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.price]
            );
        }

        // Clear requested items out of cart
        if (cart_item_ids && cart_item_ids.length > 0) {
            await pool.query('DELETE FROM cart_items WHERE user_id = ? AND id IN (?)', [USER_ID, cart_item_ids]);
        } else {
            await pool.query('DELETE FROM cart_items WHERE user_id = ?', [USER_ID]);
        }

        res.json({ success: true, order_id: orderId, internal_order_id: internalOrderId });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/orders', async (req, res) => {
    try {
        const [orders] = await pool.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [USER_ID]);
        for (let order of orders) {
            const [items] = await pool.query(`
                SELECT oi.id, oi.product_id, oi.quantity, oi.price_at_purchase, oi.is_returned, p.name,
                (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) as image_url
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = ?
            `, [order.id]);
            order.items = items;
        }
        res.json(orders);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/returns', async (req, res) => {
    try {
        const { order_id, order_item_id } = req.body;
        await pool.query('UPDATE order_items SET is_returned = TRUE WHERE id = ? AND order_id = ?', [order_item_id, order_id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(port, () => {
    console.log(`Backend API Server running on port ${port}`);
});
