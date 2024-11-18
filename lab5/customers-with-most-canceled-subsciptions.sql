SELECT 
	u.id,
	u.name || ' ' || u.surname AS customer,
	COUNT(s.id) AS total_subscriptions,
	COALESCE(SUM(canceled_counts.total_canceled_subscriptions), 0) AS total_canceled_subscriptions
FROM
	customers c
LEFT JOIN
	users u ON u.id = c.fk_user_id
LEFT JOIN 
	subscriptions s ON s.fk_customer_id = c.id
LEFT JOIN
	(
		SELECT 
			COUNT(s.id) AS total_canceled_subscriptions,
			s.fk_customer_id AS fk_customer_id
		FROM
			subscriptions s
		JOIN
			subscription_states ss ON ss.id = s.fk_status_id
		WHERE
			ss.name = 'canceled'
		GROUP BY
			s.fk_customer_id
	) AS canceled_counts ON canceled_counts.fk_customer_id = c.id
GROUP BY
	u.id
ORDER BY
	total_canceled_subscriptions DESC, total_subscriptions DESC;
