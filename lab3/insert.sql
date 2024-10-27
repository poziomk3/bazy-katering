-- Insert into positions
INSERT INTO positions (name) VALUES
('Manager'),
('Cook'),
('Driver');

-- Insert into users
INSERT INTO users (email, password, name, surname) VALUES
('john.doe@example.com', 'password123', 'John', 'Doe'),
('jane.smith@example.com', 'password123', 'Jane', 'Smith'),
('alice.brown@example.com', 'password123', 'Alice', 'Brown');

-- Insert into employees
INSERT INTO employees (fk_user_id, fk_position_id) VALUES
(1, 1),
(2, 2),
(3, 3);

-- Insert into addresses
INSERT INTO addresses (building_number, flat_number, street, city, postcode, country) VALUES
(123, 12, 'Main Street', 'Warsaw', '00-001', 'Poland'),
(456, NULL, 'Oak Avenue', 'Gdansk', '80-001', 'Poland'),
(789, 3, 'Maple Road', 'Tallinn', '10115', 'Estonia');

-- Insert into customers
INSERT INTO customers (fk_user_id, fk_address_id) VALUES
(1, 1),
(2, 2),
(3, 3);

-- Insert into diet_types
INSERT INTO diet_types (name) VALUES
('Vegetarian'),
('Vegan'),
('Keto');

-- Insert into subscription_states
INSERT INTO subscription_states (name) VALUES
('Active'),
('Paused'),
('Cancelled');

-- Insert into subscriptions
INSERT INTO subscriptions (fk_customer_id, fk_diet_type_id, fk_status_id) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3);

-- Insert into deliveries
INSERT INTO deliveries (date, fk_subscription_id, fk_employee_id) VALUES
(CURRENT_DATE + INTERVAL '1 day', 1, 1),
(CURRENT_DATE + INTERVAL '2 days', 2, 2),
(CURRENT_DATE + INTERVAL '3 days', 3, 3);

-- Insert into allergens
INSERT INTO allergens (name) VALUES
('Gluten'),
('Peanuts'),
('Dairy');

-- Insert into ingredients_categories
INSERT INTO ingredients_categories (name) VALUES
('Vegetable'),
('Fruit'),
('Protein');

-- Insert into ingredients
INSERT INTO ingredients (name, kilocalories, fat, protein, carbohydrates, sugar, fk_ingredient_category_id) VALUES
('Broccoli', 55, 0.6, 3.7, 11.2, 2.6, 1),
('Apple', 52, 0.2, 0.3, 14.0, 10.4, 2),
('Chicken Breast', 165, 3.6, 31.0, 0, 0, 3);

-- Insert into ingredient_allergens
INSERT INTO ingredient_allergens (fk_ingredient_id, fk_allergen_id) VALUES
(1, 1),
(2, 2),
(3, 3);

-- Insert into meal_categories
INSERT INTO meal_categories (name) VALUES
('Breakfast'),
('Lunch'),
('Dinner');

-- Insert into meals
INSERT INTO meals (name, fk_meal_category_id, fk_diet_type_id) VALUES
('Oatmeal', 1, 1),
('Salad', 2, 2),
('Grilled Chicken', 3, 3);

-- Insert into meal_ingredients
INSERT INTO meal_ingredients (fk_meal_id, fk_ingredient_id) VALUES
(1, 1),
(2, 2),
(3, 3);

-- Insert into daily_plans
INSERT INTO daily_plans (date) VALUES
(CURRENT_DATE),
(CURRENT_DATE + INTERVAL '1 day'),
(CURRENT_DATE + INTERVAL '2 days');

-- Insert into daily_plan_meals
INSERT INTO daily_plan_meals (fk_meal_id, fk_daily_plan_id) VALUES
(1, 1),
(2, 2),
(3, 3);

-- Insert into subscription_daily_plans
INSERT INTO subscription_daily_plans (fk_subscription_id, fk_daily_plan_id) VALUES
(1, 1),
(2, 2),
(3, 3);
