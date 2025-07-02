import { t } from "i18next";

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
        [key: number]: {
            name: string;
            description: string;
            active: boolean;
            menu_overlay: {
                image: string;
                width: number;
                height: number;
                rectangles: {
                    id: string;
                    width: number;
                    height: number;
                    left: number;
                    top: number;
                }[];
                color: string;
            };
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
        };
    };
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

export const getPreferencesNames = (): { [key in Preferences]: string } => ({
    [Preferences.EGG]: t("preferences.egg"),
    [Preferences.MILK]: t("preferences.milk"),
    [Preferences.SOYA]: t("preferences.soya"),
    [Preferences.WHEAT]: t("preferences.wheat"),
    [Preferences.TREE_NUTS]: t("preferences.treeNuts"),
    [Preferences.PEANUTS]: t("preferences.peanuts"),
    [Preferences.NUTS]: t("preferences.nuts"),
    [Preferences.SHELLFISH]: t("preferences.shellfish"),
    [Preferences.FISH]: t("preferences.fish"),
    [Preferences.SEAFOOD]: t("preferences.seafood"),
    [Preferences.SESAME]: t("preferences.sesame"),
    [Preferences.COELIAC]: t("preferences.coeliac"),
    [Preferences.SULPHITE]: t("preferences.sulphite"),
    [Preferences.MUSTARD]: t("preferences.mustard"),
    [Preferences.ALLIUM]: t("preferences.allium"),
    [Preferences.VEGETARIAN]: t("preferences.vegetarian"),
    [Preferences.VEGAN]: t("preferences.vegan"),
    [Preferences.PESCATARIAN]: t("preferences.pescatarian"),
    [Preferences.GLUTEN_FREE]: t("preferences.glutenFree"),
    [Preferences.LACTOSE_FREE]: t("preferences.lactoseFree"),
    [Preferences.DAIRY_FREE]: t("preferences.dairyFree"),
    [Preferences.FRUCTOSE_FREE]: t("preferences.fructoseFree")
})

export const getPreferencesDescriptions = (): { [key in Preferences]: string } => ({
    [Preferences.EGG]: t("preferences.description.egg"),
    [Preferences.MILK]: t("preferences.description.milk"),
    [Preferences.SOYA]: t("preferences.description.soya"),
    [Preferences.WHEAT]: t("preferences.description.wheat"),
    [Preferences.TREE_NUTS]: t("preferences.description.treeNuts"),
    [Preferences.PEANUTS]: t("preferences.description.peanuts"),
    [Preferences.NUTS]: t("preferences.description.nuts"),
    [Preferences.SHELLFISH]: t("preferences.description.shellfish"),
    [Preferences.FISH]: t("preferences.description.fish"),
    [Preferences.SEAFOOD]: t("preferences.description.seafood"),
    [Preferences.SESAME]: t("preferences.description.sesame"),
    [Preferences.COELIAC]: t("preferences.description.coeliac"),
    [Preferences.SULPHITE]: t("preferences.description.sulphite"),
    [Preferences.MUSTARD]: t("preferences.description.mustard"),
    [Preferences.ALLIUM]: t("preferences.description.allium"),
    [Preferences.VEGETARIAN]: t("preferences.description.vegetarian"),
    [Preferences.VEGAN]: t("preferences.description.vegan"),
    [Preferences.PESCATARIAN]: t("preferences.description.pescatarian"),
    [Preferences.GLUTEN_FREE]: t("preferences.description.glutenFree"),
    [Preferences.LACTOSE_FREE]: t("preferences.description.lactoseFree"),
    [Preferences.DAIRY_FREE]: t("preferences.description.dairyFree"),
    [Preferences.FRUCTOSE_FREE]: t("preferences.description.fructoseFree")
});

export type UserPreferences = {
    preferences: Preferences[];
}

export type MenuOverlay = {
    image: string;
    width: number;
    color: string;
    height: number;
    rectangles: {
        id: string;
        width: number;
        height: number;
        left: number;
        top: number;
    }[];
};

// PreferencesDescriptions