WITH ranked_ingredients AS (
    SELECT
        ic.name AS ingredient_category,
        i.kilocalories,
        ROW_NUMBER() OVER (PARTITION BY ic.name ORDER BY i.kilocalories) AS row_num,
        COUNT(*) OVER (PARTITION BY ic.name) AS total_count
    FROM
        ingredients i
    JOIN
        ingredients_categories ic ON i.fk_ingredient_category_id = ic.id
)
SELECT
    ingredient_category,
    ROUND(AVG(kilocalories), 2) AS median_calories
FROM
    ranked_ingredients
WHERE
    row_num IN (
        (total_count + 1) / 2,  
        (total_count + 2) / 2   
    )
GROUP BY
    ingredient_category
ORDER BY
    ingredient_category;