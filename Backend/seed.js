const mysql = require('mysql2/promise');
require('dotenv').config();

async function seed() {
    console.log('Connecting to MySQL DB: ', process.env.DB_NAME || 'amazon_clone');
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'amazon_clone'
    });

    try {
        console.log("Seeding dummy products into MySQL...");

        // Insert Microwave 1
        const [p1] = await pool.query(`INSERT INTO products (name, brand, description, price, mrp, discount, rating, review_count, stock_quantity, capacity, category) 
        VALUES ('Samsung 28 L Convection Microwave Oven (MC28A5013AK/TL, Black, 10 Yr Warranty)', 'Samsung', '28L Capacity: Suitable for large families. Convection: Can be used for baking along with grilling.', 11590, 15500, 25, 4.3, 5430, 50, '28 L', 'Microwaves')`);
        
        await pool.query(`INSERT INTO product_images (product_id, image_url) VALUES (?, 'https://m.media-amazon.com/images/I/41WnWm3IjiL._AC_SY200_.jpg')`, [p1.insertId]);
        await pool.query(`INSERT INTO product_images (product_id, image_url) VALUES (?, 'https://m.media-amazon.com/images/I/41WnWm3IjiL._AC_SY200_.jpg')`, [p1.insertId]);

        // Insert Microwave 2
        const [p2] = await pool.query(`INSERT INTO products (name, brand, description, price, mrp, discount, rating, review_count, stock_quantity, capacity, category) 
        VALUES ('IFB 30 L Convection Microwave Oven (30BRC2, Black, With Starter Kit)', 'IFB', '30L Capacity: Suitable for large families. Microwave Frequency: 2450 MHz', 13990, 18490, 24, 4.2, 3210, 30, '30 L', 'Microwaves')`);
        
        await pool.query(`INSERT INTO product_images (product_id, image_url) VALUES (?, 'https://m.media-amazon.com/images/I/41WnWm3IjiL._AC_SY200_.jpg')`, [p2.insertId]);

        console.log("Seeding complete! You can exit now.");
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed: ", err.message);
        process.exit(1);
    }
}
seed();
