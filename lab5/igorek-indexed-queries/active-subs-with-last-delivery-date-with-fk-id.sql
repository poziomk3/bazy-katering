SELECT 
    u.name AS client_name,
    u.surname AS client_surname,
    s.id AS subscription_id,
    MAX(d.date) AS last_delivery_date
FROM 
    subscriptions s
JOIN 
    customers c ON s.fk_customer_id = c.id
JOIN 
    users u ON c.fk_user_id = u.id
LEFT JOIN 
    deliveries d ON s.id = d.fk_subscription_id
WHERE 
    s.fk_status_id = 1
GROUP BY 
    u.name, u.surname, s.id;