SELECT 
    m.id AS meal_id,
    m.name AS meal_name,
    ROUND(
        POWER(SUM(i.protein), 2) / NULLIF(SUM(i.fat + i.sugar + i.carbohydrates), 0),
        2
    ) AS healthiness_score,
    ROUND(SUM(i.fat), 2) AS total_fat,
    ROUND(SUM(i.sugar), 2) AS total_sugar,
    ROUND(SUM(i.protein),2) AS total_protein,
    ROUND(SUM(i.carbohydrates), 2) AS total_carbohydrates
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
