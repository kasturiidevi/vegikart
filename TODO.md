# VegiKart - PHP + MySQL Database Setup (XAMPP) TODO

## Steps

### Step 1: Setup Project in XAMPP
- [x] Copy Project 2 (VegiKart) files into `C:\xampp\htdocs\vegikart\`

### Step 2: Database Connection
- [x] Create `config.php` — mysqli connection (127.0.0.1, root, empty password, vegikart_db)

### Step 3: Database Schema
- [x] Create `database.sql` — SQL script to create database + tables
- [x] Create `setup_database.php` — PHP script to auto-create DB, tables & seed data
- [x] Run setup → created database `vegikart_db` with 5 tables (users, categories, products, orders, order_items)
- [x] Seed data: 6 categories, 41 products

### Step 4: PHP Handlers
- [x] Create `register.php` — insert new user into `users` table (hashed password)
- [x] Create `login.php` — verify credentials against `users` table, start session

### Step 5: Update HTML Forms
- [x] Update `login2.html` — form posts to `login.php` (AJAX)
- [x] Update `signup2.html` — form posts to `register.php` (AJAX)
- [x] Update `project2.js` — login/signup handlers use fetch() to PHP endpoints

### Step 6: Test
- [x] Start Apache + MySQL in XAMPP (stopped conflicting MySQL80 service)
- [x] Visit `http://localhost/vegikart/setup_database.php` to create DB/tables
- [x] Test signup: `POST /register.php` → success (user_id 1 created)
- [x] Test login: `POST /login.php` → success (verified against MySQL)

## Completion Criteria
- [x] Database `vegikart_db` created with tables: users, categories, products, orders, order_items
- [x] Signup stores user in MySQL (not localStorage)
- [x] Login verifies against MySQL and redirects to home2.html

## Notes
- XAMPP's MariaDB is used (version 10.4.32), connection: root / empty password
- The standalone MySQL80 service was stopped (it occupied port 3306)
- To restart XAMPP MySQL later: open XAMPP Control Panel → Start MySQL

