SELECT 
	CURRENT_DATE AS date,
	ss.name AS subscription_state,
	u.name || ' ' || u.surname AS customer
FROM 
	subscriptions s
JOIN 
	subscription_states ss ON s.fk_status_id = ss.id
JOIN
	customers c ON s.fk_customer_id = c.id
JOIN
	users u ON c.fk_user_id = u.id
WHERE 
	ss.name = 'active'
	AND s.created_at <= NOW();