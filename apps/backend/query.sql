-- Retrieve Unique List of Non-Private Ingredients for a Restaurant

SELECT JSON_ARRAYAGG(
    JSON_OBJECT(
        'id', i.id,
        'name', i.name
    )
) AS ingredients
FROM (
    SELECT DISTINCT i.id, i.name
    FROM ingredient i
    JOIN dish_ingredient di ON i.id = di.ingredient_id
    JOIN dish d ON di.dish_id = d.id
    JOIN menu m ON d.menu_id = m.id
    WHERE m.restaurant_id = ?
    AND di.private = FALSE
    ORDER BY i.name
) AS ingredient_list;

-- Retrieve Complete Menu Hierarchy
WITH dish_allergens AS (
    SELECT 
        d.id AS dish_id,
        JSON_ARRAYAGG(
            DISTINCT JSON_OBJECT(
                'id', a.id,
                'name', a.name
            )
        ) AS allergens
    FROM dish d
    JOIN dish_ingredient di ON d.id = di.dish_id
    JOIN ingredient_allergen ia ON di.ingredient_id = ia.ingredient_id
    JOIN allergen a ON ia.allergen_id = a.id
    GROUP BY d.id
),
dish_diets AS (
    SELECT 
        d.id AS dish_id,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', diet.id,
                'name', diet.name
            )
        ) AS diets
    FROM dish d
    JOIN dish_ingredient di ON d.id = di.dish_id
    JOIN ingredient_diet id ON di.ingredient_id = id.ingredient_id
    JOIN diet diet ON id.diet_id = diet.id
    GROUP BY d.id
    HAVING COUNT(DISTINCT di.ingredient_id) = (
        SELECT COUNT(DISTINCT ingredient_id)
        FROM dish_ingredient
        WHERE dish_id = d.id
    )
),
dish_ingredients AS (
    SELECT 
        d.id AS dish_id,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', i.id,
                'name', i.name,
                'private', di.private,
                'description', i.description
            )
        ) AS ingredients
    FROM dish d
    JOIN dish_ingredient di ON d.id = di.dish_id
    JOIN ingredient i ON di.ingredient_id = i.id
    GROUP BY d.id
),
dish_cross_contamination AS (
    SELECT 
        d.id AS dish_id,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'allergen_id', a.id,
                'allergen_name', a.name,
                'reason', dca.reason,
                'ingredient_id', dca.ingredient_id,
                'description', dca.description
            )
        ) AS cross_contamination
    FROM dish d
    JOIN dish_cc_allergen dca ON d.id = dca.dish_id
    JOIN allergen a ON dca.allergen_id = a.id
    GROUP BY d.id
)
SELECT JSON_OBJECT(
    'menus', JSON_ARRAYAGG(
        JSON_OBJECT(
            'id', m.id,
            'name', m.name,
            'dishes', (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', d.id,
                        'name', d.name,
                        'description', d.description,
                        'price', d.price,
                        'category', d.category,
                        'ingredients', COALESCE(di.ingredients, JSON_ARRAY()),
                        'allergens', COALESCE(da.allergens, JSON_ARRAY()),
                        'diets', COALESCE(dd.diets, JSON_ARRAY()),
                        'cross_contamination', COALESCE(dc.cross_contamination, JSON_ARRAY())
                    )
                )
                FROM dish d
                LEFT JOIN dish_ingredients di ON d.id = di.dish_id
                LEFT JOIN dish_allergens da ON d.id = da.dish_id
                LEFT JOIN dish_diets dd ON d.id = dd.dish_id
                LEFT JOIN dish_cross_contamination dc ON d.id = dc.dish_id
                WHERE d.menu_id = m.id
                AND d.active = TRUE
            )
        )
    )
) AS menu_data
FROM menu m
WHERE m.restaurant_id = ?
AND m.active = TRUE;
