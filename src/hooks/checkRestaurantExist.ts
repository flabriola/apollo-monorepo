type RestaurantRoute = {
    id: number;
    name: string;
    route: string;
}

type RestaurantRoutes = {
    [key: string]: RestaurantRoute;
}

const restaurantRoutes: RestaurantRoutes = {
    "themainetest": {
        id: 1,
        name: "The Maine Test",
        route: "themainetest"
    }
}

export function checkRestaurantExist(route: string): RestaurantRoute | undefined {
    if (!route) return undefined;
    return restaurantRoutes[route.toLowerCase()];
}
