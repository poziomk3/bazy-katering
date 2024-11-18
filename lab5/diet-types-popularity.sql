SELECT 
    dt.name AS diet_type,
    COUNT(s.id) AS total_subscriptions,
    COUNT(d.id) FILTER (WHERE d.date <= CURRENT_DATE + INTERVAL '1 month') AS total_subscriptions_next_month
FROM 
    subscriptions s
RIGHT JOIN
    diet_types dt ON dt.id = s.fk_diet_type_id
LEFT JOIN
	deliveries d ON d.fk_subscription_id = s.id
GROUP BY 
    dt.name
ORDER BY 
    total_subscriptions DESC;