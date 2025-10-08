# BomCorte Black Friday Landing Page (PHP Version)

This is a server-side PHP and MySQL version of the original React application.

## Setup Instructions

### 1. Prerequisites
- A web server with PHP 7.4 or higher (e.g., Apache, Nginx).
- A MySQL or MariaDB database server.
- A tool to manage your database (e.g., phpMyAdmin).

### 2. Database Setup
1. Create a new database in your MySQL server (e.g., `bomcorte_db`).
2. Import the `database.sql` file into your new database. This will create all the necessary tables and insert default content.

### 3. Application Configuration
1. Open the `config.php` file.
2. Update the database credentials (`DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`) to match your database setup.

### 4. File Uploads
1. Create a directory named `uploads` in the root of the project folder.
2. Ensure your web server has write permissions for this `uploads/` directory. On Linux/macOS, you can often do this with `chmod 755 uploads`. This is where images for the logo, background, and products will be stored.

### 5. Deployment
1. Upload all files (`index.php`, `admin.php`, `config.php`, `README.md`, `database.sql`) and the `uploads/` directory to your web server.
2. Remove all old `.tsx`, `.ts`, `.html`, and other React-related files.

### 6. Accessing the Application
- **Landing Page**: Navigate to `http://your-domain.com/index.php` or `http://your-domain.com/`.
- **Admin Panel**: Navigate to `http://your-domain.com/admin.php`.

### Default Admin Login
- **Email**: `admin@bomcorte.com`
- **Password**: `password123`

It is highly recommended to change the default admin password immediately after your first login.
