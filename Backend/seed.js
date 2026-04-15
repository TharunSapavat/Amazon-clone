const mysql = require('mysql2/promise');
require('dotenv').config();

const items = [
    { "name": "iPhone 13", "price": 59999, "category": "Electronics", "image": "https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?w=300", "stock": 10 },
    { "name": "Samsung Galaxy S21", "price": 49999, "category": "Electronics", "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300", "stock": 12 },
    { "name": "OnePlus Nord", "price": 32999, "category": "Electronics", "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300", "stock": 8 },
    { "name": "MacBook Air", "price": 89999, "category": "Electronics", "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300", "stock": 5 },
    { "name": "Dell Laptop", "price": 57999, "category": "Electronics", "image": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300", "stock": 6 },
    { "name": "Bluetooth Headphones", "price": 1999, "category": "Electronics", "image": "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=300", "stock": 25 },
    { "name": "Wireless Mouse", "price": 799, "category": "Electronics", "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300", "stock": 50 },
    { "name": "Smart Watch", "price": 2999, "category": "Electronics", "image": "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=300", "stock": 18 },

    { "name": "Men Casual Shirt", "price": 799, "category": "Fashion", "image": "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=300", "stock": 30 },
    { "name": "Women Dress", "price": 1299, "category": "Fashion", "image": "https://images.unsplash.com/photo-1495121605193-b116b5b09a18?w=300", "stock": 20 },
    { "name": "Blue Jeans", "price": 1499, "category": "Fashion", "image": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300", "stock": 15 },
    { "name": "T-Shirt Pack", "price": 899, "category": "Fashion", "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300", "stock": 40 },
    { "name": "Running Shoes", "price": 2499, "category": "Fashion", "image": "https://images.unsplash.com/photo-1528701800489-20be3c1a33e9?w=300", "stock": 22 },
    { "name": "Winter Jacket", "price": 3499, "category": "Fashion", "image": "https://images.unsplash.com/photo-1542060748-10c28b62716f?w=300", "stock": 10 },

    { "name": "Cookware Set", "price": 1999, "category": "Home", "image": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300", "stock": 10 },
    { "name": "Mixer Grinder", "price": 3499, "category": "Home", "image": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300", "stock": 15 },
    { "name": "Bedsheet", "price": 899, "category": "Home", "image": "https://images.unsplash.com/photo-1582582494700-3e5b64fcb29b?w=300", "stock": 20 },
    { "name": "Wall Clock", "price": 599, "category": "Home", "image": "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=300", "stock": 25 },
    { "name": "Curtains", "price": 1299, "category": "Home", "image": "https://images.unsplash.com/photo-1616627988290-3a46d0d80f0c?w=300", "stock": 12 },

    { "name": "Refrigerator", "price": 25999, "category": "Appliances", "image": "https://images.unsplash.com/photo-1586201375754-3a0d6b2c2a1f?w=300", "stock": 5 },
    { "name": "Washing Machine", "price": 28999, "category": "Appliances", "image": "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=300", "stock": 4 },
    { "name": "Microwave Oven", "price": 9999, "category": "Appliances", "image": "https://images.unsplash.com/photo-1586201375793-1d7d1f7b6a9c?w=300", "stock": 7 },
    { "name": "Air Conditioner", "price": 34999, "category": "Appliances", "image": "https://images.unsplash.com/photo-1581091012184-5c6c59f0f9b1?w=300", "stock": 3 },
    { "name": "Ceiling Fan", "price": 2499, "category": "Appliances", "image": "https://images.unsplash.com/photo-1582719478171-3f6d4b6c3e3e?w=300", "stock": 20 },

    { "name": "The Alchemist", "price": 399, "category": "Books", "image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300", "stock": 50 },
    { "name": "Atomic Habits", "price": 499, "category": "Books", "image": "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300", "stock": 40 },
    { "name": "Rich Dad Poor Dad", "price": 399, "category": "Books", "image": "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300", "stock": 45 },
    { "name": "Ikigai", "price": 299, "category": "Books", "image": "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300", "stock": 35 },
    { "name": "Think and Grow Rich", "price": 349, "category": "Books", "image": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300", "stock": 30 },

    { "name": "Football", "price": 699, "category": "Sports", "image": "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=300", "stock": 25 },
    { "name": "Cricket Bat", "price": 1999, "category": "Sports", "image": "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=300", "stock": 10 },
    { "name": "Badminton Racket", "price": 999, "category": "Sports", "image": "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=300", "stock": 15 },
    { "name": "Yoga Mat", "price": 799, "category": "Sports", "image": "https://images.unsplash.com/photo-1554294122-7f0f3f7f3b4f?w=300", "stock": 20 },
    { "name": "Dumbbells", "price": 1499, "category": "Sports", "image": "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=300", "stock": 18 },

    { "name": "Toy Car", "price": 1299, "category": "Toys", "image": "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=300", "stock": 18 },
    { "name": "Building Blocks", "price": 999, "category": "Toys", "image": "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=300", "stock": 25 },
    { "name": "Teddy Bear", "price": 599, "category": "Toys", "image": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300", "stock": 30 }
];

async function seed() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'amazon_clone',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();
        console.log("🔄 Clearing old data...");

        await conn.query('SET FOREIGN_KEY_CHECKS = 0');
        await conn.query('TRUNCATE TABLE order_items');
        await conn.query('TRUNCATE TABLE orders');
        await conn.query('TRUNCATE TABLE cart_items');
        await conn.query('TRUNCATE TABLE product_images');
        await conn.query('TRUNCATE TABLE products');
        await conn.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log(`🌱 Seeding ${items.length} products with requested Unsplash / S3 URLs...`);

        const productValues = items.map((item, idx) => {
            const mrp = Math.round(item.price * (1.1 + Math.random() * 0.4));
            const discount = Math.round(((mrp - item.price) / mrp) * 100);
            const rating = Number((3.5 + Math.random() * 1.4).toFixed(1));
            const reviewCount = Math.floor(Math.random() * 15000) + 120;
            return [
                item.name,
                'Premium Brand',
                `High quality ${item.name} with official warranty.`,
                item.price,
                mrp,
                discount,
                rating,
                reviewCount,
                item.stock,
                item.category
            ];
        });

        await conn.query(
            `INSERT INTO products (name, brand, description, price, mrp, discount, rating, review_count, stock_quantity, category) VALUES ?`,
            [productValues]
        );

        const [insertedProducts] = await conn.query('SELECT id FROM products ORDER BY id LIMIT ?', [items.length]);
        const productIds = insertedProducts.map(p => p.id);

        const imageValues = [];
        productIds.forEach((pid, idx) => {
            imageValues.push([pid, items[idx].image]);
            imageValues.push([pid, items[idx].image]);
        });

        await conn.query(
            'INSERT INTO product_images (product_id, image_url) VALUES ?',
            [imageValues]
        );

        const defaultUser = 1;
        await conn.query('INSERT INTO cart_items (user_id, product_id, quantity) VALUES ?', [
            [[defaultUser, productIds[0], 1], [defaultUser, productIds[15], 2]]
        ]);

        const [order1] = await conn.query(
            'INSERT INTO orders (user_id, internal_order_id, total_amount, shipping_status, shipping_name, shipping_address) VALUES (?,?,?,?,?,?)',
            [defaultUser, 'ORDER-' + Date.now(), 19397, 'DELIVERED', 'Tharun', 'Gummidipundi, Chennai, Tamil Nadu, 601201']
        );

        await conn.query('INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ?', [
            [[order1.insertId, productIds[0], 1, 17999], [order1.insertId, productIds[15], 2, 699]]
        ]);

        await conn.commit();
        console.log("✅ Database seeded with properly mapped image links!");

    } catch (err) {
        await conn.rollback();
        console.error("❌ Seed failed:", err.message);
        process.exit(1);
    } finally {
        conn.release();
        process.exit(0);
    }
}
seed();