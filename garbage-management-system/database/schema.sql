-- ============================================================
-- GARBAGE MANAGEMENT SYSTEM - MySQL Database Schema
-- Usage: mysql -u root -p < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS garbage_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE garbage_db;

-- TABLE: waste_types
CREATE TABLE IF NOT EXISTS waste_types (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    color       VARCHAR(20) NOT NULL,
    icon        VARCHAR(50) NOT NULL,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE
);

-- TABLE: users
CREATE TABLE IF NOT EXISTS users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(150) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    phone       VARCHAR(15) NOT NULL,
    address     TEXT NOT NULL,
    role        ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role  (role)
);

-- TABLE: garbage_requests
CREATE TABLE IF NOT EXISTS garbage_requests (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    waste_type_id   BIGINT NOT NULL,
    pickup_address  TEXT NOT NULL,
    scheduled_date  DATE NOT NULL,
    collection_date DATE,
    collector_name  VARCHAR(150),
    route_info      VARCHAR(255),
    notes           TEXT,
    status          ENUM('PENDING','IN_PROGRESS','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PENDING',
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_request_user      FOREIGN KEY (user_id)       REFERENCES users(id)       ON DELETE CASCADE,
    CONSTRAINT fk_request_waste     FOREIGN KEY (waste_type_id) REFERENCES waste_types(id) ON DELETE RESTRICT,
    INDEX idx_user_id    (user_id),
    INDEX idx_status     (status),
    INDEX idx_waste_type (waste_type_id)
);

-- ============================================================
-- SAMPLE DATA
-- ============================================================

INSERT IGNORE INTO waste_types (name, description, color, icon, is_active) VALUES
('Wet Waste',         'Food scraps, vegetable peels, leftover food, tea bags',          '#4CAF50', 'droplet',        TRUE),
('Dry Waste',         'Paper, cardboard, plastic bottles, glass, metal cans',            '#2196F3', 'recycle',        TRUE),
('Medical Waste',     'Syringes, medicines, bandages - requires special handling',       '#F44336', 'hospital',       TRUE),
('Electronic Waste',  'Old phones, computers, batteries, cables, chargers',              '#FF9800', 'zap',            TRUE),
('Hazardous Waste',   'Chemicals, paint, pesticides, motor oil',                         '#9C27B0', 'alert-triangle', TRUE),
('Construction Waste','Bricks, cement, wood scraps, tiles, pipes',                       '#795548', 'hard-hat',       TRUE);

-- Default admin user (password: admin123 BCrypt hashed)
INSERT IGNORE INTO users (name, email, password, phone, address, role, is_active) VALUES
('System Admin', 'admin@garbage.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lF',
 '9999999999', 'Municipal Corporation Office, City Center', 'ADMIN', TRUE);

-- Sample users
INSERT IGNORE INTO users (name, email, password, phone, address, role, is_active) VALUES
('Rajesh Kumar',  'rajesh@example.com',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lF', '9876543210', '12 MG Road, Raipur',     'USER', TRUE),
('Priya Sharma',  'priya@example.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lF', '9876543211', '45 Civil Lines, Raipur',  'USER', TRUE),
('Amit Verma',    'amit@example.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lF', '9876543212', '78 Shankar Nagar, Raipur','USER', TRUE);

-- Sample requests (assumes user IDs 2,3,4 inserted above)
INSERT IGNORE INTO garbage_requests
    (user_id, waste_type_id, pickup_address, scheduled_date, collection_date, collector_name, route_info, notes, status) VALUES
(2, 1, '12 MG Road, Raipur',     '2024-12-20', '2024-12-21', 'Ramesh Yadav', 'Zone A - Route 1', 'Please collect before 9 AM', 'COMPLETED'),
(2, 2, '12 MG Road, Raipur',     '2024-12-25', NULL,         NULL,           NULL,              'Monthly dry waste',          'PENDING'),
(3, 3, '45 Civil Lines, Raipur', '2024-12-22', '2024-12-22', 'Suresh Patel', 'Zone B - Route 3', 'Medical kit disposal',       'IN_PROGRESS'),
(4, 4, '78 Shankar Nagar',       '2024-12-26', NULL,         NULL,           NULL,              'Old laptop and cables',       'PENDING');
