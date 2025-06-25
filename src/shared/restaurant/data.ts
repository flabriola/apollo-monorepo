import type { MenuOverlay, RestaurantRoutes } from "./types";
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

export const menuTest: MenuOverlay = {
    "image": "https://apollo-guide-restaurant-logos.s3.eu-north-1.amazonaws.com/BB%2BA%2Bla%2Bcarte%2B05.2025.png",
    "width": 2500,
    "height": 3289,
    "color": "#FFFFFF",
    "rectangles": [
        { "id": "300000", "width": 723.11, "height": 54.4, "left": 173.62, "top": 491.86 },
        { "id": "300001", "width": 723.11, "height": 54.4, "left": 173.62, "top": 583.8 },
        { "id": "300002", "width": 723.11, "height": 54.84, "left": 173.62, "top": 674.25 },
        { "id": "300003", "width": 723.11, "height": 50.64, "left": 173.62, "top": 766.08 },
        { "id": "300004", "width": 723.11, "height": 84.63, "left": 173.62, "top": 766.08 },
        { "id": "300005", "width": 724.05, "height": 51.72, "left": 173.15, "top": 886.76 },
        { "id": "300006", "width": 724.05, "height": 51.72, "left": 173.15, "top": 974.54 },
        { "id": "300007", "width": 724.05, "height": 28.46, "left": 173.15, "top": 1062.31 },
        { "id": "300008", "width": 724.05, "height": 55.8, "left": 173.15, "top": 1122.5 },
        { "id": "300009", "width": 724.05, "height": 59.02, "left": 173.15, "top": 1298.25 },
        { "id": "300010", "width": 724.05, "height": 59.02, "left": 173.15, "top": 1388.99 },
        { "id": "300011", "width": 724.05, "height": 59.02, "left": 173.15, "top": 1479.74 },
        { "id": "300012", "width": 724.05, "height": 59.02, "left": 173.15, "top": 1570.48 },
        { "id": "300013", "width": 724.05, "height": 61.07, "left": 173.15, "top": 1661.22 },
        { "id": "300014", "width": 724.05, "height": 62.43, "left": 173.15, "top": 1751.97 },
        { "id": "300015", "width": 724.05, "height": 59.02, "left": 173.15, "top": 1846.13 },
        { "id": "300016", "width": 724.05, "height": 61.07, "left": 173.15, "top": 1936.87 },
        { "id": "0", "width": 724.05, "height": 76.03, "left": 173.15, "top": 2014.01 },
        { "id": "300033", "width": 724.05, "height": 59.02, "left": 173.15, "top": 2233.51 },
        { "id": "300034", "width": 724.05, "height": 61.07, "left": 173.15, "top": 2324.25 },
        { "id": "300035", "width": 724.05, "height": 62.43, "left": 173.15, "top": 2415 },
        { "id": "300036", "width": 724.05, "height": 59.02, "left": 173.15, "top": 2509.15 },
        { "id": "300037", "width": 724.05, "height": 61.07, "left": 173.15, "top": 2599.9 },
        { "id": "300038", "width": 724.05, "height": 62.43, "left": 173.15, "top": 2690.64 },
        { "id": "300020", "width": 612.04, "height": 59.02, "left": 943.81, "top": 2470.8 },
        { "id": "300019", "width": 612.04, "height": 59.02, "left": 943.81, "top": 2360.73 },
        { "id": "300018", "width": 612.04, "height": 59.02, "left": 943.81, "top": 2254.41 },
        { "id": "300017", "width": 612.04, "height": 59.02, "left": 943.81, "top": 2148.08 },
        { "id": "300032", "width": 353.27, "height": 100.7, "left": 1073.77, "top": 1805.21 },
        { "id": "300031", "width": 353.27, "height": 76.87, "left": 1073.77, "top": 1602.98 },
        { "id": "300030", "width": 491.49, "height": 76.87, "left": 1004.66, "top": 1485.41 },
        { "id": "300029", "width": 424.48, "height": 76.87, "left": 1038.16, "top": 1372.17 },
        { "id": "300028", "width": 426.93, "height": 99.34, "left": 1036.94, "top": 1233.18 },
        { "id": "300027", "width": 557.98, "height": 103.3, "left": 971.42, "top": 1000.4 },
        { "id": "300025", "width": 497.71, "height": 102.14, "left": 1001.55, "top": 857.67 },
        { "id": "0", "width": 476.02, "height": 102.14, "left": 1012.39, "top": 713.93 },
        { "id": "300023", "width": 466.53, "height": 103.4, "left": 1017.14, "top": 568.37 },
        { "id": "300021", "width": 612.04, "height": 52.45, "left": 943.81, "top": 2580.87 },
        { "id": "300022", "width": 612.04, "height": 62.43, "left": 943.81, "top": 2690.64 },
        { "id": "300059", "width": 727.82, "height": 23.63, "left": 1603.57, "top": 2724.07 },
        { "id": "300058", "width": 727.82, "height": 23.63, "left": 1603.57, "top": 2656.88 },
        { "id": "300057", "width": 727.82, "height": 23.63, "left": 1603.57, "top": 2589.7 },
        { "id": "300056", "width": 727.82, "height": 23.63, "left": 1603.57, "top": 2522.51 },
        { "id": "300055", "width": 727.82, "height": 23.63, "left": 1603.57, "top": 2457.43 },
        { "id": "300054", "width": 727.82, "height": 23.63, "left": 1603.57, "top": 2390.24 },
        { "id": "300053", "width": 727.82, "height": 23.63, "left": 1603.57, "top": 2323.06 },
        { "id": "300052", "width": 727.82, "height": 23.63, "left": 1603.57, "top": 2255.87 },
        { "id": "300051", "width": 727.82, "height": 23.63, "left": 1603.57, "top": 2071.37 },
        { "id": "300050", "width": 727.82, "height": 23.63, "left": 1603.57, "top": 2004.93 },
        { "id": "300049", "width": 727.82, "height": 24.42, "left": 1603.57, "top": 1937.7 },
        { "id": "300048", "width": 727.82, "height": 82.87, "left": 1603.57, "top": 1666.04 },
        { "id": "300047", "width": 727.82, "height": 58.15, "left": 1603.57, "top": 1569.12 },
        { "id": "300046", "width": 727.82, "height": 58.15, "left": 1603.57, "top": 1472.21 },
        { "id": "300045", "width": 727.82, "height": 58.15, "left": 1603.57, "top": 1378.27 },
        { "id": "300039", "width": 727.82, "height": 50.62, "left": 1603.57, "top": 492.23 },
        { "id": "300040", "width": 727.82, "height": 56.47, "left": 1603.57, "top": 586.66 },
        { "id": "300041", "width": 727.82, "height": 56.47, "left": 1603.57, "top": 826.87 },
        { "id": "300042", "width": 727.82, "height": 56.47, "left": 1603.57, "top": 924.41 },
        { "id": "300043", "width": 727.82, "height": 56.47, "left": 1603.57, "top": 1020.29 },
        { "id": "300044", "width": 727.82, "height": 56.47, "left": 1603.57, "top": 1116.18 }
    ]
}

export const wine: MenuOverlay = {
    "image": "https://apollo-guide-restaurant-logos.s3.eu-north-1.amazonaws.com/BB%2BWine%2B%26%2BSpirits.png",
    "width": 2500,
    "height": 10010.22,
    "color": "#FFFFFF",
    "rectangles": [
        {
            "id": "300060",
            "width": 382.57,
            "height": 170.37,
            "left": 344.6,
            "top": 903.67
        },

        {
            "id": "300061",
            "width": 351.6,
            "height": 170.37,
            "left": 1793.25,
            "top": 903.67

        },

        {
            "id": "300062",
            "width": 415.84,
            "height": 170.37,
            "left": 1043.74,
            "top": 903.67

        },

        {
            "id": "300063",
            "width": 265.79,
            "height": 175.19,
            "left": 399.52,
            "top": 1509.74

        },
        {
            "id": "300064",
            "width": 423.27,
            "height": 175.19,
            "left": 1042.4,
            "top": 1509.74

        },

        {
            "id": "300065",
            "width": 450.74,
            "height": 175.19,
            "left": 1750.49,
            "top": 1509.74

        },
        {
            "id": "300066",
            "width": 427.09,
            "height": 165.94,
            "left": 324.05,
            "top": 2099.7

        },

        {
            "id": "300067",
            "width": 425.15,
            "height": 165.35,
            "left": 1040.93,
            "top": 2098.32

        },

        {
            "id": "300068",
            "width": 401.26,
            "height": 165.35,
            "left": 1776.09,
            "top": 2098.32

        },

        {
            "id": "300069",
            "width": 319.7,
            "height": 149.79,
            "left": 375.48,
            "top": 2757.17

        },


        {
            "id": "300070",
            "width": 498.48,
            "height": 177.85,
            "left": 1006.22,
            "top": 2729.12

        },

        {
            "id": "300071",
            "width": 459.69,
            "height": 177.85,
            "left": 1746.22,
            "top": 2729.12
        }
    ]
}

export const desserts: MenuOverlay = {
    "image": "https://apollo-guide-restaurant-logos.s3.eu-north-1.amazonaws.com/BB%2Bdessert%2BMar%2B2025.png",
    "width": 1947,
    "height": 2668,
    "color": "#FFFFFF",
    "rectangles": [
        {
            "id": "300072",
            "width": 1168.44,
            "height": 75.08,
            "left": 389.28,
            "top": 752.03
        },

        {
            "id": "300073",
            "width": 1168.44,
            "height": 75.08,
            "left": 389.28,
            "top": 906.73
        },


        {
            "id": "300074",
            "width": 1168.44,
            "height": 72.77,
            "left": 389.28,
            "top": 1066.94
        },


        {
            "id": "300075",
            "width": 1168.44,
            "height": 72.77,
            "left": 389.28,
            "top": 1219.33
        },


        {
            "id": "300076",
            "width": 1168.44,
            "height": 72.77,
            "left": 389.28,
            "top": 1377.24
        },


        {
            "id": "300077",
            "width": 1168.44,
            "height": 75.68,
            "left": 389.28,
            "top": 1529.63
        },


        {
            "id": "300078",
            "width": 1168.44,
            "height": 75.68,
            "left": 389.28,
            "top": 1691.16
        },


        {
            "id": "300079",
            "width": 1168.44,
            "height": 75.68,
            "left": 389.28,
            "top": 1842.89
        },


        {
            "id": "300080",
            "width": 232.59,
            "height": 25.97,
            "left": 388.34,
            "top": 2040.45
        },


        {
            "id": "300081",
            "width": 365.66,
            "height": 34.69,
            "left": 388.34,
            "top": 2079.54
        },


        {
            "id": "300082",
            "width": 456.17,
            "height": 34.69,
            "left": 388.34,
            "top": 2120.02
        },


        {
            "id": "300083",
            "width": 456.17,
            "height": 34.69,
            "left": 388.34,
            "top": 2160.5
        },


        {
            "id": "300084",
            "width": 456.17,
            "height": 34.69,
            "left": 388.34,
            "top": 2200.98
        }

    ]
}

export const lpf: MenuOverlay = {
    "image": "https://apollo-guide-restaurant-logos.s3.eu-north-1.amazonaws.com/BB%2BLPF%2BMar%2B2025.png",
    "width": 951,
    "height": 2048,
    "color": "#FFFFFF",
    "rectangles": [ ]
}

export const roast: MenuOverlay = {
    "image": "https://apollo-guide-restaurant-logos.s3.eu-north-1.amazonaws.com/BB%2BRoast%2BMar%2B2025.png",
    "width": 1947,
    "height": 2668,
    "color": "#FFFFFF",
    "rectangles": [ ]
}

