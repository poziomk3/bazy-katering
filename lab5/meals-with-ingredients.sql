SELECT 
    m.name AS meal_name,
    i.name AS ingredient_name,
    i.kilocalories AS kilocalories,
    i.fat AS fat_content,
	i.protein AS protein_content,
    i.carbohydrates AS carbohydrates_content,
    i.sugar AS sugar_content
FROM 
    meals m
JOIN 
    meal_ingredients mi ON m.id = mi.fk_meal_id
JOIN 
    ingredients i ON mi.fk_ingredient_id = i.id
ORDER BY 
    m.name, i.name;