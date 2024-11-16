SELECT 
    e.fk_user_id AS employee_id,
    u.name AS first_name,
    u.surname AS last_name,
    COUNT(d.id) AS deliveries_count
FROM 
    deliveries d
JOIN 
    employees e ON d.fk_employee_id = e.fk_user_id
JOIN 
    users u ON e.fk_user_id = u.id
GROUP BY 
    e.fk_user_id, u.name, u.surname
ORDER BY 
    deliveries_count DESC;