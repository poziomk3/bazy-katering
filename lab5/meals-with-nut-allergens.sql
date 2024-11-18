SELECT 
    m.id AS meal_id,
    m.name AS meal_name,
    mc.name AS meal_category
FROM 
    meals m
JOIN 
    meal_ingredients mi ON m.id = mi.fk_meal_id
JOIN 
    ingredients i ON mi.fk_ingredient_id = i.id
JOIN 
    ingredient_allergens ia ON i.id = ia.fk_ingredient_id
JOIN 
    allergens a ON ia.fk_allergen_id = a.id
JOIN 
    meal_categories mc ON m.fk_meal_category_id = mc.id
WHERE 
    a.id IN (1, 2, 14)
GROUP BY 
    m.id, m.name, mc.name
ORDER BY 
    m.name;