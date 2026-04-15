const pool = require('../config/db');

const HomeModel = {
    /**
     * Get all categories.
     */
    async getCategories() {
        const [rows] = await pool.query('SELECT id, label, icon FROM categories ORDER BY id');
        return rows;
    },

    /**
     * Get all banner image URLs.
     */
    async getBanners() {
        const [rows] = await pool.query('SELECT image_url FROM banners ORDER BY sort_order');
        return rows.map(r => r.image_url);
    },

    /**
     * Get home sections with their products.
     * Fixed N+1: single JOIN query instead of per-section query.
     */
    async getHomeSections() {
        // Fetch sections and their products in one JOIN query
        const [rows] = await pool.query(
            `SELECT hs.id, hs.title, hs.bg_color, hs.category_id, hs.sort_order,
                    hsp.product_id, hsp.sort_order AS product_sort
             FROM home_sections hs
             LEFT JOIN home_section_products hsp ON hsp.section_id = hs.id
             ORDER BY hs.sort_order, hsp.sort_order`
        );

        // Group by section using a Map
        const sectionsMap = new Map();
        for (const row of rows) {
            if (!sectionsMap.has(row.id)) {
                sectionsMap.set(row.id, {
                    id: row.id,
                    title: row.title,
                    bgColor: row.bg_color,
                    categoryId: row.category_id,
                    productIds: []
                });
            }
            if (row.product_id) {
                sectionsMap.get(row.id).productIds.push(row.product_id);
            }
        }

        return Array.from(sectionsMap.values());
    },

    /**
     * Get complete data bundle. Parallel fetches.
     */
    async getAllData() {
        const [categories, banners, homeSections, [products]] = await Promise.all([
            this.getCategories(),
            this.getBanners(),
            this.getHomeSections(),
            pool.query(
                `SELECT p.*,
                        (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order LIMIT 1) AS first_image
                 FROM products p ORDER BY p.id`
            )
        ]);

        return { categories, banners, homeSections, products };
    }
};

module.exports = HomeModel;
