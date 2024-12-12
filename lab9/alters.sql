/* ZMIANA NAZWY DAILY_PLAN_MEALS*/
ALTER TABLE daily_plan_meals RENAME TO plan_positions;

/* DROP DATY Z DELIVERIES */
ALTER TABLE deliveries DROP COLUMN date;

/* ZMIANA POLACZENIA W ADRESACH Z 1:1 NA 1:N */
ALTER TABLE addresses ADD COLUMN fk_customers_id INTEGER;

UPDATE addresses 
SET fk_customers_id = customers.id
FROM customers
WHERE customers.fk_address_id = addresses.id;

ALTER TABLE addresses ALTER COLUMN fk_customers_id SET NOT NULL;

ALTER TABLE customers DROP COLUMN fk_address_id;

ALTER TABLE addresses
ADD CONSTRAINT fk_customers_id FOREIGN KEY (fk_customers_id) REFERENCES customers(id) ON DELETE SET NULL;

/* DODANIE POŁĄCZENIA PLAN POSITION Z DELIVERIES */
ALTER TABLE deliveries ADD COLUMN fk_plan_position_id INTEGER;

ALTER TABLE deliveries
ADD CONSTRAINT fk_plan_position_id FOREIGN KEY (fk_plan_position_id) REFERENCES plan_positions(id) ON DELETE SET NULL;