const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function seed() {
    // Read data.json
    const dataPath = path.join(__dirname, 'data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);

    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'amazon_clone',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        multipleStatements: true
    });

    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();
        console.log('🔄 Clearing old data...');

        // Drop and recreate tables in correct order (respecting FKs)
        await conn.query('SET FOREIGN_KEY_CHECKS = 0');
        const tables = [
            'home_section_products', 'home_sections', 'order_items', 'orders',
            'cart_items', 'product_variants', 'product_color_options',
            'product_specifications', 'product_descriptions', 'product_highlights',
            'product_images', 'products', 'banners', 'categories'
        ];
        for (const table of tables) {
            await conn.query(`DROP TABLE IF EXISTS ${table}`);
        }
        await conn.query('SET FOREIGN_KEY_CHECKS = 1');

        // Read and execute schema (skip CREATE DATABASE and USE lines)
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        const statements = schemaSql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.match(/^(CREATE DATABASE|USE )/i));

        for (const stmt of statements) {
            await conn.query(stmt);
        }
        console.log('✅ Schema created');

        // ─── SEED CATEGORIES ───
        if (data.categories && data.categories.length > 0) {
            for (const cat of data.categories) {
                await conn.query(
                    'INSERT INTO categories (id, label, icon) VALUES (?, ?, ?)',
                    [cat.id, cat.label, cat.icon || null]
                );
            }
            console.log(`✅ Seeded ${data.categories.length} categories`);
        }

        // ─── SEED BANNERS ───
        if (data.banners && data.banners.length > 0) {
            for (let i = 0; i < data.banners.length; i++) {
                await conn.query(
                    'INSERT INTO banners (image_url, sort_order) VALUES (?, ?)',
                    [data.banners[i], i]
                );
            }
            console.log(`✅ Seeded ${data.banners.length} banners`);
        }

        // ─── SEED PRODUCTS ───
        if (data.products && data.products.length > 0) {
            for (const p of data.products) {
                // Insert main product row
                await conn.query(
                    `INSERT INTO products (id, title, brand, category, category_id, subcategory,
                     price, original_price, discount_label, rating, reviews_text, review_count,
                     f_assured, stock, seller, seller_rating, seller_years, exchange_value)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        p.id, p.title, p.brand, p.category, p.categoryId || null,
                        p.subcategory || null, p.price, p.originalPrice || null,
                        p.discountLabel || null, p.rating || 0, p.reviews || null,
                        p.reviewCount || 0, p.fAssured ? 1 : 0, p.stock || 0,
                        p.seller || null, p.sellerRating || null, p.sellerYears || null,
                        p.exchangeValue || 0
                    ]
                );

                // Insert images
                if (p.images && p.images.length > 0) {
                    for (let i = 0; i < p.images.length; i++) {
                        await conn.query(
                            'INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)',
                            [p.id, p.images[i], i]
                        );
                    }
                }

                // Insert highlights
                if (p.highlights && p.highlights.length > 0) {
                    for (let i = 0; i < p.highlights.length; i++) {
                        await conn.query(
                            'INSERT INTO product_highlights (product_id, highlight, sort_order) VALUES (?, ?, ?)',
                            [p.id, p.highlights[i], i]
                        );
                    }
                }

                // Insert description paragraphs
                if (p.description && p.description.length > 0) {
                    const descArr = Array.isArray(p.description) ? p.description : [p.description];
                    for (let i = 0; i < descArr.length; i++) {
                        await conn.query(
                            'INSERT INTO product_descriptions (product_id, paragraph, sort_order) VALUES (?, ?, ?)',
                            [p.id, descArr[i], i]
                        );
                    }
                }

                // Insert specifications
                if (p.specifications) {
                    for (const [sectionName, specs] of Object.entries(p.specifications)) {
                        for (const [key, value] of Object.entries(specs)) {
                            await conn.query(
                                'INSERT INTO product_specifications (product_id, section_name, spec_key, spec_value) VALUES (?, ?, ?, ?)',
                                [p.id, sectionName, key, value]
                            );
                        }
                    }
                }

                // Insert color options
                if (p.colorOptions && p.colorOptions.length > 0) {
                    for (const color of p.colorOptions) {
                        await conn.query(
                            'INSERT INTO product_color_options (product_id, color_name, hex_code) VALUES (?, ?, ?)',
                            [p.id, color.name, color.hex || null]
                        );
                    }
                }

                // Insert variants
                if (p.variants && p.variants.length > 0) {
                    for (const v of p.variants) {
                        await conn.query(
                            'INSERT INTO product_variants (product_id, label, in_stock, price, original_price, discount_label) VALUES (?, ?, ?, ?, ?, ?)',
                            [p.id, v.label, v.inStock ? 1 : 0, v.price || null, v.originalPrice || null, v.discountLabel || null]
                        );
                    }
                }
            }
            console.log(`✅ Seeded ${data.products.length} products with images, highlights, specs, colors, variants`);
        }

        // ─── SEED HOME SECTIONS ───
        if (data.homeSections && data.homeSections.length > 0) {
            for (let i = 0; i < data.homeSections.length; i++) {
                const section = data.homeSections[i];
                const [result] = await conn.query(
                    'INSERT INTO home_sections (title, bg_color, category_id, sort_order) VALUES (?, ?, ?, ?)',
                    [section.title, section.bgColor || null, section.categoryId || null, i]
                );
                const sectionId = result.insertId;

                if (section.productIds && section.productIds.length > 0) {
                    for (let j = 0; j < section.productIds.length; j++) {
                        await conn.query(
                            'INSERT INTO home_section_products (section_id, product_id, sort_order) VALUES (?, ?, ?)',
                            [sectionId, section.productIds[j], j]
                        );
                    }
                }
            }
            console.log(`✅ Seeded ${data.homeSections.length} home sections`);
        }

        await conn.commit();
        console.log('🎉 Database seeded successfully from data.json!');

    } catch (err) {
        await conn.rollback();
        console.error('❌ Seed failed:', err.message);
        console.error(err);
        process.exit(1);
    } finally {
        conn.release();
        await pool.end();
        process.exit(0);
    }
}

seed();