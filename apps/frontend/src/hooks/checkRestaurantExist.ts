import { restaurantRoutes } from "../shared/restaurant/data";
import type { RestaurantRoute } from "../shared/restaurant/types";

export function checkRestaurantExist(route: string): RestaurantRoute | undefined {
    if (!route) return undefined;
    return restaurantRoutes[route.toLowerCase()];
}
