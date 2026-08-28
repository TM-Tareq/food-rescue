-- ============================================================================
-- FoodRescue Relational Database Schema for MySQL 8.x
-- ============================================================================

CREATE DATABASE IF NOT EXISTS food_rescue_db;
USE food_rescue_db;

-- 1. Users Table (Multi-role Auth)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    role ENUM('RESTAURANT', 'NGO', 'VOLUNTEER', 'ADMIN') NOT NULL,
    status ENUM('PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED') DEFAULT 'PENDING_VERIFICATION',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Restaurant Profiles
CREATE TABLE IF NOT EXISTS restaurants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    restaurant_name VARCHAR(150) NOT NULL,
    trade_license VARCHAR(80),
    address VARCHAR(255) NOT NULL,
    latitude DOUBLE,
    longitude DOUBLE,
    rating DOUBLE DEFAULT 5.0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. NGO Profiles
CREATE TABLE IF NOT EXISTS ngos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    ngo_name VARCHAR(150) NOT NULL,
    registration_number VARCHAR(80) NOT NULL,
    service_area VARCHAR(150),
    daily_capacity_servings INT DEFAULT 100,
    address VARCHAR(255) NOT NULL,
    latitude DOUBLE,
    longitude DOUBLE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Volunteer Profiles
CREATE TABLE IF NOT EXISTS volunteers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    full_name VARCHAR(120) NOT NULL,
    vehicle_type ENUM('WALK', 'BICYCLE', 'MOTORCYCLE', 'CAR', 'VAN') DEFAULT 'MOTORCYCLE',
    max_capacity_kg DOUBLE DEFAULT 15.0,
    service_zone VARCHAR(150),
    is_online BOOLEAN DEFAULT FALSE,
    reliability_score DOUBLE DEFAULT 5.0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Surplus Food Posts (Donor Postings & Hybrid Marketplace)
CREATE TABLE IF NOT EXISTS surplus_food_posts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    quantity_servings INT NOT NULL,
    category ENUM('COOKED', 'PACKAGED', 'BAKERY', 'RAW_PRODUCE') NOT NULL,
    original_price DECIMAL(10,2),
    discount_price DECIMAL(10,2) DEFAULT 0.00,
    is_donatable_to_ngo BOOLEAN DEFAULT TRUE,
    storage_temp ENUM('HOT', 'COLD', 'ROOM_TEMP') DEFAULT 'ROOM_TEMP',
    prep_time TIMESTAMP,
    pickup_deadline TIMESTAMP NOT NULL,
    status ENUM('POSTED', 'NGO_CLAIMED', 'FLASH_SALE', 'PICKED_UP', 'DELIVERED', 'EXPIRED') DEFAULT 'POSTED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- 6. Claims & Rescue Missions
CREATE TABLE IF NOT EXISTS claims (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_id BIGINT NOT NULL,
    ngo_id BIGINT,
    consumer_user_id BIGINT,
    claim_type ENUM('NGO_FREE_DONATION', 'CONSUMER_DISCOUNT_BUY') NOT NULL,
    status ENUM('MATCHED', 'ACCEPTED', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED', 'DISPUTED') DEFAULT 'MATCHED',
    claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES surplus_food_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (ngo_id) REFERENCES ngos(id) ON DELETE SET NULL,
    FOREIGN KEY (consumer_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 7. Deliveries & Transits
CREATE TABLE IF NOT EXISTS deliveries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    claim_id BIGINT NOT NULL UNIQUE,
    volunteer_id BIGINT,
    pickup_otp VARCHAR(6),
    delivery_otp VARCHAR(6),
    status ENUM('ASSIGNED', 'PICKED_UP', 'DELIVERED', 'FAILED') DEFAULT 'ASSIGNED',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP,
    FOREIGN KEY (claim_id) REFERENCES claims(id) ON DELETE CASCADE,
    FOREIGN KEY (volunteer_id) REFERENCES volunteers(id) ON DELETE SET NULL
);
