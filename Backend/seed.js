const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function seed() {
    const dataPath = path.join(__dirname, 'data.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

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

        // Execute schema
        const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        const statements = schemaSql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.match(/^(CREATE DATABASE|USE )/i));

        for (const stmt of statements) {
            await conn.query(stmt);
        }
        console.log('✅ Schema created');

        // ─── SEED CATEGORIES (batch) ───
        if (data.categories?.length) {
            const vals = data.categories.map(c => [c.id, c.label, c.icon || null]);
            await conn.query('INSERT INTO categories (id, label, icon) VALUES ?', [vals]);
            console.log(`✅ Seeded ${vals.length} categories`);
        }

        // ─── SEED BANNERS (batch) ───
        if (data.banners?.length) {
            const vals = data.banners.map((url, i) => [url, i]);
            await conn.query('INSERT INTO banners (image_url, sort_order) VALUES ?', [vals]);
            console.log(`✅ Seeded ${vals.length} banners`);
        }

        // ─── SEED PRODUCTS (batch inserts per table) ───
        if (data.products?.length) {
            // Batch insert products
            const productVals = data.products.map(p => [
                p.id, p.title, p.brand, p.category, p.categoryId || null,
                p.subcategory || null, p.price, p.originalPrice || null,
                p.discountLabel || null, p.rating || 0, p.reviews || null,
                p.reviewCount || 0, p.fAssured ? 1 : 0, p.stock || 0,
                p.seller || null, p.sellerRating || null, p.sellerYears || null,
                p.exchangeValue || 0
            ]);
            await conn.query(
                `INSERT INTO products (id, title, brand, category, category_id, subcategory,
                 price, original_price, discount_label, rating, reviews_text, review_count,
                 f_assured, stock, seller, seller_rating, seller_years, exchange_value)
                 VALUES ?`, [productVals]
            );

            // Collect all child-table rows across all products, then batch insert each
            const imageVals = [];
            const highlightVals = [];
            const descVals = [];
            const specVals = [];
            const colorVals = [];
            const variantVals = [];

            for (const p of data.products) {
                if (p.images?.length) {
                    p.images.forEach((url, i) => imageVals.push([p.id, url, i]));
                }
                if (p.highlights?.length) {
                    p.highlights.forEach((h, i) => highlightVals.push([p.id, h, i]));
                }
                if (p.description?.length) {
                    const arr = Array.isArray(p.description) ? p.description : [p.description];
                    arr.forEach((d, i) => descVals.push([p.id, d, i]));
                }
                if (p.specifications) {
                    for (const [section, specs] of Object.entries(p.specifications)) {
                        for (const [key, value] of Object.entries(specs)) {
                            specVals.push([p.id, section, key, value]);
                        }
                    }
                }
                if (p.colorOptions?.length) {
                    p.colorOptions.forEach(c => colorVals.push([p.id, c.name, c.hex || null]));
                }
                if (p.variants?.length) {
                    p.variants.forEach(v => variantVals.push([
                        p.id, v.label, v.inStock ? 1 : 0,
                        v.price || null, v.originalPrice || null, v.discountLabel || null
                    ]));
                }
            }

            // 6 batch inserts instead of ~200 individual ones
            if (imageVals.length) {
                await conn.query('INSERT INTO product_images (product_id, image_url, sort_order) VALUES ?', [imageVals]);
            }
            if (highlightVals.length) {
                await conn.query('INSERT INTO product_highlights (product_id, highlight, sort_order) VALUES ?', [highlightVals]);
            }
            if (descVals.length) {
                await conn.query('INSERT INTO product_descriptions (product_id, paragraph, sort_order) VALUES ?', [descVals]);
            }
            if (specVals.length) {
                await conn.query('INSERT INTO product_specifications (product_id, section_name, spec_key, spec_value) VALUES ?', [specVals]);
            }
            if (colorVals.length) {
                await conn.query('INSERT INTO product_color_options (product_id, color_name, hex_code) VALUES ?', [colorVals]);
            }
            if (variantVals.length) {
                await conn.query('INSERT INTO product_variants (product_id, label, in_stock, price, original_price, discount_label) VALUES ?', [variantVals]);
            }

            console.log(`✅ Seeded ${data.products.length} products (${imageVals.length} images, ${highlightVals.length} highlights, ${specVals.length} specs, ${colorVals.length} colors, ${variantVals.length} variants)`);
        }

        // ─── SEED HOME SECTIONS ───
        if (data.homeSections?.length) {
            // Must insert sequentially to capture insertId for join table
            const sectionProductVals = [];
            for (let i = 0; i < data.homeSections.length; i++) {
                const s = data.homeSections[i];
                const [result] = await conn.query(
                    'INSERT INTO home_sections (title, bg_color, category_id, sort_order) VALUES (?, ?, ?, ?)',
                    [s.title, s.bgColor || null, s.categoryId || null, i]
                );
                if (s.productIds?.length) {
                    s.productIds.forEach((pid, j) => sectionProductVals.push([result.insertId, pid, j]));
                }
            }
            if (sectionProductVals.length) {
                await conn.query('INSERT INTO home_section_products (section_id, product_id, sort_order) VALUES ?', [sectionProductVals]);
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