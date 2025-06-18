import type { RestaurantRoutes } from "./types";
import { Preferences } from "./types";

export const restaurantRoutes: RestaurantRoutes = {
    "themainetest": {
        name: "The MAINE Land Brasserie",
        route: "themainetest"
    }
}

// Allergens to display in given order
export const allergies: Preferences[] = [
    Preferences.MILK,
    Preferences.SHELLFISH,
    Preferences.FISH,
    Preferences.EGG,
    Preferences.SOYA,
    Preferences.COELIAC, 
    Preferences.NUTS,
    Preferences.WHEAT,
    Preferences.SESAME,
    Preferences.ALLIUM,
    Preferences.MUSTARD,
    Preferences.SEAFOOD,
    // Preferences.SULPHITE,
    // Preferences.TREE_NUTS,
    // Preferences.PEANUTS,
]

// Diets to display in given order
export const diets: Preferences[] = [
    Preferences.VEGETARIAN,
    Preferences.VEGAN,
    Preferences.DAIRY_FREE,
    Preferences.PESCATARIAN,
    Preferences.GLUTEN_FREE,
    Preferences.LACTOSE_FREE,
    Preferences.FRUCTOSE_FREE 
]