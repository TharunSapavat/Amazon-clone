CREATE DATABASE IF NOT EXISTS amazon_clone;
USE amazon_clone;

-- ============================================
--               USERS
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
--               CATEGORIES
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    icon VARCHAR(255) DEFAULT NULL
);

-- ============================================
--               BANNERS
-- ============================================
CREATE TABLE IF NOT EXISTS banners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image_url VARCHAR(500) NOT NULL,
    sort_order INT DEFAULT 0
);

-- ============================================
--               PRODUCTS
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    brand VARCHAR(200),
    category VARCHAR(100),
    category_id VARCHAR(50),
    subcategory VARCHAR(100),
    price DECIMAL(12, 2) NOT NULL,
    original_price DECIMAL(12, 2),
    discount_label VARCHAR(50),
    rating DECIMAL(3, 1) DEFAULT 0.0,
    reviews_text VARCHAR(100),
    review_count INT DEFAULT 0,
    f_assured BOOLEAN DEFAULT FALSE,
    stock INT DEFAULT 0,
    seller VARCHAR(200),
    seller_rating DECIMAL(3, 1),
    seller_years INT,
    exchange_value INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- ============================================
--         PRODUCT IMAGES
-- ============================================
CREATE TABLE IF NOT EXISTS product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================
--         PRODUCT HIGHLIGHTS
-- ============================================
CREATE TABLE IF NOT EXISTS product_highlights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    highlight TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================
--         PRODUCT DESCRIPTION (multi-paragraph)
-- ============================================
CREATE TABLE IF NOT EXISTS product_descriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    paragraph TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================
--         PRODUCT SPECIFICATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS product_specifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    section_name VARCHAR(100) NOT NULL,
    spec_key VARCHAR(200) NOT NULL,
    spec_value VARCHAR(500) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================
--         PRODUCT COLOR OPTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS product_color_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    color_name VARCHAR(100) NOT NULL,
    hex_code VARCHAR(10),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================
--         PRODUCT VARIANTS
-- ============================================
CREATE TABLE IF NOT EXISTS product_variants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    label VARCHAR(100) NOT NULL,
    in_stock BOOLEAN DEFAULT TRUE,
    price DECIMAL(12, 2),
    original_price DECIMAL(12, 2),
    discount_label VARCHAR(50),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================
--         HOME SECTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS home_sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    bg_color VARCHAR(20),
    category_id VARCHAR(50),
    sort_order INT DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- ============================================
--    HOME SECTION PRODUCTS (join table)
-- ============================================
CREATE TABLE IF NOT EXISTS home_section_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_id INT NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (section_id) REFERENCES home_sections(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================
--               CART ITEMS
-- ============================================
CREATE TABLE IF NOT EXISTS cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================
--               ORDERS
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    internal_order_id VARCHAR(50) UNIQUE NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    shipping_status ENUM('PROCESSING', 'SHIPPED', 'DELIVERED') DEFAULT 'PROCESSING',
    shipping_name VARCHAR(255) NOT NULL,
    shipping_address TEXT NOT NULL,
    estimated_delivery TIMESTAMP,
    delivered_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
--            ORDER ITEMS
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(12, 2) NOT NULL,
    is_returned BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================
--         SEED DEFAULT USER
-- ============================================
INSERT IGNORE INTO users (id, name, email, password) VALUES (1, 'Tharun', 'tharun.s23@iiits.in', 'zxcvbnm');
