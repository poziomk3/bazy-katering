SELECT DISTINCT 
    a.street,
    a.building_number,
    a.flat_number,
    a.city,
    a.postcode,
    a.country,
    u.name AS courier_name,
    u.surname AS courier_surname,
	dp.date AS delivery_date
FROM 
    addresses a
JOIN 
    customers c ON c.id = a.fk_customers_id
JOIN 
    subscriptions s ON s.fk_customer_id = c.id
JOIN 
    deliveries d ON d.fk_subscription_id = s.id
JOIN 
    employees e ON e.fk_user_id = d.fk_employee_id
JOIN 
    users u ON u.id = e.fk_user_id
JOIN 
    positions p ON p.id = e.fk_position_id
JOIN
	subscription_daily_plans sdp ON sdp.fk_subscription_id = s.id
JOIN
	daily_plans dp ON dp.id = sdp.fk_daily_plan_id
WHERE 
    p.name = 'Courier';