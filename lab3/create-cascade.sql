CREATE TABLE positions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL CHECK (name ~* '^[A-Za-z ]+$'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (created_at <= updated_at)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE CHECK (
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    ),
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL CHECK (name !~* '[0-9]'),
    surname VARCHAR(255) NOT NULL CHECK (surname !~* '[0-9]'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (created_at <= updated_at)
);

CREATE TABLE employees (
    fk_user_id INTEGER PRIMARY KEY,
    fk_position_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (created_at <= updated_at),
    FOREIGN KEY (fk_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (fk_position_id) REFERENCES positions(id) ON DELETE CASCADE
);

CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    building_number INTEGER NOT NULL CHECK (building_number > 0),
    flat_number INTEGER CHECK (flat_number > 0),
    street VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL CHECK (city ~* '^[A-Za-z ]+$'),
    postcode VARCHAR(255) NOT NULL CHECK (postcode ~* '^[A-Za-z0-9 -]+$'),
    country VARCHAR(255) NOT NULL CHECK (country IN ('Poland','Estonia')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (created_at <= updated_at)
);

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    fk_user_id INTEGER NOT NULL,
    fk_address_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (created_at <= updated_at),
    FOREIGN KEY (fk_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (fk_address_id) REFERENCES addresses(id) ON DELETE SET NULL
);

CREATE TABLE diet_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL CHECK (name ~* '^[A-Za-z ]+$'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (created_at <= updated_at)
);

CREATE TABLE subscription_states (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL CHECK (name ~* '^[A-Za-z ]+$'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (created_at <= updated_at)
);

CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    fk_customer_id INTEGER NOT NULL,
    fk_diet_type_id INTEGER ,
    fk_status_id INTEGER ,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (created_at <= updated_at),
    FOREIGN KEY (fk_customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (fk_diet_type_id) REFERENCES diet_types(id) ON DELETE SET NULL,
    FOREIGN KEY (fk_status_id) REFERENCES subscription_states(id) ON DELETE SET NULL
);

CREATE TABLE deliveries (
    id SERIAL PRIMARY KEY,
    date TIMESTAMP NOT NULL CHECK (date >= CURRENT_DATE),
    fk_subscription_id INTEGER NOT NULL,
    fk_employee_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (created_at <= updated_at),
    FOREIGN KEY (fk_subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE,
    FOREIGN KEY (fk_employee_id) REFERENCES employees(fk_user_id) ON DELETE SET NULL
);

CREATE TABLE allergens (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (created_at <= updated_at)
);

CREATE TABLE ingredients_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL CHECK (name ~* '^[A-Za-z ]+$'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (created_at <= updated_at)
);

CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL  CHECK (name ~* '^[A-Za-z ]+$'),
    kilocalories NUMERIC CHECK (kilocalories >= 0),
    fat NUMERIC CHECK (fat >= 0 AND fat <= 100),
    protein NUMERIC CHECK (protein >= 0 AND protein <= 100),
    carbohydrates NUMERIC CHECK (carbohydrates >= 0 AND carbohydrates <= 100),
    sugar NUMERIC CHECK (sugar >= 0 AND sugar <= carbohydrates),
    fk_ingredient_category_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (created_at <= updated_at),
    FOREIGN KEY (fk_ingredient_category_id) REFERENCES ingredients_categories(id) ON DELETE SET NULL
);

CREATE TABLE ingredient_allergens (
    id SERIAL PRIMARY KEY,
    fk_ingredient_id INTEGER NOT NULL,
    fk_allergen_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (created_at <= updated_at),
    FOREIGN KEY (fk_ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE,
    FOREIGN KEY (fk_allergen_id) REFERENCES allergens(id) ON DELETE CASCADE
);

CREATE TABLE meal_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL CHECK  (name ~* '^[A-Za-z ]+$'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (created_at <= updated_at)
);

CREATE TABLE meals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL CHECK (name ~* '^[A-Za-z ]+$'),
    fk_meal_category_id INTEGER,
    fk_diet_type_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (created_at <= updated_at),
    FOREIGN KEY (fk_meal_category_id) REFERENCES meal_categories(id) ON DELETE SET NULL,
    FOREIGN KEY (fk_diet_type_id) REFERENCES diet_types(id) ON DELETE SET NULL
);

CREATE TABLE meal_ingredients (
    id SERIAL PRIMARY KEY,
    fk_meal_id INTEGER NOT NULL,
    fk_ingredient_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (created_at <= updated_at),
    FOREIGN KEY (fk_meal_id) REFERENCES meals(id) ON DELETE CASCADE,
    FOREIGN KEY (fk_ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
);

CREATE TABLE daily_plans (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL CHECK (date >= CURRENT_DATE),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (created_at <= updated_at)
);

CREATE TABLE daily_plan_meals (
    id SERIAL PRIMARY KEY,
    fk_daily_plan_id INTEGER NOT NULL,
    fk_meal_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (created_at <= updated_at),
    FOREIGN KEY (fk_meal_id) REFERENCES meals(id) ON DELETE CASCADE,
    FOREIGN KEY (fk_daily_plan_id) REFERENCES daily_plans(id) ON DELETE CASCADE
);

CREATE TABLE subscription_daily_plans (
    id SERIAL PRIMARY KEY,
    fk_subscription_id INTEGER NOT NULL,
    fk_daily_plan_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (created_at <= updated_at),
    FOREIGN KEY (fk_subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE,
    FOREIGN KEY (fk_daily_plan_id) REFERENCES daily_plans(id) ON DELETE CASCADE
);
