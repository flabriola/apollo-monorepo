type RestaurantRoute = {
  id: number;
  name: string;
  route: string;
}

type RestaurantRoutes = {
  [key: string]: RestaurantRoute;
}

const restaurants: RestaurantRoutes = {
    "themainetest": {
        id: 100000,
        name: "The Maine Test",
        route: "themainetest"
    }
}

export const getRestaurantId = (route: string) => {
  return restaurants[route].id;
};