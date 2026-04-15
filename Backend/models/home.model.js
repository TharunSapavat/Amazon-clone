const pool = require('../config/db');

const HomeModel = {
    /**
     * Get all categories.
     */
    async getCategories() {
        const [rows] = await pool.query(
            'SELECT id, label, icon FROM categories ORDER BY id'
        );
        return rows;
    },

    /**
     * Get all banner image URLs.
     */
    async getBanners() {
        const [rows] = await pool.query(
            'SELECT image_url FROM banners ORDER BY sort_order'
        );
        return rows.map(r => r.image_url);
    },

    /**
     * Get home sections with their products.
     */
    async getHomeSections() {
        const [sections] = await pool.query(
            'SELECT id, title, bg_color, category_id, sort_order FROM home_sections ORDER BY sort_order'
        );

        for (const section of sections) {
            const [products] = await pool.query(
                `SELECT hsp.product_id
                 FROM home_section_products hsp
                 WHERE hsp.section_id = ?
                 ORDER BY hsp.sort_order`,
                [section.id]
            );
            section.productIds = products.map(p => p.product_id);
            section.bgColor = section.bg_color;
            section.categoryId = section.category_id;
            // Clean up DB column names
            delete section.bg_color;
            delete section.category_id;
            delete section.sort_order;
        }

        return sections;
    },

    /**
     * Get complete data bundle (categories + banners + homeSections + products).
     */
    async getAllData() {
        const [categories, banners, homeSections] = await Promise.all([
            this.getCategories(),
            this.getBanners(),
            this.getHomeSections()
        ]);

        // Get all products (basic info for the data endpoint)
        const [products] = await pool.query(
            `SELECT p.*,
                    (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order LIMIT 1) AS first_image
             FROM products p ORDER BY p.id`
        );

        return { categories, banners, homeSections, products };
    }
};

module.exports = HomeModel;
