const restaurants = {
    "themainetest": {
        id: 100000,
        name: "The Maine Test",
        route: "themainetest"
    }
}

export const getRestaurantId = (route) => {
  return restaurants[route].id;
};