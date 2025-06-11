export const getScreenings = `
    SELECT 
      s.id,
      s.user_id,
      s.title,
      s.last_modified AS lastModified,
      CONCAT(s.first_name, ' ', s.last_name) AS owner,
      s.json_data AS json
    FROM screenings s
    WHERE s.user_id = ?
    ORDER BY s.last_modified DESC
`;

export const insertScreening = `
    INSERT INTO screenings (user_id, title, json_data, first_name, last_name)
    VALUES (?, ?, CAST(? AS JSON), ?, ?)
`;
  
export const updateScreening = `
    UPDATE screenings
    SET 
      title = ?,
      json_data = CAST(? AS JSON),
      last_modified = CURRENT_TIMESTAMP
    WHERE id = ?
`;

export const ingredientsAllergensDiets = `
    SELECT 
    i.name AS ingredient_name,
    GROUP_CONCAT(DISTINCT a.name SEPARATOR ', ') AS allergens,
    GROUP_CONCAT(DISTINCT d.name SEPARATOR ', ') AS diets
    FROM ingredient i
    LEFT JOIN ingredient_allergen ia ON i.id = ia.ingredient_id
    LEFT JOIN allergen a ON ia.allergen_id = a.id
    LEFT JOIN ingredient_diet id ON i.id = id.ingredient_id
    LEFT JOIN diet d ON id.diet_id = d.id
    GROUP BY i.name
    ORDER BY i.name;
`;

export const restaurantData = `
    SELECT JSON_OBJECT(
    'name',           r.name,
    'address',        r.address,
    'phone',          r.phone,
    'logo_url',       r.logo_url,
    'website',        r.website_url,
    'menu_list',      (
        SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
            'id',          m.id,
            'name',        m.name,
            'description', m.description,
            'active',      m.active
        )
        )
        FROM menu AS m
        WHERE m.restaurant_id = r.id
    ),
    'menus',          (
        SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
            'name',        m.name,
            'description', m.description,
            'active',      m.active,
            'pdf_url',     m.pdf_url,
            'dishes',      (
            SELECT JSON_OBJECTAGG(
                d.id,
                JSON_OBJECT(
                'name',        d.name,
                'description', d.description,
                'category',    d.category,
                'active',      d.active,
                
                -- de-duplicated allergens
                'allergens', (
                    SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id',          aa.allergen_id,
                        'ingredients', aa.ingredients
                    )
                    )
                    FROM (
                    SELECT
                        ia.allergen_id,
                        JSON_ARRAYAGG(
                        JSON_OBJECT('id', i.id, 'name', i.name)
                        ) AS ingredients
                    FROM dish_ingredient AS di
                    JOIN ingredient            AS i  ON i.id = di.ingredient_id
                    JOIN ingredient_allergen   AS ia ON ia.ingredient_id = i.id
                    WHERE di.dish_id = d.id
                    GROUP BY ia.allergen_id
                    ) AS aa
                ),
                
                -- de-duplicated diets
                'diets', (
                    SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id',          dd.diet_id,
                        'ingredients', dd.ingredients
                    )
                    )
                    FROM (
                    SELECT
                        idr.diet_id,
                        JSON_ARRAYAGG(
                        JSON_OBJECT('id', i.id, 'name', i.name)
                        ) AS ingredients
                    FROM dish_ingredient AS di
                    JOIN ingredient         AS i   ON i.id = di.ingredient_id
                    JOIN ingredient_diet    AS idr ON idr.ingredient_id = i.id
                    WHERE di.dish_id = d.id
                    GROUP BY idr.diet_id
                    ) AS dd
                ),
                
                -- de-duplicated cross-contaminations
                'cross_contaminations', (
                    SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'allergen',        cc.allergen_id,
                        'reason',          cc.reason,
                        'ingredient',      cc.ingredient_id,
                        'ingredient_name', cc.ingredient_name,
                        'description',     cc.description
                    )
                    )
                    FROM (
                    SELECT DISTINCT
                        dca.allergen_id,
                        dca.reason,
                        dca.ingredient_id,
                        i3.name           AS ingredient_name,
                        dca.description
                    FROM dish_cc_allergen AS dca
                    LEFT JOIN ingredient AS i3 ON i3.id = dca.ingredient_id
                    WHERE dca.dish_id = d.id
                    ) AS cc
                )
                )
            )
            FROM dish AS d
            WHERE d.menu_id = m.id
                AND d.active = TRUE
            )
        )
        )
        FROM menu AS m
        WHERE m.restaurant_id = r.id
        AND m.active = TRUE
    )
    ) AS restaurant_data
    FROM restaurant AS r
    WHERE r.id = ?;
`;