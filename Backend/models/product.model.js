const pool = require('../config/db');

const ProductModel = {
    /**
     * Get all products with optional filters.
     * Filtering done in SQL for efficiency.
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
            sql += ' AND (LOWER(p.category) = LOWER(?) OR p.category_id = ?)';
            params.push(filters.category, filters.category);
        }

        if (filters.search) {
            sql += ' AND (LOWER(p.title) LIKE LOWER(?) OR LOWER(p.brand) LIKE LOWER(?))';
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm);
        }

        if (filters.brands) {
            const brandList = filters.brands.split(',').map(b => b.trim());
            const brandPlaceholders = brandList.map(() => 'LOWER(p.brand) LIKE LOWER(?)').join(' OR ');
            sql += ` AND (${brandPlaceholders})`;
            brandList.forEach(b => params.push(`%${b}%`));
        }

        if (filters.minRating && Number(filters.minRating) > 0) {
            sql += ' AND p.rating >= ?';
            params.push(Number(filters.minRating));
        }

        if (filters.minPrice && Number(filters.minPrice) > 0) {
            sql += ' AND p.price >= ?';
            params.push(Number(filters.minPrice));
        }

        if (filters.maxPrice && Number(filters.maxPrice) > 0) {
            sql += ' AND p.price <= ?';
            params.push(Number(filters.maxPrice));
        }

        if (filters.freeShipping === 'true') {
            sql += ' AND p.price > 499';
        }

        sql += ' ORDER BY p.id';

        const [rows] = await pool.query(sql, params);

        // Map to frontend-expected shape
        return rows.map(row => ({
            id: row.id,
            name: row.title,
            brand: row.brand,
            category: row.category,
            price: Number(row.price),
            mrp: Number(row.original_price),
            discount: parseInt((row.discount_label || '0').replace('% off', '')) || 0,
            rating: Number(row.rating),
            review_count: row.review_count,
            stock_quantity: row.stock,
            image_url: row.image_url || null,
            description: '',  // Not needed for list view
            subcategory: row.subcategory
        }));
    },

    /**
     * Get a single product by ID with all related data.
     */
    async getById(id) {
        // Main product
        const [products] = await pool.query(
            `SELECT p.* FROM products p WHERE p.id = ?`, [id]
        );
        if (products.length === 0) return null;

        const product = products[0];

        // Fetch all related data in parallel
        const [images] = await pool.query(
            'SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort_order', [id]
        );
        const [highlights] = await pool.query(
            'SELECT highlight FROM product_highlights WHERE product_id = ? ORDER BY sort_order', [id]
        );
        const [descriptions] = await pool.query(
            'SELECT paragraph FROM product_descriptions WHERE product_id = ? ORDER BY sort_order', [id]
        );
        const [specs] = await pool.query(
            'SELECT section_name, spec_key, spec_value FROM product_specifications WHERE product_id = ?', [id]
        );
        const [colors] = await pool.query(
            'SELECT color_name, hex_code FROM product_color_options WHERE product_id = ?', [id]
        );
        const [variants] = await pool.query(
            'SELECT label, in_stock, price, original_price, discount_label FROM product_variants WHERE product_id = ?', [id]
        );

        // Build specifications object { "General": { "Brand": "HP", ... }, ... }
        const specificationsObj = {};
        for (const spec of specs) {
            if (!specificationsObj[spec.section_name]) {
                specificationsObj[spec.section_name] = {};
            }
            specificationsObj[spec.section_name][spec.spec_key] = spec.spec_value;
        }

        // Map to frontend-expected shape
        return {
            id: product.id,
            name: product.title,
            brand: product.brand,
            category: product.category,
            price: Number(product.price),
            mrp: Number(product.original_price),
            discount: parseInt((product.discount_label || '0').replace('% off', '')) || 0,
            rating: Number(product.rating),
            review_count: product.review_count,
            reviews: product.reviews_text,
            stock_quantity: product.stock,
            images: images.map(i => i.image_url),
            description: descriptions.map(d => d.paragraph),
            highlights: highlights.map(h => h.highlight),
            specifications: specificationsObj,
            colorOptions: colors.map(c => ({ name: c.color_name, hex: c.hex_code })),
            variants: variants.map(v => ({
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
