WITH daily_deliveries AS (
    SELECT 
        DATE_TRUNC('day', deliveries.date) AS delivery_day,
        COUNT(deliveries.id) AS delivery_count
    FROM 
        deliveries
    GROUP BY 
        DATE_TRUNC('day', deliveries.date)
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