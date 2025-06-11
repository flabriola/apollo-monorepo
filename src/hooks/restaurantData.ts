import type { RestaurantData } from "../shared/restaurant/types";

export async function fetchRestaurantData(route: string): Promise<RestaurantData> {
    const API_URL = `${import.meta.env.VITE_API_URL}/restaurant-data/${route}`;
    const res = await fetch(API_URL);

    if (!res.ok) throw new Error('Failed to fetch restaurant data');
    const data = await res.json();

    return data[0].restaurant_data;
}

// export function fetchRestaurantDataTest(): RestaurantData {
//     const jsonString = testData2[0].restaurant_data;
//     const parsed = JSON.parse(jsonString);
//     return parsed;

//     //   return parseRestaurantData(testData as any[]);
// }

// export function parseRestaurantData(raw: any[]): RestaurantData {
//     const restaurant: RestaurantData = {
//         name: raw[0].restaurant_name,
//         address: raw[0].address,
//         phone: raw[0].phone,
//         logo_url: raw[0].logo_url,
//         website: raw[0].website_url,
//         menu_list: [],
//         menus: []
//     };

//     const menuMap = new Map<number, any>();
//     const dishMap = new Map<number, any>();

//     for (const row of raw) {
//         if (!menuMap.has(row.menu_id)) {
//             const menu = {
//                 id: row.menu_id,
//                 name: row.menu_name,
//                 description: row.menu_description,
//                 active: row.menu_active,
//             };
//             restaurant.menu_list.push(menu);

//             menuMap.set(row.menu_id, {
//                 name: row.menu_name,
//                 description: row.menu_description,
//                 active: row.menu_active,
//                 pdf_url: row.pdf_url,
//                 dishes: {}
//             });
//         }

//         if (row.dish_id && !dishMap.has(row.dish_id)) {
//             const dish = {
//                 name: row.dish_name,
//                 description: row.dish_description,
//                 category: row.category,
//                 active: row.dish_active,
//                 allergens: [],
//                 diets: [],
//                 cross_contaminatiosn: []
//             };
//             menuMap.get(row.menu_id).dishes[row.dish_id] = dish;
//             dishMap.set(row.dish_id, dish);
//         }

//         const dish = dishMap.get(row.dish_id);

//         if (row.allergen_id) {
//             let allergen = dish.allergens.find((a: any) => a.id === row.allergen_id);
//             if (!allergen) {
//                 allergen = { id: row.allergen_id, ingredients: [] };
//                 dish.allergens.push(allergen);
//             }
//             if (row.allergen_ingredient_id) {
//                 allergen.ingredients.push({ id: row.allergen_ingredient_id, name: row.allergen_ingredient_name });
//             }
//         }

//         if (row.diet_id) {
//             let diet = dish.diets.find((d: any) => d.id === row.diet_id);
//             if (!diet) {
//                 diet = { id: row.diet_id, ingredients: [] };
//                 dish.diets.push(diet);
//             }
//             if (row.diet_ingredient_id) {
//                 diet.ingredients.push({ id: row.diet_ingredient_id, name: row.diet_ingredient_name });
//             }
//         }

//         if (row.cc_allergen_id) {
//             dish.cross_contaminatiosn.push({
//                 allergen: row.cc_allergen_id,
//                 reason: row.reason,
//                 ingredient: row.cc_ingredient_id,
//                 ingredient_name: row.cc_ingredient_name,
//                 description: row.cc_description
//             });
//         }
//     }

//     restaurant.menus = Array.from(menuMap.values());
//     return restaurant;
// }
