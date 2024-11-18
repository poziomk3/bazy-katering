SELECT 
    a.city,
    ROUND(COALESCE(AVG(total_deliveries), 0), 2) as avg_deliveries_per_customer 
FROM 
    customers c
LEFT JOIN
	addresses a ON a.id = c.fk_address_id
LEFT JOIN
	(
	SELECT 
		s.fk_customer_id AS customer_id, 
		COUNT(d.id) AS total_deliveries
	FROM
		subscriptions s
	RIGHT JOIN
		deliveries d ON s.id = d.fk_subscription_id
	GROUP BY
		s.fk_customer_id
	) AS delivery_counts ON delivery_counts.customer_id = c.id
GROUP BY
    a.city
ORDER BY
	avg_deliveries_per_customer DESC, a.city ASC;
