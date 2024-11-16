WITH ranked_ingredients AS (
    SELECT
        ic.name AS category_name,
        i.name AS ingredient_name,
        i.kilocalories,
        ROW_NUMBER() OVER (PARTITION BY ic.name ORDER BY i.kilocalories ASC) AS rank_low,
        ROW_NUMBER() OVER (PARTITION BY ic.name ORDER BY i.kilocalories DESC) AS rank_high
    FROM
        ingredients i
    JOIN
        ingredients_categories ic ON i.fk_ingredient_category_id = ic.id
)
SELECT 
    category_name,
    ingredient_name,
    ROUND(kilocalories, 2) AS kilocalories,
    CASE
        WHEN rank_low <= 5 THEN 'Lowest'
        WHEN rank_high <= 5 THEN 'Highest'
    END AS rank_type
FROM 
    ranked_ingredients
WHERE 
    rank_low <= 5 OR rank_high <= 5
ORDER BY 
    category_name, rank_type, kilocalories;