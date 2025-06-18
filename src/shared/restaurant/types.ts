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

export type UserPreferences = {
    preferences: Preferences[];
}
