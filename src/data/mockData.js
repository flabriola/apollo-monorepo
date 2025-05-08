export const screenings = [
  {
    id: 1,
    title: "Joe's Pizza",
    lastModified: "2024-03-20T14:30:00",
    owner: "John Smith",
    json: {
      restaurant: {
        name: "Joe's Pizza",
        address: "123 Main St, New York, NY 10001",
        phone: "212-555-1234"
      },
      menus: [
        {
          restaurant_id: 1,
          name: "Menu 1",
          description: "Menu 1 description",
          active: true
        }
      ],
      dishes: [
        {
          menu_id: 1,
          name: "Dish 1",
          description: "Dish 1 description",
          price: 10.00,
          category: "Appetizer",
          active: true
        },
        {
          menu_id: 1,
          name: "Dish 2",
          description: "Dish 2 description",
          price: 15.00,
          category: "Main",
          active: true
        },
        {
          menu_id: 1,
          name: "Dish 3",
          description: "Dish 3 description",
          price: 20.00,
          category: "Dessert",
          active: true
        }
      ],
      ingredients: [
        {
          dish_id: 1,
          ingredient_id: 1,
          private: false,
          description: "Ingredient 1 description"
        },
        {
          dish_id: 1,
          ingredient_id: 2,
          private: true,
          description: "Ingredient 2 description"
        },
        {
          dish_id: 1,
          ingredient_id: 3,
          private: false,
          description: "Ingredient 3 description"
        },
        {
          dish_id: 2,
          ingredient_id: 4,
          private: false,
          description: "Ingredient 4 description"
        }
      ]
    }
  },
  {
    id: 2,
    title: "Sushi Master",
    lastModified: "2024-03-19T09:15:00",
    owner: "Sarah Johnson"
  },
  {
    id: 3,
    title: "Burger Palace",
    lastModified: "2024-03-18T16:45:00",
    owner: "Mike Brown"
  },
  {
    id: 4,
    title: "Taste of India",
    lastModified: "2024-03-17T11:20:00",
    owner: "Emma Wilson"
  }
]; 

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