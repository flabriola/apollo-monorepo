CREATE DATABASE IF NOT EXISTS apollo_guide_db;
USE apollo_guide_db;

-- Restaurants Table
CREATE TABLE restaurant (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL
) AUTO_INCREMENT = 100000;

-- Menus Table
CREATE TABLE menu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    active BOOLEAN NOT NULL,
    pdf_url VARCHAR(512),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(id) ON DELETE CASCADE
) AUTO_INCREMENT = 200000;

-- Dishes Table
CREATE TABLE dish (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    active BOOLEAN NOT NULL,
    FOREIGN KEY (menu_id) REFERENCES menu(id) ON DELETE CASCADE
) AUTO_INCREMENT = 300000;

-- Ingredients Table
CREATE TABLE ingredient (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL COLLATE utf8mb4_bin UNIQUE,
    description TEXT
) AUTO_INCREMENT = 400000;

-- Allergens Table
CREATE TABLE allergen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COLLATE utf8mb4_bin UNIQUE
) AUTO_INCREMENT = 500000;

-- Diets Table
CREATE TABLE diet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COLLATE utf8mb4_bin UNIQUE
) AUTO_INCREMENT = 600000;

-- Ingredient-Allergen Relationship
CREATE TABLE ingredient_allergen (
    ingredient_id INT NOT NULL,
    allergen_id INT NOT NULL,
    PRIMARY KEY (ingredient_id, allergen_id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredient(id) ON DELETE CASCADE,
    FOREIGN KEY (allergen_id) REFERENCES allergen(id) ON DELETE CASCADE
);

-- Ingredient-Diet Relationship
CREATE TABLE ingredient_diet (
    ingredient_id INT NOT NULL,
    diet_id INT NOT NULL,
    PRIMARY KEY (ingredient_id, diet_id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredient(id) ON DELETE CASCADE,
    FOREIGN KEY (diet_id) REFERENCES diet(id) ON DELETE CASCADE
);

-- Dish-Ingredient Relationship
CREATE TABLE dish_ingredient (
    dish_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    private BOOLEAN NOT NULL,
    description TEXT,
    PRIMARY KEY (dish_id, ingredient_id),
    FOREIGN KEY (dish_id) REFERENCES dish(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredient(id) ON DELETE CASCADE
);

-- Dish-Allergen-Cross-Contamination Relationship
CREATE TABLE dish_cc_allergen (
    dish_id INT NOT NULL,
    allergen_id INT NOT NULL,
    reason ENUM('G', 'F', 'BK', 'BO', 'P', 'M', 'BF', 'S') NOT NULL,
    ingredient_id INT NULL,
    description TEXT NULL,
    PRIMARY KEY (dish_id, allergen_id, reason, ingredient_id),
    FOREIGN KEY (dish_id) REFERENCES dish(id) ON DELETE CASCADE,
    FOREIGN KEY (allergen_id) REFERENCES allergen(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredient(id) ON DELETE SET NULL
);

-- Audit Logging Table
CREATE TABLE audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(255) NOT NULL,
    row_id INT NOT NULL,
    action_type ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    old_value JSON NULL,
    new_value JSON NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by VARCHAR(255) NULL
) AUTO_INCREMENT = 700000;

-- Indexing for Performance
CREATE INDEX idx_menu_id ON dish (menu_id);
CREATE INDEX idx_restaurant_id ON menu (restaurant_id);
CREATE INDEX idx_ingredient_id ON ingredient_allergen (ingredient_id);
CREATE INDEX idx_allergen_id ON ingredient_allergen (allergen_id);
CREATE INDEX idx_ingredient_diet ON ingredient_diet (ingredient_id);
CREATE INDEX idx_diet_id ON ingredient_diet (diet_id);
CREATE INDEX idx_dish_ingredient ON dish_ingredient (dish_id, ingredient_id);
