import type { RestaurantData } from "../shared/restaurant/types";

export async function fetchRestaurantData(route: string): Promise<RestaurantData> {
    const API_URL = `${import.meta.env.VITE_API_URL}/restaurant-data/${route}`;
    const res = await fetch(API_URL);

    if (!res.ok) throw new Error('Failed to fetch restaurant data');
    const data = await res.json();

    return data[0].restaurant_data;
}