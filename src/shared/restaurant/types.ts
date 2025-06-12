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

// TODO: Maybe make value their IDs
export enum PreferenceIcon {
    ALLIUM = "Allium",
    COELIAC = "Coeliac", 
    DAIRY_FREE = "Dairy Free",
    EGG = "Egg",
    GLUTEN_FREE = "Gluten Free",
    LACTOSE_FREE = "Lactose Free",
    FISH = "Fish",
    FRUCTOSE_FREE = "Fructose Free", 
    MILK = "Milk",
    MUSTARD = "Mustard",
    NUTS = "Nuts",
    PEANUTS = "Peanuts",
    PESCATARIAN = "Pescatarian",
    SEAFOOD = "Seafood",
    SESAME = "Sesame",
    SHELLFISH = "Shellfish",
    SOYA = "Soya",
    SULPHITE = "Sulphite",
    TREE_NUTS = "Tree Nuts",
    VEGAN = "Vegan",
    VEGETARIAN = "Vegetarian",
    WHEAT = "Wheat",
    ALL = "All"
}