SELECT 
    m.id AS meal_id,
    m.name AS meal_name,
    ROUND(
        POWER(SUM(i.protein), 2) / NULLIF(SUM(i.fat + i.sugar + i.carbohydrates), 0),
        2
    ) AS healthiness_score,
    SUM(i.fat) AS total_fat,
    SUM(i.sugar) AS total_sugar,
    SUM(i.protein) AS total_protein,
    SUM(i.carbohydrates) AS total_carbohydrates
FROM 
    meals m
LEFT JOIN 
    meal_ingredients mi ON mi.fk_meal_id = m.id
LEFT JOIN 
    ingredients i ON i.id = mi.fk_ingredient_id
GROUP BY 
    m.id, m.name
ORDER BY 
    healthiness_score DESC;
