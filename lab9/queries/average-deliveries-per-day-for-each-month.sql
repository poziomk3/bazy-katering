WITH daily_deliveries AS (
    SELECT 
        DATE_TRUNC('day', dp.date) AS delivery_day,
        COUNT(d.id) AS delivery_count
    FROM 
        deliveries d
	LEFT JOIN
		subscriptions s ON s.id = d.fk_subscription_id
	JOIN
		subscription_daily_plans sdp ON sdp.fk_subscription_id = s.id
	JOIN
		daily_plans dp ON dp.id = sdp.fk_daily_plan_id
    GROUP BY 
        DATE_TRUNC('day', dp.date)
)
SELECT 
    TO_CHAR(DATE_TRUNC('month', delivery_day), 'Month YYYY') AS delivery_month,
    ROUND(AVG(delivery_count), 2) AS average_deliveries_per_day
FROM 
    daily_deliveries
GROUP BY 
    DATE_TRUNC('month', delivery_day)
ORDER BY 
    DATE_TRUNC('month', delivery_day);