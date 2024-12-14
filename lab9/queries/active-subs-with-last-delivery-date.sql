SELECT 
    u.name AS client_name,
    u.surname AS client_surname,
    s.id AS subscription_id,
    MAX(dp.date) AS last_delivery_date
FROM 
    subscriptions s
JOIN 
    customers c ON s.fk_customer_id = c.id
JOIN 
    users u ON c.fk_user_id = u.id
LEFT JOIN 
    deliveries d ON s.id = d.fk_subscription_id
JOIN
	subscription_daily_plans sdp ON sdp.fk_subscription_id = s.id
JOIN
	daily_plans dp ON dp.id = sdp.fk_daily_plan_id
WHERE 
    s.fk_status_id = (SELECT id FROM subscription_states WHERE name = 'active')
GROUP BY 
    u.name, u.surname, s.id;