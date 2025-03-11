CREATE DATABASE IF NOT EXISTS cities_record_db;

USE cities_record_db;

-- Drop existing table if it exists
DROP TABLE IF EXISTS city;

-- Create table with the exact structure that TypeORM expects
CREATE TABLE IF NOT EXISTS city (
    id VARCHAR(36) PRIMARY KEY,
    roll INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    name_native VARCHAR(255),
    country VARCHAR(255),
    continent VARCHAR(255),
    latitude VARCHAR(50),
    longitude VARCHAR(50),
    population VARCHAR(50),
    founded VARCHAR(50),
    landmarks TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL
);

-- Grant proper permissions
GRANT ALL PRIVILEGES ON cities_record_db.* TO 'developer'@'%';
FLUSH PRIVILEGES;
