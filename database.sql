CREATE DATABASE IF NOT EXISTS vegikart_db;
USE vegikart_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(120) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    unit VARCHAR(30) DEFAULT '',
    description TEXT,
    image VARCHAR(500) DEFAULT '',
    rating DECIMAL(2,1) DEFAULT 4.5,
    discount INT DEFAULT 0,
    stock_info VARCHAR(80) DEFAULT '',
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_code VARCHAR(20) NOT NULL UNIQUE,
    user_id INT NULL,
    customer_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(120) NOT NULL,
    address TEXT NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    shipping DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'Placed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_name VARCHAR(120) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO categories (name) VALUES
('Fruits'),
('Vegetables'),
('Dairy & Milk'),
('Bakery'),
('Beverages'),
('Snacks')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO products (category_id, name, price, unit, description, image, rating, discount, stock_info) VALUES
(1, 'Fresh Apples', 120, '/kg', 'Fresh and juicy apples rich in vitamins.', 'https://tse2.mm.bing.net/th/id/OIP.3_BosVmdfve7m7g_XIJy9AHaHa?r=0&pid=Api&h=220&P=0', 4.5, 20, '82 Sold Today'),
(1, 'Bananas', 60, '/dozen', 'Sweet bananas packed with potassium and natural energy.', 'https://tse1.mm.bing.net/th/id/OIP.pGEt--hBA6xKPN5qxASI8gAAAA?r=0&pid=Api&h=220&P=0', 4.6, 15, '90 Sold Today'),
(1, 'Oranges', 120, '/kg', 'Fresh juicy oranges rich in Vitamin C and full of natural goodness.', 'https://tse1.mm.bing.net/th/id/OIP.zOuBzn-zZAuW_4xFiyaZ6gHaG3?r=0&pid=Api&h=220&P=0', 4.8, 20, '110 Sold Today'),
(1, 'Grapes', 150, '/kg', 'Sweet and seedless grapes, freshly picked for maximum freshness.', 'https://tse4.mm.bing.net/th/id/OIP.cFVllGbc7WQCBXvsDyCIQgHaHa?r=0&pid=Api&h=220&P=0', 4.7, 18, '75 Sold Today'),
(1, 'Mangoes', 180, '/kg', 'Delicious juicy mangoes with a naturally sweet tropical flavor.', 'https://tse2.mm.bing.net/th/id/OIP.-hWHu_UlU39eWkXkq2B-BAHaHa?r=0&pid=Api&h=220&P=0', 4.9, 25, '140 Sold Today'),
(1, 'Strawberries', 250, '/box', 'Fresh, juicy strawberries perfect for desserts, smoothies, and snacking.', 'https://i5.walmartimages.com/seo/Fresh-Strawberries-1-lb-Container_b54a64ad-e961-46cf-b60c-bc763716fb0b.a481cdfd237c5ab5438d5c9e90bead07.jpeg', 4.8, 30, '65 Sold Today'),
(2, 'Fresh Potatoes', 35, '/kg', 'Fresh potatoes perfect for fries, curries and snacks.', 'https://tse2.mm.bing.net/th/id/OIP.WMHwVWKKTLV3NyyWoU_1xwHaHa?r=0&pid=Api&h=220&P=0', 4.5, 10, '85 Sold Today'),
(2, 'Fresh Onions', 35, '/kg', 'Fresh onions with rich flavor, perfect for every recipe.', 'https://tse3.mm.bing.net/th/id/OIP.7zoV3hFW0N434hLj9Qux3AAAAA?r=0&pid=Api&h=220&P=0', 4.7, 20, '95 Sold Today'),
(2, 'Fresh Tomatoes', 40, '/kg', 'Farm-fresh tomatoes perfect for salads and curries.', 'https://tse3.mm.bing.net/th/id/OIP._VvJKJaEsGfCo7pU2j9ZDQHaHa?r=0&pid=Api&h=220&P=0', 4.8, 25, '120 Sold Today'),
(2, 'Fresh Carrots', 60, '/kg', 'Crunchy carrots rich in Vitamin A and full of freshness.', 'https://tse3.mm.bing.net/th/id/OIP.-nWRaFOsAKk0UXsvrWs7BwHaHa?r=0&pid=Api&h=220&P=0', 4.9, 18, '88 Sold Today'),
(2, 'Fresh Cabbage', 45, '/piece', 'Green fresh cabbage ideal for salads and healthy meals.', 'https://tse1.mm.bing.net/th/id/OIP.pRKJcZfLFIo6wvVVtqvWnAHaHa?r=0&pid=Api&h=220&P=0', 4.6, 15, '70 Sold Today'),
(2, 'Green Chilli', 80, '/kg', 'Fresh green chillies with natural spice and aroma.', 'https://tse2.mm.bing.net/th/id/OIP.xyQyh00Yy-k9mcZ5GezQfgHaHa?r=0&pid=Api&h=220&P=0', 4.7, 22, '65 Sold Today'),
(2, 'Fresh Ginger', 150, '/kg', 'Farm-fresh ginger with rich aroma and natural flavor.', 'https://tse3.mm.bing.net/th/id/OIP.yPDtqxfNKSsn-hB-Ky9QFwHaHa?r=0&pid=Api&h=220&P=0', 4.8, 20, '90 Sold Today'),
(2, 'Fresh Garlic', 180, '/kg', 'Fresh aromatic garlic, perfect for enhancing every dish.', 'https://static.vecteezy.com/system/resources/previews/027/216/058/original/garlic-garlic-garlic-transparent-background-ai-generated-free-png.png', 4.7, 18, '95 Sold Today'),
(3, 'Amul Milk', 55, '', 'The fresh and pure Amul cow milk.', 'https://tse2.mm.bing.net/th/id/OIP.NAOJRhik1jHK3UJSzy0gWwHaHa?r=0&pid=Api&h=220&P=0', 5.0, 10, 'Bestseller'),
(3, 'Amul Cheese', 136, '/pack', 'Creamy cheese slices perfect for sandwiches and pizzas.', 'https://tse2.mm.bing.net/th/id/OIP.RU4YRp1WE4DxoqWpxv26pAHaHa?r=0&pid=Api&h=220&P=0', 4.9, 30, '140 Sold Today'),
(3, 'Amul Butter', 130, '/pack', 'Rich creamy butter for cooking, baking and spreading.', 'https://tse3.mm.bing.net/th/id/OIP.9C-YbsGUkwnZduVAdvl0xwHaHa?r=0&pid=Api&h=220&P=0', 4.8, 25, '105 Sold Today'),
(3, 'Amul Paneer', 99, '/100g', 'Soft fresh paneer rich in protein and calcium.', 'https://tse1.mm.bing.net/th/id/OIP.qB3J2W2x3GBGXv-kwOqfVAHaHa?r=0&pid=Api&h=220&P=0', 4.9, 20, '90 Sold Today'),
(3, 'Amul Masti Dahi', 70, '/500g', 'Thick and creamy curd made from fresh milk.', 'https://tse4.mm.bing.net/th/id/OIP.EdN9A6E1YOrYujzhF3v9OwHaHa?r=0&pid=Api&h=220&P=0', 4.7, 18, '75 Sold Today'),
(3, 'Amul Ice Cream', 120, '/tub', 'Creamy Amul vanilla ice cream loved by all ages.', 'https://tse4.mm.bing.net/th/id/OIP.PU0oSJpNd8oD-8vn49Tb6gHaHa?r=0&pid=Api&h=220&P=0', 4.9, 30, '170 Sold Today'),
(4, 'Whole Wheat Bread', 45, '', 'Soft whole wheat bread baked fresh every morning.', 'https://tse2.mm.bing.net/th/id/OIP.NDrxVC3ztUVAe_5scAwh1QHaHa?r=0&pid=Api&h=220&P=0', 4.4, 20, 'Fresh Arrival'),
(4, 'Chocolate Cake', 450, '', 'Soft chocolate cake topped with rich creamy frosting.', 'https://tse3.mm.bing.net/th/id/OIP.Z8yZNCq_OkkRvPycpL4EIQHaHa?r=0&pid=Api&h=220&P=0', 4.9, 35, '130 Sold Today'),
(4, 'Milk Bikis', 50, '/pack', 'Crispy tea-time biscuits loved by everyone.', 'https://tse4.mm.bing.net/th/id/OIP.z-t5NDJgyWYsEfl7mWxOXwHaHa?r=0&pid=Api&h=220&P=0', 4.8, 20, '170 Sold Today'),
(4, 'Chocolate Cookies', 99, '', 'Crunchy chocolate cookies made with premium cocoa.', 'https://tse1.mm.bing.net/th/id/OIP.7FTXezKPW-2C_YEAsz_tyQHaHa?r=0&pid=Api&h=220&P=0', 4.9, 35, 'Top Rated'),
(4, 'Chocolate Donut', 70, '/piece', 'Fresh chocolate donut topped with colorful sprinkles.', 'https://tse4.mm.bing.net/th/id/OIP.SQIicSkz8_C3NLoZiwnBkQHaHa?r=0&pid=Api&h=220&P=0', 4.8, 28, '85 Sold Today'),
(5, 'Tropicana Orange Juice', 120, '/L', 'Refreshing orange juice made from real fruit.', '
