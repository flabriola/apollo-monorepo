export const screenings = [
  {
    id: 1,
    user_id: '10bc095c-b071-707d-0748-8f5ee5811517',
    title: "Joe's Pizza",
    lastModified: "2024-03-20T14:30:00",
    owner: "John Smith", // compination of first and last name
    json: {
      restaurant: {
        name: "Joe's Pizza",
        address: "123 Main St, New York, NY 10001",
        phone: "212-555-1234"
      },
      menus: {
        // key of each object used to refer to each dish inside the menu
        1: {
          restaurant_id: 100013, // field in form
          name: "Lunch",
          description: "Menu 1 description",
          active: true
        },
        2: {
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
          description: "Ingredient 1 description",
          cc: [
            {
              allergen_id: 500007,
              reason: "G",
              description: "Grilled with shrimp"
            },
            {
              allergen_id: 500009,
              reason: "G",
              description: "Grilled with shrimp"
            },
            {
              allergen_id: 500011,
              reason: "F",
              description: "Fried with gluten"
            }
          ]
        },
        2: {
          dish: 1,
          dish_id: 30001,
          ingredient_id: 400000,
          private: false,
          description: "dressing",
          item: 1
        },
        3: {
          dish: 1,
          dish_id: 30001,
          ingredient_id: 400007,
          private: false,
          description: "[Ingredient 3 description]dressing",
          ingredient_item: 1
        },
        4: {
          dish: 1,
          dish_id: 30001,
          ingredient_id: 400001,
          private: true,
          description: "Balsamic Vinegar",
          ingredient_item: 1,
          secondary: 1,
          images: [
            "https://ag-screening.s3.amazonaws.com/10bc095c-b071-707d-0748-8f5ee5811517/1/img1.jpg",
            "https://ag-screening.s3.amazonaws.com/10bc095c-b071-707d-0748-8f5ee5811517/1/img1.jpg",
            "https://ag-screening.s3.amazonaws.com/10bc095c-b071-707d-0748-8f5ee5811517/1/img1.jpg"
          ]
        },
        5: {
          dish: 1,
          dish_id: 30001,
          ingredient_id: 400009,
          private: false,
          description: "{Balsamic Vinegar}dressing",
          ingredient_item: 1,
          secondary_ingredient: 1
        },
        6: {
          dish: 1,
          dish_id: 30001,
          ingredient_id: 400015,
          private: false,
          description: "{Balsamic Vinegar}dressing",
          ingredient_item: 1,
          secondary_ingredient: 1
        },
        7: {
          dish: 1,
          dish_id: 30001,
          ingredient_id: 400098,
          private: false,
          description: "Ingredient 7 description"
        },
        8: {
          dish: 1,
          dish_id: 30001,
          ingredient_id: 400007,
          private: false,
          description: "Ingredient 8 description"
        },
        9: {
          dish: 1,
          dish_id: 30001,
          ingredient_id: 400001,
          private: true,
          description: "Bagel Seasoning",
          secondary: 2,
          images: [
            "https://ag-screening.s3.amazonaws.com/10bc095c-b071-707d-0748-8f5ee5811517/1/img1.jpg"
          ]
        },
        10: {
          dish: 1,
          dish_id: 30001,
          ingredient_id: 400065,
          private: false,
          description: "{Bagel Seasoning}",
          secondary_ingredient: 2
        },
        11: {
          dish: 1,
          dish_id: 30001,
          ingredient_id: 400032,
          private: false,
          description: "{Bagel Seasoning}",
          secondary_ingredient: 2
        },
        12: {
          dish: 2,
          dish_id: 30002,
          ingredient_id: 2,
          private: false,
          description: "Ingredient 12 description"
        },
        13: {
          dish: 3,
          dish_id: 30002,
          ingredient_id: 2,
          private: false,
          description: "Ingredient 12 description"
        },
        14: {
          dish: 4,
          dish_id: 30002,
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