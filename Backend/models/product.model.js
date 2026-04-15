const pool = require('../config/db');

// Shared helper to parse discount from "21% off" → 21
const parseDiscount = (label) => parseInt((label || '0').replace('% off', '')) || 0;

const ProductModel = {
    /**
     * Get all products with optional filters.
     * All filtering done in SQL with parameterized queries.
     */
    async getAll(filters = {}) {
        let sql = `
            SELECT p.id, p.title, p.brand, p.category, p.category_id, p.subcategory,
                   p.price, p.original_price, p.discount_label, p.rating,
                   p.reviews_text, p.review_count, p.f_assured, p.stock,
                   p.seller, p.seller_rating, p.seller_years, p.exchange_value,
                   (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order LIMIT 1) AS image_url
            FROM products p
            WHERE 1=1
        `;
        const params = [];

        if (filters.category && filters.category !== 'All') {
            sql += ' AND (p.category = ? OR p.category_id = ?)';
            params.push(filters.category, filters.category);
        }

        if (filters.search) {
            sql += ' AND (p.title LIKE ? OR p.brand LIKE ?)';
            const term = `%${filters.search}%`;
            params.push(term, term);
        }

        if (filters.brands) {
            const brandList = filters.brands.split(',').map(b => b.trim().toLowerCase());
            sql += ` AND LOWER(p.brand) IN (${brandList.map(() => '?').join(',')})`;
            params.push(...brandList);
        }

        if (filters.minRating > 0) {
            sql += ' AND p.rating >= ?';
            params.push(Number(filters.minRating));
        }

        if (filters.minPrice > 0) {
            sql += ' AND p.price >= ?';
            params.push(Number(filters.minPrice));
        }

        if (filters.maxPrice > 0) {
            sql += ' AND p.price <= ?';
            params.push(Number(filters.maxPrice));
        }

        if (filters.freeShipping === 'true') {
            sql += ' AND p.price > 499';
        }

        sql += ' ORDER BY p.id';

        const [rows] = await pool.query(sql, params);

        return rows.map(row => ({
            id: row.id,
            name: row.title,
            brand: row.brand,
            category: row.category,
            price: Number(row.price),
            mrp: Number(row.original_price),
            discount: parseDiscount(row.discount_label),
            rating: Number(row.rating),
            review_count: row.review_count,
            stock_quantity: row.stock,
            image_url: row.image_url || null,
            description: '',
            subcategory: row.subcategory
        }));
    },

    /**
     * Get a single product by ID with all related data.
     * Uses Promise.all to fire 7 queries in parallel instead of sequentially.
     */
    async getById(id) {
        const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
        if (products.length === 0) return null;

        const product = products[0];

        // Fire all 6 related queries in parallel
        const [images, highlights, descriptions, specs, colors, variants] = await Promise.all([
            pool.query('SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort_order', [id]),
            pool.query('SELECT highlight FROM product_highlights WHERE product_id = ? ORDER BY sort_order', [id]),
            pool.query('SELECT paragraph FROM product_descriptions WHERE product_id = ? ORDER BY sort_order', [id]),
            pool.query('SELECT section_name, spec_key, spec_value FROM product_specifications WHERE product_id = ?', [id]),
            pool.query('SELECT color_name, hex_code FROM product_color_options WHERE product_id = ?', [id]),
            pool.query('SELECT label, in_stock, price, original_price, discount_label FROM product_variants WHERE product_id = ?', [id]),
        ]);

        // Build nested specs object
        const specificationsObj = {};
        for (const spec of specs[0]) {
            (specificationsObj[spec.section_name] ??= {})[spec.spec_key] = spec.spec_value;
        }

        return {
            id: product.id,
            name: product.title,
            brand: product.brand,
            category: product.category,
            price: Number(product.price),
            mrp: Number(product.original_price),
            discount: parseDiscount(product.discount_label),
            rating: Number(product.rating),
            review_count: product.review_count,
            reviews: product.reviews_text,
            stock_quantity: product.stock,
            images: images[0].map(i => i.image_url),
            description: descriptions[0].map(d => d.paragraph),
            highlights: highlights[0].map(h => h.highlight),
            specifications: specificationsObj,
            colorOptions: colors[0].map(c => ({ name: c.color_name, hex: c.hex_code })),
            variants: variants[0].map(v => ({
                label: v.label,
                inStock: Boolean(v.in_stock),
                price: v.price ? Number(v.price) : undefined,
                originalPrice: v.original_price ? Number(v.original_price) : undefined,
                discountLabel: v.discount_label || undefined
            })),
            subcategory: product.subcategory,
            fAssured: Boolean(product.f_assured),
            seller: product.seller,
            sellerRating: product.seller_rating ? Number(product.seller_rating) : null,
            sellerYears: product.seller_years,
            exchangeValue: product.exchange_value
        };
    }
};

module.exports = ProductModel;
