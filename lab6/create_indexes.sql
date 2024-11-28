CREATE INDEX idx_subscriptions_fk_status_id ON subscriptions (fk_status_id);
CREATE INDEX idx_deliveries_fk_employee_id ON deliveries (fk_employee_id);
CREATE INDEX idx_group_by_fk_user_id ON deliveries (fk_employee_id);
CREATE INDEX idx_deliveries_date_trunc_day ON deliveries (date_trunc('day'::text, date));
CREATE INDEX idx_employees_fk_position_id ON employees  (fk_position_id);
CREATE INDEX idx_subscriptions_fk_status_id ON subscriptions (fk_status_id);
CREATE INDEX idx_delivieries_fk_subscription_id ON deliveries (fk_subscription_id);
CREATE INDEX idx_deliveries_subscription_date ON deliveries (fk_subscription_id, date DESC);
CREATE INDEX idx_deliveries_fk_subscription_id ON deliveries (fk_subscription_id);
CREATE INDEX idx_test_users_id_name_surname ON users (id, name, surname)