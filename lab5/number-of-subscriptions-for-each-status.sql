SELECT 
    ss.name AS subscription_status,
    COUNT(s.id) AS subscriptions_count
FROM 
    subscriptions s
JOIN 
    subscription_states ss ON s.fk_status_id = ss.id
GROUP BY 
    ss.name
ORDER BY 
    subscriptions_count DESC;