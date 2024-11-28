DROP INDEX IF EXISTS idx_subscriptions_fk_status_id;
DROP INDEX IF EXISTS idx_deliveries_fk_employee_id;
DROP INDEX IF EXISTS idx_group_by_fk_user_id;
DROP INDEX IF EXISTS idx_deliveries_date_trunc_day;
DROP INDEX IF EXISTS idx_employees_fk_position_id;
DROP INDEX IF EXISTS idx_delivieries_fk_subscription_id;
DROP INDEX IF EXISTS idx_deliveries_subscription_date;
DROP INDEX IF EXISTS idx_deliveries_fk_subscription_id;
DROP INDEX IF EXISTS idx_test_users_id_name_surname;
DROP INDEX IF EXISTS idx_allergens_name

/* Do zmienionych querek igorka */
DROP INDEX IF EXISTS idx_subscriptions_active_created_at;
DROP INDEX IF EXISTS idx_meals_vegetarian;