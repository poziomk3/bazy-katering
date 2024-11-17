SELECT 
    m.id AS meal_id,
    m.name AS meal_name,
    ROUND(COALESCE(SUM(i.fat), 0), 2) AS total_fat
FROM 
    meals m
LEFT JOIN 
    meal_ingredients mi ON mi.fk_meal_id = m.id
JOIN 
    ingredients i ON i.id = mi.fk_ingredient_id
GROUP BY 
    m.id, m.name
ORDER BY 
    total_fat ASC;