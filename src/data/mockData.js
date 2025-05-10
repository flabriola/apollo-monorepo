export const screenings = [
  {
    id: 1,
    user_id: 1108,
    title: "Joe's Pizza",
    lastModified: "2024-03-20T14:30:00",
    owner: "John Smith",
    json: {
      restaurant: {
        name: "Joe's Pizza",
        address: "123 Main St, New York, NY 10001",
        phone: "212-555-1234"
      },
      menus: {
        // key of each object used to refer to each dish inside the menu
        1 : {
          restaurant_id: 100013, // field in form
          name: "Lunch",
          description: "Menu 1 description",
          active: true
        },
        2 : {
          restaurant_id: 100013, // same for all menus
          name: "Dinner",
          description: "Menu 2 description",
          active: true
        }
      },
      dishes: {
        // key of each object used to refer to each ingredient inside the dish
        1: {
          menu: 1, // menu it belongs to (for pagination/grouping)
          menu_id: 200034, // this field should still be an input field, not used for pagination
          name: "Dish 1",
          description: "Dish 1 description",
          price: 10.00,
          category: "Appetizer",
          active: true
        },
        2: {
          menu: 1,
          menu_id: 200034,
          name: "Dish 2",
          description: "Dish 2 description",
          price: 15.00,
          category: "Main",
          active: true
        },
        3: {
          menu: 1,
          menu_id: 200034,
          name: "Dish 3",
          description: "Dish 3 description",
          price: 20.00,
          category: "Dessert",
          active: true
        },
        4: {
          menu: 2, // different menu than the above 3
          menu_id: 200026,
          name: "Dish 4",
          description: "Dish 4 description",
          price: 25.00,
          category: "Dessert",
          active: true
        },
        5: {
          menu: 2,
          menu_id: 200026,
          name: "Dish 5",
          description: "Dish 5 description",
          price: 30.00,
        },
      },
      ingredients: {
        1: {
          dish: 1, // dish it belongs to (for pagination/grouping)
          dish_id: 30001, // this field should still be an input field, not used for pagination, however only asked on top of the list as it's the same for all in that specific diish (as is)
          ingredient_id: 1,
          private: false,
          description: "Ingredient 1 description"
        },
        2: {
          dish: 1,
          dish_id: 30001,
          ingredient_id: 2,
          private: true,
          description: "Ingredient 2 description"
        },
        3: {
          dish: 1,
          dish_id: 30001,
          ingredient_id: 3,
          private: false,
          description: "Ingredient 3 description"
        },
        4: {
          dish: 2,
          dish_id: 30002,
          ingredient_id: 2,
          private: false,
          description: "Ingredient 4 description"
        },
        5: {
          dish: 2,
          dish_id: 30002,
          ingredient_id: 6,
          private: false,
          description: "Ingredient 5 description"
        },
        6: {
          dish: 2,
          dish_id: 30002,
          ingredient_id: 1,
          private: false,
          description: "Ingredient 6 description"
        },
        7: {
          dish: 3,
          dish_id: 30003,
          ingredient_id: 6,
          private: false,
          description: "Ingredient 7 description"
        },
        8: {
          dish: 3,
          dish_id: 30003,
          ingredient_id: 8,
          private: false,
          description: "Ingredient 8 description"
        },
        9: {
          dish: 4,
          dish_id: 30008,
          ingredient_id: 1,
          private: false,
          description: "Ingredient 9 description"
        },
        10: {
          dish: 4,
          dish_id: 30008,
          ingredient_id: 1,
          private: false,
          description: "Ingredient 10 description"
        },
        11: {
          dish: 5,
          dish_id: 30009,
          ingredient_id: 1,
          private: false,
          description: "Ingredient 11 description"
        },
        12 : {
          dish: 5, 
          dish_id: 30009,
          ingredient_id: 2,
          private: false,
          description: "Ingredient 12 description"
        }
      }
    }
  }
]; 

// Pagination organization of above screening
// menu.1
//  dishes.1
//    ingredients.1
//    ingredients.2
//    ingredients.3
//  dishes.2
//    ingredients.4
//    ingredients.5
//    ingredients.6
//  dishes.3
//    ingredients.7
//    ingredients.8

// menu.2
//  dishes.4
//    ingredients.9
//    ingredients.10
//  dishes.5
//    ingredients.11
//    ingredients.12



export const ingredients = [
  {
    id: 1,
    name: "Lettuce",
    description: "Ingredient 1 description"
  },
  {
    id: 2,
    name: "Tomato",
    description: "Ingredient 2 description"
  },
  {
    id: 3,
    name: "Onion",
    description: "Ingredient 3 description"
  },
  {
    id: 4,
    name: "Cheese",
    description: "Ingredient 4 description" 
  },
  {
    id: 5,
    name: "Bacon",
    description: "Ingredient 5 description"
  },
  {
    id: 6,
    name: "Beef Patty",
    description: "Ingredient 6 description"
  }
  
];