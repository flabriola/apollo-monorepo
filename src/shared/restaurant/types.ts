export interface RestaurantData {
    name: string;
    address: string;
    phone: string;
    logo_url: string;
    website: string;

    menu_list: {
        id: number;
        name: string;
        description: string;
        active: boolean;
    }[];

    menus: {
        name: string;
        description: string;
        active: boolean;
        pdf_url: string;
        dishes: {
            [key: number]: {
                name: string;
                description: string;
                category: string;
                active: boolean;
                allergens: {
                    id: number;
                    ingredients: {
                        id: number;
                        name: string;
                    }[];
                }[];
                diets: {
                    id: number;
                    ingredients: {
                        id: number;
                        name: string;
                    }[];
                }[];
                cross_contaminations: {
                    allergen: number;
                    reason: string;
                    ingredient: number;
                    ingredient_name: string;
                    description: string;
                }[];
            };
        };
    }[];
}

export type RestaurantRoute = {
    name: string;
    route: string;
}

export type RestaurantRoutes = {
    [key: string]: RestaurantRoute;
}

export enum Preferences {
    EGG = 500000,
    MILK = 500001,
    SOYA = 500002,
    WHEAT = 500003,
    TREE_NUTS = 500004,
    PEANUTS = 500005,
    NUTS = 500006,
    SHELLFISH = 500007,
    FISH = 500008,
    SEAFOOD = 500009,
    SESAME = 500010,
    COELIAC = 500011, 
    SULPHITE = 500012,
    MUSTARD = 500013,
    ALLIUM = 500014,
    VEGETARIAN = 600000,
    VEGAN = 600001,
    PESCATARIAN = 600002,
    GLUTEN_FREE = 600003,
    LACTOSE_FREE = 600004,
    DAIRY_FREE = 600005,
    FRUCTOSE_FREE = 600006 
}

export const PreferencesNames: { [key in Preferences]: string } = {
    [Preferences.EGG]: "Egg",
    [Preferences.MILK]: "Milk",
    [Preferences.SOYA]: "Soya",
    [Preferences.WHEAT]: "Wheat",
    [Preferences.TREE_NUTS]: "Tree Nuts",
    [Preferences.PEANUTS]: "Peanuts",
    [Preferences.NUTS]: "Nuts",
    [Preferences.SHELLFISH]: "Shellfish",
    [Preferences.FISH]: "Fish",
    [Preferences.SEAFOOD]: "Seafood",
    [Preferences.SESAME]: "Sesame",
    [Preferences.COELIAC]: "Coeliac",
    [Preferences.SULPHITE]: "Sulphite",
    [Preferences.MUSTARD]: "Mustard",
    [Preferences.ALLIUM]: "Allium",
    [Preferences.VEGETARIAN]: "Vegetarian",
    [Preferences.VEGAN]: "Vegan",
    [Preferences.PESCATARIAN]: "Pescatarian",
    [Preferences.GLUTEN_FREE]: "Gluten Free",
    [Preferences.LACTOSE_FREE]: "Lactose Free",
    [Preferences.DAIRY_FREE]: "Dairy Free",
    [Preferences.FRUCTOSE_FREE]: "Fructose Free"
}

export const PreferencesDescriptions: { [key in Preferences]: string } = {
    [Preferences.EGG]: "",
    [Preferences.MILK]: "",
    [Preferences.SOYA]: "",
    [Preferences.WHEAT]: "",
    [Preferences.TREE_NUTS]: "",
    [Preferences.PEANUTS]: "",
    [Preferences.NUTS]: "",
    [Preferences.SHELLFISH]: "Molluscs",
    [Preferences.FISH]: "",
    [Preferences.SEAFOOD]: "",
    [Preferences.SESAME]: "",
    [Preferences.COELIAC]: "",
    [Preferences.SULPHITE]: "",
    [Preferences.MUSTARD]: "",
    [Preferences.ALLIUM]: "",
    [Preferences.VEGETARIAN]: "",
    [Preferences.VEGAN]: "",
    [Preferences.PESCATARIAN]: "",
    [Preferences.GLUTEN_FREE]: "",
    [Preferences.LACTOSE_FREE]: "",
    [Preferences.DAIRY_FREE]: "",
    [Preferences.FRUCTOSE_FREE]: ""
}

export type UserPreferences = {
    preferences: Preferences[];
}
