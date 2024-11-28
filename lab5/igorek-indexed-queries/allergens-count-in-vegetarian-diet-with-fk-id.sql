SELECT 
    a.name AS allergen_name,
    COUNT(ia.fk_allergen_id) AS allergen_count
FROM 
    meals m
JOIN 
    diet_types dt ON dt.id = m.fk_diet_type_id
JOIN 
    meal_ingredients mi ON mi.fk_meal_id = m.id
JOIN 
    ingredients i ON i.id = mi.fk_ingredient_id
JOIN 
    ingredient_allergens ia ON ia.fk_ingredient_id = i.id
RIGHT JOIN 
    allergens a ON a.id = ia.fk_allergen_id
WHERE 
    fk_diet_type_id = 1
GROUP BY 
    a.name
ORDER BY 
    allergen_count DESC;