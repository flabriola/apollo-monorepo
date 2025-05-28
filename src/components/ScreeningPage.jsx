import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/ScreeningPage.css';
import Prism from 'prismjs';
import 'prismjs/components/prism-sql';
import 'prismjs/themes/prism.css';
// Add import for UUID generation
import { v4 as uuidv4 } from 'uuid';
import Left from '../assets/O-left.svg';
import Right from '../assets/O.svg';
import SharedItemsIcon from '../assets/shared-items.svg';

// Mock ingredients data for the selection box
const mockIngredients = [
  { id: 1, name: 'Tomato', description: 'Fresh red tomatoes' },
  { id: 2, name: 'Cheese', description: 'Mozzarella cheese' },
  { id: 3, name: 'Flour', description: 'All-purpose flour' },
  { id: 4, name: 'Olive Oil', description: 'Extra virgin olive oil' },
  { id: 5, name: 'Basil', description: 'Fresh basil leaves' },
  { id: 6, name: 'Garlic', description: 'Fresh garlic cloves' },
  { id: 7, name: 'Salt', description: 'Sea salt' },
  { id: 8, name: 'Pepper', description: 'Black pepper' },
  { id: 9, name: 'Onion', description: 'White onion' },
  { id: 10, name: 'Mushroom', description: 'Cremini mushrooms' },
];

const cookingMethods = [
  { id: 'G', name: 'Grilled' },
  { id: 'F', name: 'Fried' },
  { id: 'BK', name: 'Baked' },
  { id: 'BO', name: 'Boiled' },
  { id: 'P', name: 'Prepared' },
  { id: 'M', name: 'Marinated' },
  { id: 'BF', name: 'Buffet' },
  { id: 'S', name: 'Stored' }
];

const allergens = [
  { id: 500000, name: 'Egg' },
  { id: 500001, name: 'Milk' },
  { id: 500002, name: 'Soya' },
  { id: 500003, name: 'Wheat' },
  { id: 500004, name: 'Tree Nuts' },
  { id: 500005, name: 'Peanuts' },
  { id: 500006, name: 'Nuts' },
  { id: 500007, name: 'Shellfish' },
  { id: 500008, name: 'Fish' },
  { id: 500009, name: 'Seafood' },
  { id: 500010, name: 'Sesame' },
  { id: 500011, name: 'Coeliac' },
  { id: 500012, name: 'Sulphite' },
  { id: 500013, name: 'Mustard' }
];

const ScreeningPage = ({ user, userAttributes, ingredients, isScreeningDirty, setIsScreeningDirty }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const ingredientList = ingredients ? Object.values(ingredients) : mockIngredients;
  // set it to the screening data and parse
  const initialScreening = location.state?.screening;


  // Initialize screening state
  const [screening, setScreening] = useState({
    restaurant: {
      name: '',
      address: '',
      phone: ''
    },
    menus: {},
    dishes: {},
    ingredients: {},
    todo_list: [],
    status: false
  });

  // Initialize form state with data from the screening or defaults
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: '',
    address: '',
    phone: ''
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState({
    name: '',
    address: '',
    phone: ''
  });

  // Section expansion state
  const [showSqlBox, setShowSqlBox] = useState(false);
  const [highlightedSql, setHighlightedSql] = useState('');

  // Section 2: Menu (multiple entries)
  const [menuRestaurantId, setMenuRestaurantId] = useState('');
  const [menuRestaurantIdError, setMenuRestaurantIdError] = useState('');
  const [showMenuSqlBox, setShowMenuSqlBox] = useState(false);
  const [highlightedMenuSql, setHighlightedMenuSql] = useState('');

  // Section 3: Dish (multiple entries) with pagination
  const [menuIdsByMenuIndex, setMenuIdsByMenuIndex] = useState({
    "0": ""
  });
  const [menuIdForDishesError, setMenuIdForDishesError] = useState('');
  const [dishesByMenu, setDishesByMenu] = useState({
    0: [{ id: '', name: '', description: '', price: '', category: '', active: true }]
  });
  const [dishErrorsByMenu, setDishErrorsByMenu] = useState({
    0: [{ id: '', name: '', description: '', price: '', category: '', active: '' }]
  });

  const [showDishSqlBox, setShowDishSqlBox] = useState(false);
  const [highlightedDishSql, setHighlightedDishSql] = useState('');
  const [currentDishId, setCurrentDishId] = useState(null);

  // Section 4: Ingredients associated with dishes
  const [ingredientsByDish, setIngredientsByDish] = useState({
    [`0-0`]: [{ ingredient_id: '', private: false, description: '' }]
  });
  const [ingredientErrorsByDish, setIngredientErrorsByDish] = useState({
    [`0-0`]: [{ ingredient_id: '', private: '', description: '' }]
  });
  const [showIngredientSqlBox, setShowIngredientSqlBox] = useState(false);
  const [highlightedIngredientSql, setHighlightedIngredientSql] = useState('');

  // Instead, track the current menu ID and dish ID
  const [currentMenuId, setCurrentMenuId] = useState(null);

  // Change the single dishIdForIngredients state to a map of IDs by dish key
  const [dishIdsByDishKey, setDishIdsByDishKey] = useState({
    "0-0": ""
  });

  // Initialize original screening state
  const [originalScreening, setOriginalScreening] = useState(null);

  // Initialize from screening data if it exists
  useEffect(() => {
    if (initialScreening?.json) {
      // Copy the screening data to our local state
      setScreening(initialScreening.json);
      setOriginalScreening(initialScreening.json); // Store the original

      // Set restaurant info
      if (initialScreening.json.restaurant) {
        setRestaurantInfo({
          name: initialScreening.json.restaurant.name || '',
          address: initialScreening.json.restaurant.address || '',
          phone: initialScreening.json.restaurant.phone || ''
        });
      }

      // Update menuRestaurantId if we have menus
      const menuIds = Object.keys(initialScreening.json.menus || {});
      if (menuIds.length > 0) {
        const firstMenuId = parseInt(menuIds[0]);
        const firstMenu = initialScreening.json.menus[firstMenuId];
        if (firstMenu?.restaurant_id) {
          setMenuRestaurantId(firstMenu.restaurant_id.toString());
        }
      }

      // Set current menu ID to the first menu
      if (menuIds.length > 0) {
        const firstMenuId = parseInt(menuIds[0]);
        setCurrentMenuId(firstMenuId);

        // Find dishes for this menu
        const dishesForMenu = [];
        Object.keys(initialScreening.json.dishes || {}).forEach(dishKey => {
          if (initialScreening.json.dishes[dishKey].menu === firstMenuId) {
            dishesForMenu.push(parseInt(dishKey));
          }
        });

        // Set current dish ID to the first dish of this menu
        if (dishesForMenu.length > 0) {
          setCurrentDishId(dishesForMenu[0]);
        }
      }

      // --- FIX: Populate menuIdsByMenuIndex from loaded dishes ---
      const menuIdMap = {};
      Object.values(initialScreening.json.dishes || {}).forEach(dish => {
        if (dish.menu !== undefined && dish.menu_id) {
          // Only set if not already set (first dish's menu_id wins)
          if (!menuIdMap[dish.menu]) {
            menuIdMap[dish.menu] = dish.menu_id;
          }
        }
      });
      setMenuIdsByMenuIndex(menuIdMap);
      // --- END FIX ---

      // --- FIX: Populate dishIdsByDishKey from loaded ingredients ---
      const dishIdMap = {};
      Object.values(initialScreening.json.ingredients || {}).forEach(ingredient => {
        if (ingredient.dish !== undefined && ingredient.dish_id) {
          if (!dishIdMap[ingredient.dish]) {
            dishIdMap[ingredient.dish] = ingredient.dish_id;
          }
        }
      });
      setDishIdsByDishKey(dishIdMap);
      // --- END FIX ---

      // Load todo items if they exist
      if (initialScreening.json.todo_list && Array.isArray(initialScreening.json.todo_list)) {
        setTodoItems(initialScreening.json.todo_list);
      }
    } else {
      // If no screening is passed in, set originalScreening to an empty object
      setOriginalScreening({
        restaurant: {
          name: '',
          address: '',
          phone: ''
        },
        menus: {},
        dishes: {},
        ingredients: {},
        todo_list: [],
        status: false
      });
    }
  }, [initialScreening]);

  // Track if screening has changed from original
  useEffect(() => {
    if (!originalScreening) return;
    // Deep compare using JSON.stringify (sufficient for this use case)
    const isDirty = JSON.stringify(screening) !== JSON.stringify(originalScreening);
    setIsScreeningDirty(isDirty);
  }, [screening, originalScreening, setIsScreeningDirty]);

  // Highlight SQL when code box is shown or values change
  useEffect(() => {
    if (showSqlBox) {
      const raw = generateSqlQuery();
      const html = Prism.highlight(raw, Prism.languages.sql, 'sql');
      setHighlightedSql(html);
    }
  }, [showSqlBox, restaurantInfo]);

  // Update handle input changes for restaurant
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedRestaurantInfo = {
      ...restaurantInfo,
      [name]: value
    };

    // Update both the restaurant info state and the screening state
    setRestaurantInfo(updatedRestaurantInfo);
    updateRestaurantInfo(updatedRestaurantInfo);

    // Validate the input
    validateField(name, value);
  };

  // Validate a field based on its constraints
  const validateField = (fieldName, value) => {
    let error = '';

    switch (fieldName) {
      case 'name':
        if (!value) {
          error = 'Name is required';
        } else if (value.length > 255) {
          error = 'Name must be less than 255 characters';
        }
        break;
      case 'address':
        if (!value) {
          error = 'Address is required';
        }
        break;
      case 'phone':
        if (!value) {
          error = 'Phone is required';
        } else if (value.length > 20) {
          error = 'Phone must be less than 20 characters';
        } else if (!/^[0-9+\-() ]+$/.test(value)) {
          error = 'Phone must contain only numbers and common phone symbols';
        }
        break;
      default:
        break;
    }

    setFormErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));

    return !error;
  };

  // Validate all fields
  const validateForm = () => {
    let isValid = true;

    Object.keys(restaurantInfo).forEach(fieldName => {
      const value = restaurantInfo[fieldName];
      const fieldIsValid = validateField(fieldName, value);
      if (!fieldIsValid) isValid = false;
    });

    return isValid;
  };

  // Toggle SQL query display
  const toggleSqlBox = () => {
    if (!showSqlBox) {
      // Validate before showing SQL
      validateForm();
    }
    setShowSqlBox(!showSqlBox);
  };

  // Update addMenu function to initialize dish ID for the menu's first dish
  const addMenu = () => {
    const newMenuIndex = Object.keys(screening.menus || {}).length;
    const newDishKey = `${newMenuIndex}-0`;

    // Use the current restaurant ID for the new menu
    const restaurant_id = menuRestaurantId || '';

    setScreening(prev => ({
      ...prev,
      menus: {
        ...prev.menus,
        [newMenuIndex]: {
          restaurant_id: restaurant_id,
          name: '',
          description: '',
          active: true
        }
      }
    }));

    // Initialize first dish for the new menu
    setDishesByMenu({
      ...dishesByMenu,
      [newMenuIndex]: [{ id: '', name: '', description: '', price: '', category: '', active: true }]
    });

    setDishErrorsByMenu({
      ...dishErrorsByMenu,
      [newMenuIndex]: [{ id: '', name: '', description: '', price: '', category: '', active: '' }]
    });

    // Initialize ingredients for the new menu's first dish
    setIngredientsByDish({
      ...ingredientsByDish,
      [newDishKey]: [{ ingredient_id: '', private: false, description: '' }]
    });

    setIngredientErrorsByDish({
      ...ingredientErrorsByDish,
      [newDishKey]: [{ ingredient_id: '', private: '', description: '' }]
    });

    // Initialize menu ID for the new menu
    setMenuIdsByMenuIndex({
      ...menuIdsByMenuIndex,
      [newMenuIndex]: ''
    });

    // Initialize dish ID for the new menu's first dish
    setDishIdsByDishKey({
      ...dishIdsByDishKey,
      [newDishKey]: ''
    });

    // Set the current menu to the new menu and first dish
    setCurrentMenuId(newMenuIndex);
    setCurrentDishId(0); // Reset to first dish of the new menu

    // Add a new dish to the screening state
    addNewDish(newMenuIndex);
  };

  // Update handle menu input changes
  const handleMenuInputChange = (menuId, e) => {
    const { name, value, type, checked } = e.target;
    const menuUpdate = {
      [name]: type === 'checkbox' ? checked : value
    };

    // Also update restaurant_id if we're changing it
    if (name === 'restaurant_id') {
      setMenuRestaurantId(value);
    }

    updateMenu(menuId, menuUpdate);

    // Validate field immediately
    if (name === 'name') {
      validateMenuField(menuId, name, value);
    } else if (name === 'pdf') {
      validateMenuField(menuId, name, value);
    }
  };

  // Validate a menu field
  const validateMenuField = (idx, field, value) => {
    let error = '';
    if (field === 'name') {
      if (!value) error = 'Name is required';
      else if (value.length > 255) error = 'Max 255 characters';
    } else if (field === 'pdf') {
      if (value && value.length > 512) error = 'Max 512 characters';
    }
    // No validation for description (TEXT) or active (checkbox)

    // Create dishErrorsByMenu[idx] if it doesn't exist
    if (!dishErrorsByMenu[idx]) {
      setDishErrorsByMenu(prev => ({
        ...prev,
        [idx]: {}
      }));
      return !error; // Return early since we can't update the state in the same cycle
    }

    const newErrors = { ...dishErrorsByMenu };
    if (!newErrors[idx]) {
      newErrors[idx] = {};
    }
    newErrors[idx][field] = error;
    setDishErrorsByMenu(newErrors);
    return !error;
  };

  // Validate all menu entries
  const validateAllMenus = () => {
    let valid = true;
    // Validate restaurant_id
    if (!menuRestaurantId) {
      setMenuRestaurantIdError('Restaurant ID is required');
      valid = false;
    } else if (!/^\d+$/.test(menuRestaurantId)) {
      setMenuRestaurantIdError('Must be an integer');
      valid = false;
    } else {
      setMenuRestaurantIdError('');
    }
    Object.keys(screening.menus || {}).forEach((menuId, idx) => {
      const menu = screening.menus[menuId];
      Object.keys(menu).forEach(field => {
        if (!validateMenuField(idx, field, menu[field])) valid = false;
      });
    });
    return valid;
  };

  // Update SQL generation functions
  const generateSqlQuery = () => {
    return `INSERT INTO restaurant (name, address, phone) \nVALUES \n    ('${restaurantInfo.name}', '${restaurantInfo.address}', '${restaurantInfo.phone}')\nON DUPLICATE KEY UPDATE \n    name = VALUES(name), \n    address = VALUES(address), \n    phone = VALUES(phone);`;
  };

  const generateMenuSql = () => {
    const rid = menuRestaurantId;
    const menus = getMenusArray();

    const values = menus.map(menu =>
      `    (${rid}, '${menu.name?.replace(/'/g, "''")}', '${menu.description?.replace(/'/g, "''")}', ${menu.active ? 1 : 0}, '${menu.pdf?.replace(/'/g, "''") || ''}')`
    ).join(',\n');

    return values.length > 0
      ? `INSERT INTO menu (restaurant_id, name, description, active, pdf_url) \nVALUES\n${values}\nON DUPLICATE KEY UPDATE \n    name = VALUES(name), \n    description = VALUES(description), \n    active = VALUES(active), \n    pdf_url = VALUES(pdf_url);`
      : '-- No menus added';
  };

  // Highlight SQL for menus
  useEffect(() => {
    if (showMenuSqlBox) {
      const raw = generateMenuSql();
      const html = Prism.highlight(raw, Prism.languages.sql, 'sql');
      setHighlightedMenuSql(html);
    }
  }, [showMenuSqlBox, screening.menus, menuRestaurantId]);

  // Toggle menu SQL box
  const toggleMenuSqlBox = () => {
    if (!showMenuSqlBox) validateAllMenus();
    setShowMenuSqlBox(!showMenuSqlBox);
  };

  // Update addDish function to initialize the dish ID for the new dish
  const addDish = () => {
    if (!currentMenuId) return;

    // Get the menu_id from the menuIdsByMenuIndex to ensure consistency
    const menu_id = menuIdsByMenuIndex[currentMenuId] || '';

    // Add a new dish to the current menu in the main screening state
    addNewDish(currentMenuId);
  };

  // Update handle dish input changes
  const handleDishInputChange = (dishId, e) => {
    const { name, value, type, checked } = e.target;
    const dishUpdate = {
      [name]: type === 'checkbox' ? checked : value
    };

    // Also update menu_id if we're changing it
    if (name === 'menu_id') {
      const dish = screening.dishes[dishId];
      const menuId = dish.menu;
      setMenuIdsByMenuIndex({
        ...menuIdsByMenuIndex,
        [menuId]: value
      });
    }

    updateDish(dishId, dishUpdate);

    // Validate field immediately
    if (name === 'name' || name === 'price' || name === 'category') {
      const menuId = screening.dishes[dishId].menu;
      validateDishField(menuId, dishId, name, value);
    }
  };

  // Update validateDishField to handle dishes by menu
  const validateDishField = (menuIdx, dishIdx, field, value) => {
    let error = '';
    switch (field) {
      case 'name':
        if (!value) error = 'Name is required';
        else if (value.length > 255) error = 'Max 255 characters';
        break;
      case 'price':
        if (!value) error = 'Price is required';
        else if (!/^\d+(\.\d{1,2})?$/.test(value)) error = 'Must be a valid price (e.g., 10.99)';
        break;
      case 'category':
        if (value && value.length > 100) error = 'Max 100 characters';
        break;
      // No validation for description (TEXT) or active (checkbox)
    }

    // Create dishErrorsByMenu[menuIdx] if it doesn't exist
    if (!dishErrorsByMenu[menuIdx]) {
      setDishErrorsByMenu(prev => ({
        ...prev,
        [menuIdx]: {}
      }));
      return !error; // Return early since we can't update the state in the same cycle
    }

    const currentMenuDishErrors = { ...dishErrorsByMenu[menuIdx] };

    // Create currentMenuDishErrors[dishIdx] if it doesn't exist
    if (!currentMenuDishErrors[dishIdx]) {
      currentMenuDishErrors[dishIdx] = {};
    }

    currentMenuDishErrors[dishIdx] = {
      ...currentMenuDishErrors[dishIdx],
      [field]: error
    };

    setDishErrorsByMenu({
      ...dishErrorsByMenu,
      [menuIdx]: currentMenuDishErrors
    });

    return !error;
  };

  // Update validateAllDishes to use the menu ID from the map
  const validateAllDishes = () => {
    let valid = true;

    // Validate menu_id for the current menu
    const menuIdForCurrentMenu = menuIdsByMenuIndex[currentMenuId] || '';

    if (!menuIdForCurrentMenu) {
      setMenuIdForDishesError('Menu ID is required');
      valid = false;
    } else if (!/^\d+$/.test(menuIdForCurrentMenu)) {
      setMenuIdForDishesError('Must be an integer');
      valid = false;
    } else {
      setMenuIdForDishesError('');
    }

    const currentMenuDishes = dishesByMenu[currentMenuId] || [];
    currentMenuDishes.forEach((dish, idx) => {
      Object.keys(dish).forEach(field => {
        if (field !== 'description' && field !== 'category') { // These can be empty
          if (!validateDishField(currentMenuId, idx, field, dish[field])) valid = false;
        }
      });
    });

    return valid;
  };

  // Update the dish SQL generation to include ALL dishes across all menus
  const generateDishSql = () => {
    let allValues = [];

    // Loop through all dishes
    Object.keys(screening.dishes || {}).forEach(dishId => {
      const dish = screening.dishes[dishId];
      const menuId = dish.menu;
      // Get menu_id from the consistent mapping, use default value of 1
      const menu_id = menuIdsByMenuIndex[menuId] || '1';

      // Include all dishes with placeholder values for empty fields
      const name = dish.name || `Dish ${dishId}`;
      const price = dish.price || '0';

      const dishValue =
        `    (${menu_id}, '${name.replace(/'/g, "''")}', '${dish.description?.replace(/'/g, "''") || ''}', ${price}, '${dish.category?.replace(/'/g, "''") || ''}', ${dish.active ? 1 : 0})`;
      allValues.push(dishValue);
    });

    return allValues.length > 0
      ? `INSERT INTO dish (menu_id, name, description, price, category, active) \nVALUES\n${allValues.join(',\n')}\nON DUPLICATE KEY UPDATE \n    name = VALUES(name), \n    description = VALUES(description), \n    price = VALUES(price), \n    category = VALUES(category), \n    active = VALUES(active);`
      : '-- No dishes added to any menu';
  };

  // Update dish navigation functions
  const nextDish = () => {
    // Get all dishes for the current menu, sorted by ID
    const dishesForMenu = [];
    Object.keys(screening.dishes || {}).forEach(dishKey => {
      if (screening.dishes[dishKey].menu === currentMenuId) {
        dishesForMenu.push(parseInt(dishKey));
      }
    });

    dishesForMenu.sort((a, b) => a - b);

    const currentIndex = dishesForMenu.indexOf(currentDishId);
    if (currentIndex < dishesForMenu.length - 1) {
      const nextDishId = dishesForMenu[currentIndex + 1];
      setCurrentDishId(nextDishId);
    }
  };

  const prevDish = () => {
    // Get all dishes for the current menu, sorted by ID
    const dishesForMenu = [];
    Object.keys(screening.dishes || {}).forEach(dishKey => {
      if (screening.dishes[dishKey].menu === currentMenuId) {
        dishesForMenu.push(parseInt(dishKey));
      }
    });

    dishesForMenu.sort((a, b) => a - b);

    const currentIndex = dishesForMenu.indexOf(currentDishId);
    if (currentIndex > 0) {
      const prevDishId = dishesForMenu[currentIndex - 1];
      setCurrentDishId(prevDishId);
    }
  };

  const goToDish = (dishId) => {
    if (screening.dishes && screening.dishes[dishId]) {
      setCurrentDishId(dishId);
    }
  };

  // Update addIngredientEntry function to properly add ingredients to the screening state
  const addIngredientEntry = () => {
    if (!currentDishId) return;

    // Get the dish_id from the dishIdsByDishKey mapping for consistency
    const dish_id = dishIdsByDishKey[currentDishId] || '';

    // Add a new ingredient to the current dish in the main screening state
    addNewIngredient(currentDishId);
  };

  // Update handle ingredient input changes
  const handleIngredientInputChange = (ingredientId, e) => {
    const { name, value, type, checked } = e.target;

    // Skip if trying to update dish_id directly
    if (name === 'dish_id') return;

    const ingredientUpdate = {
      [name]: type === 'checkbox' ? checked : value
    };

    updateIngredient(ingredientId, ingredientUpdate);

    // Special handling for ingredient_id changes
    if (name === 'ingredient_id') {
      const ingredient = screening.ingredients[ingredientId];

      // If this is an ingredient within an item and user selected Secondary Ingredient (400001)
      if (ingredient.ingredient_item && value == 400001) {
        // Find the max secondary number and increment
        const maxSecondary = Math.max(0, ...Object.values(screening.ingredients || {})
          .filter(ing => ing.secondary)
          .map(ing => ing.secondary));

        const newSecondaryNumber = maxSecondary + 1;

        // Convert this ingredient into a secondary ingredient
        updateIngredient(ingredientId, {
          secondary: newSecondaryNumber,
          private: true, // Secondary ingredients are always private
        });

        // Don't automatically add a first ingredient to this new secondary
        // The user will add ingredients to the secondary group manually
      }

      // If changing from a secondary ingredient to something else
      else if (ingredient.secondary && value != 400001) {
        // Find and remove all child ingredients of this secondary
        const secondaryIngredients = Object.keys(screening.ingredients || {}).filter(key =>
          screening.ingredients[key].secondary_ingredient === ingredient.secondary
        );

        // Remove all child ingredients
        const newIngredients = { ...screening.ingredients };
        secondaryIngredients.forEach(key => delete newIngredients[key]);

        // Update the screening with ingredients removed and secondary field removed
        setScreening(prev => ({
          ...prev,
          ingredients: newIngredients
        }));

        // Remove the secondary field
        updateIngredient(ingredientId, {
          secondary: undefined
        });
      }

      // If this is a dish's direct ingredient (not in item) and user selected Item (400000)
      else if (!ingredient.ingredient_item && value == 400000 && !ingredient.secondary) {
        // Find the max item number and increment
        const maxItem = Math.max(0, ...Object.values(screening.ingredients || {})
          .filter(ing => ing.item)
          .map(ing => ing.item));

        // Convert this ingredient to an item
        updateIngredient(ingredientId, {
          item: maxItem + 1
        });
      }

      // If changing from an item to something else
      else if (ingredient.item && value != 400000) {
        // Find all ingredients that are part of this item
        const itemIngredients = Object.keys(screening.ingredients || {}).filter(key =>
          screening.ingredients[key].ingredient_item === ingredient.item
        );

        // Remove all child ingredients
        const newIngredients = { ...screening.ingredients };
        itemIngredients.forEach(key => delete newIngredients[key]);

        // Update the screening with ingredients removed
        setScreening(prev => ({
          ...prev,
          ingredients: newIngredients
        }));

        // Remove the item field
        updateIngredient(ingredientId, {
          item: undefined
        });
      }

      const dishKey = ingredient.dish;
      const ingredientIdx = getCurrentDishIngredients().findIndex(ing => ing.id === ingredientId);
      if (ingredientIdx !== -1) {
        validateIngredientField(`${currentMenuId}-${dishKey}`, ingredientIdx, name, value);
      }
    }
  };

  // Update validateIngredientField to skip dish_id validation
  const validateIngredientField = (dishKey, ingredientIdx, field, value) => {
    let error = '';
    switch (field) {
      case 'ingredient_id':
        if (!value) error = 'Ingredient ID is required';
        else if (!/^\d+$/.test(value)) error = 'Must be an integer';
        break;
      // Skip dish_id validation since we're using dishIdsByDishKey
      // No validation for private (checkbox) or description (TEXT)
    }

    // Create ingredientErrorsByDish[dishKey] if it doesn't exist
    if (!ingredientErrorsByDish[dishKey]) {
      setIngredientErrorsByDish(prev => ({
        ...prev,
        [dishKey]: []
      }));
      return !error; // Return early since we can't update the state in the same cycle
    }

    const currentErrors = [...(ingredientErrorsByDish[dishKey] || [])];

    // Create currentErrors[ingredientIdx] if it doesn't exist
    if (!currentErrors[ingredientIdx]) {
      currentErrors[ingredientIdx] = {};
    }

    currentErrors[ingredientIdx] = {
      ...currentErrors[ingredientIdx],
      [field]: error
    };

    setIngredientErrorsByDish({
      ...ingredientErrorsByDish,
      [dishKey]: currentErrors
    });

    return !error;
  };

  // Update validateAllIngredients to use the dish ID from the map
  const validateAllIngredients = () => {
    let valid = true;

    // Validate dish_id for the current dish
    const dishIdForCurrentDish = dishIdsByDishKey[currentDishId] || '';

    if (!dishIdForCurrentDish) {
      // Could add error state for dish ID if needed
      valid = false;
    } else if (!/^\d+$/.test(dishIdForCurrentDish)) {
      // Could add error state for dish ID if needed
      valid = false;
    }

    const dishKey = `${currentMenuId}-${currentDishId}`;
    const currentIngredients = ingredientsByDish[dishKey] || [];

    currentIngredients.forEach((entry, idx) => {
      Object.keys(entry).forEach(field => {
        if (field !== 'description' && field !== 'private' && field !== 'dish_id') { // These can be empty
          if (!validateIngredientField(dishKey, idx, field, entry[field])) valid = false;
        }
      });
    });

    return valid;
  };

  // Update the ingredient SQL generation to include ALL ingredients across dishes
  const generateIngredientSql = () => {
    let allValues = [];

    // Loop through all ingredients
    Object.keys(screening.ingredients || {}).forEach(ingredientId => {
      const ingredient = screening.ingredients[ingredientId];

      // Skip items (ingredient_id = 400000) and also ingredients with ID 40000
      if (isItem(ingredient) || ingredient.ingredient_id == 40000) {
        return;
      }

      const dishId = ingredient.dish;
      // Get dish_id from the consistent mapping
      const dish_id = dishIdsByDishKey[dishId] || '1';  // Use default value of 1

      // Include all ingredients with placeholder values for empty fields
      const ingredient_id = ingredient.ingredient_id || '1';  // Use default value of 1

      // Process the description based on ingredient type
      let description = ingredient.description || '';
      let isPrivate = ingredient.private || false;

      // For secondary ingredients, their children need to use the secondary's description
      if (isSecondary(ingredient)) {
        // This is a secondary ingredient, no special description formatting but enforce private=TRUE
        isPrivate = true;
      }
      else if (ingredient.secondary_ingredient) {
        // This is a child of a secondary ingredient
        // Find the parent secondary ingredient
        const parentSecondary = Object.values(screening.ingredients || {}).find(
          ing => ing.secondary === ingredient.secondary_ingredient
        );

        // Find if this is inside an item
        let isInsideItem = false;
        let parentItem = null;

        if (parentSecondary && parentSecondary.ingredient_item) {
          isInsideItem = true;
          // Find the parent item
          parentItem = Object.values(screening.ingredients || {}).find(
            ing => ing.item === parentSecondary.ingredient_item
          );
        }

        if (parentSecondary && parentSecondary.description) {
          if (isInsideItem && parentItem && parentItem.description) {
            // For secondary ingredients inside items: [{secondary description}]item's description
            description = `[{${parentSecondary.description}}]${parentItem.description}`;
          } else {
            // Use the parent's description in curly brackets (standard secondary)
            description = `{${parentSecondary.description}}`;
          }
        }

        // For child ingredients of secondary, use their actual private value from the UI
        isPrivate = ingredient.private || false;
      }
      else if (ingredient.ingredient_item) {
        // For ingredients that are part of an item, combine descriptions
        // Find the parent item
        const parentItem = Object.values(screening.ingredients || {}).find(
          ing => ing.item === ingredient.ingredient_item
        );

        if (parentItem && parentItem.description) {
          // If this is a secondary ingredient within an item, handle specially
          if (isSecondary(ingredient)) {
            // Secondary ingredients in items are always private and use their own description
            isPrivate = true;
          }
          // If this is a regular ingredient within an item
          else {
            // NEW FORMAT: [ingredient description]item description
            description = `[${description}]${parentItem.description}`;
          }
        }
      }

      const escapedDescription = description.replace(/'/g, "''");

      const sql = `    (${dish_id}, ${ingredient_id}, ${isPrivate ? 1 : 0}, '${escapedDescription}')`;
      allValues.push(sql);
    });

    return allValues.length > 0
      ? `INSERT INTO dish_ingredient (dish_id, ingredient_id, private, description) \nVALUES\n${allValues.join(',\n')}\nON DUPLICATE KEY UPDATE \n    private = VALUES(private), \n    description = VALUES(description);`
      : '-- No ingredients selected for any dish';
  };

  const generateCCSql = () => {
    let allValues = [];

    // Loop through all ingredients
    Object.keys(screening.ingredients || {}).forEach(ingredientKey => {
      const ingredient = screening.ingredients[ingredientKey];

      // Skip if ingredient doesn't have CC entries
      if (!ingredient.cc || ingredient.cc.length === 0) return;

      // Get dish_id from the ingredient
      const dish_id = ingredient.dish_id || '1';  // Use default value of 1

      // Skip if ingredient_id is not defined
      if (!ingredient.ingredient_id) return;

      // Process each CC entry
      ingredient.cc.forEach(cc => {
        // Skip if no allergen_id is selected
        if (!cc.allergen_id) return;

        const reason = cc.reason || '';
        const description = cc.description?.replace(/'/g, "''") || '';

        const sqlValue = `    (${dish_id}, ${cc.allergen_id}, '${reason}', ${ingredient.ingredient_id}, '${description}')`;
        allValues.push(sqlValue);
      });
    });

    return allValues.length > 0
      ? `INSERT INTO dish_cc_allergen (dish_id, allergen_id, reason, ingredient_id, description) \nVALUES\n${allValues.join(',\n')}\nON DUPLICATE KEY UPDATE \n    reason = VALUES(reason), \n    ingredient_id = VALUES(ingredient_id), \n    description = VALUES(description);`
      : '-- No cross contamination entries added';
  };

  // Highlight SQL for ingredients
  useEffect(() => {
    if (showIngredientSqlBox) {
      const raw = generateIngredientSql();
      const html = Prism.highlight(raw, Prism.languages.sql, 'sql');
      setHighlightedIngredientSql(html);
    }
  }, [showIngredientSqlBox, screening.ingredients, ingredientsByDish, currentMenuId, currentDishId, dishesByMenu, dishIdsByDishKey]);

  // Toggle ingredient SQL box
  const toggleIngredientSqlBox = () => {
    if (!showIngredientSqlBox) {
      // Run validation but don't block the toggle action
      validateAllIngredients();
    }
    // Always toggle visibility
    setShowIngredientSqlBox(!showIngredientSqlBox);
  };

  // Helper function to calculate visible pagination dots
  const getVisiblePaginationItems = (items, currentItem, maxVisible = 10) => {
    if (items.length <= maxVisible) {
      return items;
    }

    const currentIndex = items.findIndex(item =>
      typeof item === 'object' ? item.id === currentItem : item === currentItem
    );

    if (currentIndex === -1) {
      return items.slice(0, maxVisible);
    }

    const halfVisible = Math.floor(maxVisible / 2);
    let startIndex = Math.max(0, currentIndex - halfVisible);
    let endIndex = Math.min(items.length, startIndex + maxVisible);

    // Adjust if we're near the end
    if (endIndex - startIndex < maxVisible) {
      startIndex = Math.max(0, endIndex - maxVisible);
    }

    return items.slice(startIndex, endIndex);
  };

  // Update navigation functions for menus
  const nextMenu = () => {
    const menuIds = Object.keys(screening.menus || {})
      .map(id => parseInt(id))
      .sort((a, b) => a - b);

    const currentIndex = menuIds.indexOf(currentMenuId);
    if (currentIndex < menuIds.length - 1) {
      const nextMenuId = menuIds[currentIndex + 1];
      setCurrentMenuId(nextMenuId);

      // Also update current dish to the first dish of this menu
      const dishesForMenu = [];
      Object.keys(screening.dishes || {}).forEach(dishKey => {
        if (screening.dishes[dishKey].menu === nextMenuId) {
          dishesForMenu.push(parseInt(dishKey));
        }
      });

      if (dishesForMenu.length > 0) {
        const firstDishId = dishesForMenu[0];
        setCurrentDishId(firstDishId);
      }
    }
  };

  const prevMenu = () => {
    const menuIds = Object.keys(screening.menus || {})
      .map(id => parseInt(id))
      .sort((a, b) => a - b);

    const currentIndex = menuIds.indexOf(currentMenuId);
    if (currentIndex > 0) {
      const prevMenuId = menuIds[currentIndex - 1];
      setCurrentMenuId(prevMenuId);

      // Also update current dish to the first dish of this menu
      const dishesForMenu = [];
      Object.keys(screening.dishes || {}).forEach(dishKey => {
        if (screening.dishes[dishKey].menu === prevMenuId) {
          dishesForMenu.push(parseInt(dishKey));
        }
      });

      if (dishesForMenu.length > 0) {
        const firstDishId = dishesForMenu[0];
        setCurrentDishId(firstDishId);
      }
    }
  };

  const goToMenu = (menuId) => {
    if (screening.menus && screening.menus[menuId]) {
      setCurrentMenuId(menuId);

      // Also update current dish to the first dish of this menu
      const dishesForMenu = [];
      Object.keys(screening.dishes || {}).forEach(dishKey => {
        if (screening.dishes[dishKey].menu === menuId) {
          dishesForMenu.push(parseInt(dishKey));
        }
      });

      if (dishesForMenu.length > 0) {
        const firstDishId = dishesForMenu[0];
        setCurrentDishId(firstDishId);
      }
    }
  };

  // Highlight SQL for dishes
  useEffect(() => {
    if (showDishSqlBox) {
      const raw = generateDishSql();
      const html = Prism.highlight(raw, Prism.languages.sql, 'sql');
      setHighlightedDishSql(html);
    }
  }, [showDishSqlBox, screening.dishes, menuIdsByMenuIndex]);

  // Toggle dish SQL box
  const toggleDishSqlBox = () => {
    if (!showDishSqlBox) {
      // Run validation but don't block the toggle action
      validateAllDishes();
    }
    // Always toggle visibility
    setShowDishSqlBox(!showDishSqlBox);
  };

  // Add functions to help with object/array conversion
  const getMenusArray = () => {
    const menuKeys = Object.keys(screening.menus || {});
    return menuKeys.map(key => ({
      id: key,
      ...screening.menus[key],
    }));
  };

  const getDishesForMenu = (menuId) => {
    const dishes = [];
    Object.keys(screening.dishes || {}).forEach(dishKey => {
      if (screening.dishes[dishKey].menu === menuId) {
        dishes.push({
          id: dishKey,
          ...screening.dishes[dishKey]
        });
      }
    });
    return dishes;
  };

  const getIngredientsForDish = (dishId) => {
    const ingredients = [];
    Object.keys(screening.ingredients || {}).forEach(ingredientKey => {
      if (screening.ingredients[ingredientKey].dish === dishId) {
        ingredients.push({
          id: parseInt(ingredientKey),
          ...screening.ingredients[ingredientKey]
        });
      }
    });
    return ingredients;
  };

  // Add functions to update the screening object
  const updateRestaurantInfo = (updatedInfo) => {
    setScreening(prev => ({
      ...prev,
      restaurant: {
        ...prev.restaurant,
        ...updatedInfo
      }
    }));
    setRestaurantInfo(updatedInfo);
  };

  const updateMenu = (menuId, updatedMenu) => {
    setScreening(prev => ({
      ...prev,
      menus: {
        ...prev.menus,
        [menuId]: {
          ...prev.menus[menuId],
          ...updatedMenu
        }
      }
    }));
  };

  const updateDish = (dishId, updatedDish) => {
    setScreening(prev => ({
      ...prev,
      dishes: {
        ...prev.dishes,
        [dishId]: {
          ...prev.dishes[dishId],
          ...updatedDish
        }
      }
    }));
  };

  const updateIngredient = (ingredientId, updatedIngredient) => {
    setScreening(prev => ({
      ...prev,
      ingredients: {
        ...prev.ingredients,
        [ingredientId]: {
          ...prev.ingredients[ingredientId],
          ...updatedIngredient
        }
      }
    }));
  };

  // Add functions for adding new items
  const addNewMenu = () => {
    // Generate a new key (max key + 1)
    const menuKeys = Object.keys(screening.menus || {}).map(k => parseInt(k, 10));
    const newMenuKey = menuKeys.length > 0 ? Math.max(...menuKeys) + 1 : 1;

    const newMenu = {
      restaurant_id: menuRestaurantId || '',
      name: '',
      description: '',
      active: true
    };

    setScreening(prev => ({
      ...prev,
      menus: {
        ...prev.menus,
        [newMenuKey]: newMenu
      }
    }));

    // Set the current menu ID to the new menu
    setCurrentMenuId(newMenuKey);

    // Add a first dish for this menu
    addNewDish(newMenuKey);
  };

  const addNewDish = (menuId) => {
    // Generate a new key (max key + 1)
    const dishKeys = Object.keys(screening.dishes || {}).map(k => parseInt(k, 10));
    const newDishKey = dishKeys.length > 0 ? Math.max(...dishKeys) + 1 : 1;

    // Get the menu_id from menuIdsByMenuIndex to ensure consistent menu_id
    const menu_id = menuIdsByMenuIndex[menuId] || '';

    const newDish = {
      menu: menuId,
      menu_id: menu_id,
      name: '',
      description: '',
      price: '',
      category: '',
      active: true
    };

    setScreening(prev => ({
      ...prev,
      dishes: {
        ...prev.dishes,
        [newDishKey]: newDish
      }
    }));

    // Set the current dish ID to the new dish
    setCurrentDishId(newDishKey);

    // Add a first ingredient for this dish
    addNewIngredient(newDishKey);
  };

  const addNewIngredient = (dishId) => {
    // Generate a new key (max key + 1)
    const ingredientKeys = Object.keys(screening.ingredients || {}).map(k => parseInt(k, 10));
    const newIngredientKey = ingredientKeys.length > 0 ? Math.max(...ingredientKeys) + 1 : 1;

    // Get the dish_id from dishIdsByDishKey to ensure consistent dish_id
    const dish_id = dishIdsByDishKey[dishId] || '';

    const newIngredient = {
      dish: dishId,
      dish_id: dish_id,
      ingredient_id: '',
      private: false, // Explicitly set to false for new ingredients
      description: ''
    };

    setScreening(prev => ({
      ...prev,
      ingredients: {
        ...prev.ingredients,
        [newIngredientKey]: newIngredient
      }
    }));
  };

  // Use these helper functions to get current data
  const getCurrentMenu = () => {
    return screening.menus?.[currentMenuId] || {};
  };

  const getCurrentMenuDishes = () => {
    const dishes = [];
    Object.keys(screening.dishes || {}).forEach(dishKey => {
      if (screening.dishes[dishKey].menu === currentMenuId) {
        dishes.push({
          id: parseInt(dishKey),
          ...screening.dishes[dishKey]
        });
      }
    });
    return dishes.sort((a, b) => a.id - b.id);
  };

  const getCurrentDish = () => {
    return screening.dishes?.[currentDishId] || {};
  };

  const getCurrentDishIngredients = () => {
    const ingredients = [];
    Object.keys(screening.ingredients || {}).forEach(ingredientKey => {
      const ingredient = screening.ingredients[ingredientKey];
      // Only include ingredients directly under the dish (not part of items or secondary ingredients)
      if (ingredient.dish === currentDishId && !ingredient.ingredient_item && !ingredient.secondary_ingredient) {
        ingredients.push({
          id: parseInt(ingredientKey),
          ...ingredient
        });
      }
    });
    return ingredients.sort((a, b) => a.id - b.id);
  };

  // Add state for images
  const [uploadErrors, setUploadErrors] = useState({});
  const [compressionStatus, setCompressionStatus] = useState({});
  const fileInputRefs = useRef({});
  // Store compressed image files for upload on save
  const [pendingImageUploads, setPendingImageUploads] = useState({});

  // Function to trigger file input click
  const triggerFileInput = (ingredientId) => {
    if (fileInputRefs.current[ingredientId]) {
      fileInputRefs.current[ingredientId].click();
    }
  };

  // Image compression function to ensure file size is under 5MB
  const compressImage = (file, ingredientId) => {
    return new Promise((resolve, reject) => {
      // Update compression status
      setCompressionStatus(prev => ({
        ...prev,
        [ingredientId]: `Compressing ${file.name}...`
      }));

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          // Create canvas
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1080;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round(height * (MAX_WIDTH / width));
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round(width * (MAX_HEIGHT / height));
              height = MAX_HEIGHT;
            }
          }

          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;

          // Draw image on canvas
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Start with high quality
          let quality = 0.9;
          let compressedFile;

          // Function to convert data URL to File object
          const dataURLtoFile = (dataURL, filename) => {
            const arr = dataURL.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);

            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }

            return new File([u8arr], filename, { type: mime });
          };

          // Function to compress recursively until size is under limit
          const compressRecursively = () => {
            // Convert canvas to data URL with current quality
            const dataURL = canvas.toDataURL('image/jpeg', quality);

            // Convert data URL to file
            compressedFile = dataURLtoFile(dataURL, file.name);

            // Update compression status with current size info
            setCompressionStatus(prev => ({
              ...prev,
              [ingredientId]: `Compressing ${file.name}... (${(compressedFile.size / (1024 * 1024)).toFixed(2)}MB)`
            }));

            // Check size (5MB = 5 * 1024 * 1024 bytes)
            if (compressedFile.size > 5 * 1024 * 1024 && quality > 0.1) {
              // Reduce quality and try again
              quality -= 0.1;
              compressRecursively();
            } else {
              // Size is acceptable or quality can't be reduced further
              // Clear compression status
              setCompressionStatus(prev => {
                const newStatus = { ...prev };
                delete newStatus[ingredientId];
                return newStatus;
              });

              resolve(compressedFile);
            }
          };

          // Start compression
          compressRecursively();
        };

        img.onerror = (error) => {
          // Clear compression status on error
          setCompressionStatus(prev => {
            const newStatus = { ...prev };
            delete newStatus[ingredientId];
            return newStatus;
          });

          reject(error);
        };
      };

      reader.onerror = (error) => {
        // Clear compression status on error
        setCompressionStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[ingredientId];
          return newStatus;
        });

        reject(error);
      };
    });
  };

  // Add function to handle image selection
  const handleImageSelect = async (ingredientId, event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Get the ingredient
    const ingredient = screening.ingredients[ingredientId];
    if (!ingredient) return;

    // Check if we already have 4 images
    const currentImages = ingredient.images || [];

    // Check if adding these images would exceed the limit of 4
    if (currentImages.length + files.length > 4) {
      setUploadErrors({
        ...uploadErrors,
        [ingredientId]: `Can only add ${4 - currentImages.length} more image(s). You selected ${files.length}.`
      });

      // If there's at least some space left, we'll process only what fits
      if (currentImages.length >= 4) return;
    }

    // Determine how many files we can process
    const filesToProcess = Math.min(files.length, 4 - currentImages.length);

    // Arrays to collect new object URLs and pending uploads
    const newObjectUrls = [];
    const newPendingUploads = [];

    // Process each file up to the limit
    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i];

      try {
        // Show compression status
        setCompressionStatus(prev => ({
          ...prev,
          [ingredientId]: `Compressing ${i + 1} of ${filesToProcess} files...`
        }));

        // Compress image but don't upload yet
        const compressedFile = await compressImage(file, ingredientId);

        // Create a temporary object URL for the compressed file
        const objectUrl = URL.createObjectURL(compressedFile);

        // Add to our collections
        newObjectUrls.push(objectUrl);
        newPendingUploads.push({ file: compressedFile, objectUrl });

      } catch (error) {
        console.error('Error compressing image:', error);

        // Update error state
        setUploadErrors({
          ...uploadErrors,
          [ingredientId]: `Failed to process image: ${error.message}`
        });
      }
    }

    // Clear compression status when done
    setCompressionStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[ingredientId];
      return newStatus;
    });

    // Only update if we have successfully processed files
    if (newObjectUrls.length > 0) {
      // Update the pending uploads state with all new files at once
      setPendingImageUploads(prev => ({
        ...prev,
        [ingredientId]: [
          ...(prev[ingredientId] || []),
          ...newPendingUploads
        ]
      }));

      // Update the ingredient with all new URLs at once
      const updatedImages = [...(ingredient.images || []), ...newObjectUrls];
      updateIngredient(ingredientId, { images: updatedImages });

      // Clear error if there was one
      if (uploadErrors[ingredientId]) {
        setUploadErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[ingredientId];
          return newErrors;
        });
      }

      // If we couldn't process all files due to the limit, show a warning
      if (files.length > filesToProcess) {
        setUploadErrors({
          ...uploadErrors,
          [ingredientId]: `Added ${filesToProcess} image(s). Skipped ${files.length - filesToProcess} due to the 4 image limit.`
        });
      }
    }

    // Reset the file input value so the same files can be selected again if needed
    if (fileInputRefs.current[ingredientId]) {
      fileInputRefs.current[ingredientId].value = "";
    }
  };

  // Function to upload a single image to the server
  const uploadImageToServer = async (file, userId, screeningId) => {
    // Create FormData for the upload
    const formData = new FormData();
    formData.append('image', file);

    // Add userId if available to make filename unique
    if (userId) {
      formData.append('userId', userId);

      // Add screening ID if available
      if (screeningId) {
        formData.append('screeningId', screeningId);
      }
    }

    // Make API request to upload
    const UPLOAD_URL = `${import.meta.env.VITE_API_URL}/upload-image`;
    const response = await fetch(UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  };

  // Add function to remove an image
  const removeImage = (ingredientId, imageUrl) => {
    const ingredient = screening.ingredients[ingredientId];
    if (!ingredient || !ingredient.images) return;

    // Filter out the image to remove
    const updatedImages = ingredient.images.filter(url => url !== imageUrl);

    // Also remove from pending uploads if it's there
    setPendingImageUploads(prev => {
      const pendingForIngredient = prev[ingredientId] || [];
      const updatedPending = pendingForIngredient.filter(item => item.objectUrl !== imageUrl);

      // If we have an objectURL, revoke it to free up memory
      if (imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }

      // If this ingredient no longer has any pending uploads, remove the key entirely
      if (updatedPending.length === 0) {
        const newPending = { ...prev };
        delete newPending[ingredientId];
        return newPending;
      }

      // Otherwise, update with the filtered list
      return {
        ...prev,
        [ingredientId]: updatedPending
      };
    });

    // Update the ingredient
    updateIngredient(ingredientId, { images: updatedImages });
  };

  // Add upload progress tracking
  const [uploadProgress, setUploadProgress] = useState({
    isUploading: false,
    message: ''
  });

  // Save handler that also handles image uploads
  const handleSave = async () => {
    // Run validation but don't prevent saving
    const isValid = validateBeforeSave(false); // Don't show alerts

    if (!isValid) {
      // Call validateBeforeSave again with true just to log errors to console
      validateBeforeSave(true);

      // Just inform the user that the screening is not complete without preventing save
      const confirmSave = window.confirm("The screening has validation errors. Do you want to save it anyway?");
      if (!confirmSave) {
        return;
      }
    }

    // Create a deep copy of the screening data that we'll update with server URLs
    const screeningToSave = JSON.parse(JSON.stringify(screening));

    // Check if we have any pending image uploads
    const hasPendingUploads = Object.keys(pendingImageUploads).length > 0;

    if (hasPendingUploads) {
      try {
        // Count total images to upload across all ingredients
        let totalImagesToUpload = 0;
        let uploadedImages = 0;

        // First pass to count total images
        for (const ingredientId of Object.keys(pendingImageUploads)) {
          totalImagesToUpload += pendingImageUploads[ingredientId].length;
        }

        // Show loading message with total count
        setUploadProgress({
          isUploading: true,
          message: `Preparing to upload ${totalImagesToUpload} image${totalImagesToUpload !== 1 ? 's' : ''}...`
        });

        // Process all pending image uploads
        for (const ingredientId of Object.keys(pendingImageUploads)) {
          const pendingUploads = pendingImageUploads[ingredientId];
          const ingredient = screeningToSave.ingredients[ingredientId];

          if (!ingredient || !ingredient.images) continue;

          // Keep track of which object URLs need to be replaced with server URLs
          const urlReplacements = {};

          // Upload each pending image
          for (const [index, { file, objectUrl }] of pendingUploads.entries()) {
            uploadedImages++;

            // Update progress message with overall progress and per-ingredient progress
            setUploadProgress({
              isUploading: true,
              message: `Uploading image ${uploadedImages} of ${totalImagesToUpload} (${index + 1}/${pendingUploads.length} for ingredient ${ingredientId})...`
            });

            // Upload the image to the server
            const result = await uploadImageToServer(
              file,
              user?.username,
              initialScreening?.id
            );

            // Store the mapping from object URL to server URL
            urlReplacements[objectUrl] = result.url;

            // Revoke the object URL to free memory
            URL.revokeObjectURL(objectUrl);
          }

          // Replace object URLs with server URLs in the ingredient
          ingredient.images = ingredient.images.map(url =>
            urlReplacements[url] || url
          );
        }

        // Clear pending uploads since they've now been processed
        setPendingImageUploads({});

        // Clear upload progress
        setUploadProgress({
          isUploading: false,
          message: ''
        });
      } catch (error) {
        console.error("Error uploading images:", error);

        // Clear upload progress
        setUploadProgress({
          isUploading: false,
          message: ''
        });

        alert(`Error uploading images: ${error.message}`);
        return;
      }
    }

    // Get restaurant name for the title
    const restaurantName = screeningToSave.restaurant.name || restaurantInfo.name;
    const screeningTitle = restaurantName || 'Untitled Screening';

    try {
      // Determine if this is a new screening or an update
      if (initialScreening?.id) {
        // This is an existing screening - UPDATE

        // Prepare data to send for update
        const updateData = {
          title: screeningTitle,
          json_data: screeningToSave // Use the updated screening with server URLs
        };

        // Make API request to update
        const UPDATE_URL = `${import.meta.env.VITE_API_URL}/screenings/${initialScreening.id}`;

        const response = await fetch(UPDATE_URL, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Screening updated successfully:', result);

        // Update originalScreening to match current screening (no longer dirty)
        setOriginalScreening(screeningToSave);
        // Update the actual screening state with server URLs
        setScreening(screeningToSave);
        setIsScreeningDirty(false);

        alert('Screening updated successfully!');
      } else {
        // This is a new screening - CREATE

        // Ensure we have the user information
        if (!user || !user.username) {
          throw new Error('User information is missing. Please try again or log out and back in.');
        }

        // Prepare data for creating a new screening
        const createData = {
          user_id: user.username,
          title: screeningTitle,
          json_data: screeningToSave, // Use the updated screening with server URLs
          first_name: userAttributes?.name || '',
          last_name: userAttributes?.family_name || ''
        };

        // Make API request to create
        const CREATE_URL = `${import.meta.env.VITE_API_URL}/screenings`;

        const response = await fetch(CREATE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(createData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log('New screening created successfully:', result);

        // Update the component to reflect that this is now an existing screening
        const newScreeningData = {
          id: result.id,
          json: screeningToSave,
          title: screeningTitle
        };

        // Update state to treat this as an existing screening from now on
        setOriginalScreening(screeningToSave);
        // Update the actual screening state with server URLs
        setScreening(screeningToSave);
        setIsScreeningDirty(false);

        alert('New screening created successfully!');

        // Navigate to the dashboard to see the new screening
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error saving screening:', error);
      alert(`Failed to save screening: ${error.message}`);
    }
  };

  // Comprehensive validation function that checks all areas before saving
  const validateBeforeSave = (showAlerts = true) => {
    let isValid = true;
    let errorFields = [];

    // 1. Validate Restaurant Information
    const restaurantValid = validateForm();
    if (!restaurantValid) {
      isValid = false;
      errorFields.push("Restaurant Information");

      // Force display of error messages for restaurant fields
      Object.keys(restaurantInfo).forEach(fieldName => {
        validateField(fieldName, restaurantInfo[fieldName]);
      });
    }

    // 2. Validate Menus
    if (Object.keys(screening.menus || {}).length > 0) {
      const menusValid = validateAllMenus();
      if (!menusValid) {
        isValid = false;
        errorFields.push("Menus");
      }
    }

    // 3. Validate Dishes (for all menus)
    let dishesValid = true;
    Object.keys(screening.menus || {}).forEach(menuId => {
      // Temporarily set currentMenuId to validate each menu's dishes
      const originalMenuId = currentMenuId;
      setCurrentMenuId(parseInt(menuId));

      const menuDishesValid = validateAllDishes();
      if (!menuDishesValid) {
        dishesValid = false;
      }

      // Restore original currentMenuId
      setCurrentMenuId(originalMenuId);
    });

    if (!dishesValid) {
      isValid = false;
      errorFields.push("Dishes");
    }

    // 4. Validate Ingredients (for all dishes)
    let ingredientsValid = true;
    Object.keys(screening.dishes || {}).forEach(dishId => {
      // Temporarily set currentDishId to validate each dish's ingredients
      const originalDishId = currentDishId;
      setCurrentDishId(parseInt(dishId));

      const dishIngredientsValid = validateAllIngredients();
      if (!dishIngredientsValid) {
        ingredientsValid = false;
      }

      // Restore original currentDishId
      setCurrentDishId(originalDishId);
    });

    if (!ingredientsValid) {
      isValid = false;
      errorFields.push("Ingredients");
    }

    // 5. Check for empty required fields in all parts of the screening object

    // Check restaurant fields (NOT NULL constraints)
    if (!screening.restaurant.name || !screening.restaurant.address || !screening.restaurant.phone) {
      isValid = false;
      if (!errorFields.includes("Restaurant Information")) {
        errorFields.push("Restaurant Information");
      }
    }

    // Check menus (NOT NULL constraints)
    Object.keys(screening.menus || {}).forEach(menuId => {
      const menu = screening.menus[menuId];
      if (!menu.restaurant_id || !menu.name) {
        isValid = false;
        if (!errorFields.includes("Menus")) {
          errorFields.push("Menus");
        }
      }
    });

    // Check dishes (NOT NULL constraints)
    Object.keys(screening.dishes || {}).forEach(dishId => {
      const dish = screening.dishes[dishId];
      if (!dish.menu_id || !dish.name || dish.price === undefined || dish.price === '') {
        isValid = false;
        if (!errorFields.includes("Dishes")) {
          errorFields.push("Dishes");
        }
      }
      // Check price is a valid number
      if (dish.price !== undefined && dish.price !== '' && !/^\d+(\.\d{1,2})?$/.test(dish.price)) {
        isValid = false;
        if (!errorFields.includes("Dishes")) {
          errorFields.push("Dishes (invalid price format)");
        }
      }
    });

    // Check ingredients (NOT NULL constraints)
    Object.keys(screening.ingredients || {}).forEach(ingredientId => {
      const ingredient = screening.ingredients[ingredientId];
      if (!ingredient.dish_id || !ingredient.ingredient_id) {
        isValid = false;
        if (!errorFields.includes("Ingredients")) {
          errorFields.push("Ingredients");
        }
      }
    });

    // If not valid and showAlerts is true, log the error fields
    if (!isValid && showAlerts) {
      console.log("Validation failed for:", errorFields);
    }

    return isValid;
  };

  // Warn user before leaving if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isScreeningDirty) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isScreeningDirty]);

  const [showAllSql, setShowAllSql] = useState(false);

  // This function will replace the old search effect
  const filterIngredientsByTerm = (searchTerm) => {
    if (!searchTerm) return ingredientList;

    return ingredientList.filter(ingredient =>
      ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ingredient.description && ingredient.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  // Create a custom ingredient selector component
  const IngredientSelector = ({
    selectedId,
    onChange,
    hasError,
    ingredientList,
    disabled = false,
    isPartOfItem = false, // Ingredient is part of an item
    isPartOfSecondary = false, // Ingredient is part of a secondary ingredient
    isSecondaryIngredient = false // This is a secondary ingredient itself
  }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [filtered, setFiltered] = useState(ingredientList);
    const containerRef = useRef(null);

    // Filter ingredients when search term changes or when props change
    useEffect(() => {
      let baseList = ingredientList;

      // Apply appropriate filters based on the ingredient type
      if (isPartOfItem) {
        // If ingredient is part of an item, filter out the item option (400000) 
        // but allow secondary ingredient option (400001)
        baseList = baseList.filter(ing => ing.id != 400000);
      }

      if (isPartOfSecondary || isSecondaryIngredient) {
        // Secondary ingredients can't contain items and items can't be secondary
        baseList = baseList.filter(ing => ing.id != 400000);
      }

      if (isPartOfSecondary) {
        // Ingredients that are part of secondary ingredients can't be secondary themselves
        baseList = baseList.filter(ing => ing.id != 400001);
      }

      // Then apply the search term filter
      if (!searchTerm) {
        setFiltered(baseList);
      } else {
        setFiltered(baseList.filter(ingredient =>
          ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (ingredient.description && ingredient.description.toLowerCase().includes(searchTerm.toLowerCase()))
        ));
      }
    }, [searchTerm, isPartOfItem, isPartOfSecondary, isSecondaryIngredient, ingredientList]);

    // Filter ingredients by search term and optional ingredient list
    const filterIngredientsByTerm = (searchTerm, list = ingredientList) => {
      if (!searchTerm) return list;

      return list.filter(ingredient =>
        ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ingredient.description && ingredient.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    };

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Get the name of the selected ingredient
    const selectedIngredient = ingredientList.find(i => i.id == selectedId);
    const displayValue = selectedId && selectedIngredient
      ? `${selectedIngredient.name}`
      : searchTerm;

    return (
      <div
        ref={containerRef}
        className={`ingredient-select-container ${isOpen ? 'open' : ''} ${hasError ? 'error' : ''} ${disabled ? 'disabled' : ''}`}
      >
        <input
          type="text"
          placeholder="Search ingredients..."
          value={displayValue}
          onChange={(e) => {
            if (disabled) return;

            const value = e.target.value;
            setSearchTerm(value);
            // Clear selection if user types
            if (selectedId && value !== displayValue) {
              onChange({ target: { name: 'ingredient_id', value: '' } });
            }
            setIsOpen(true);
          }}
          onFocus={() => !disabled && setIsOpen(true)}
          className="ingredient-search"
          disabled={disabled}
        />
        <div className="dropdown-arrow"></div>
        {isOpen && !disabled && (
          <div className="ingredient-dropdown">
            {filtered.length > 0 ? (
              filtered.map(option => (
                <div
                  key={option.id}
                  className={`dropdown-item ${option.id == selectedId ? 'selected' : ''}`}
                  onClick={() => {
                    onChange({ target: { name: 'ingredient_id', value: option.id } });
                    setSearchTerm('');
                    setIsOpen(false);
                  }}
                >
                  {option.name}<p id="ingredient-description">{option.description ? `${option.description}` : ''}</p>
                </div>
              ))
            ) : (
              <div className="dropdown-empty">No ingredients found</div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Add a debug function to help us see when secondary ingredients appear
  const DEBUG_SECONDARY = false;

  // Helper functions for item and secondary ingredient management
  const isItem = (ingredient) => ingredient.ingredient_id == 400000;
  const isSecondary = (ingredient) => ingredient.ingredient_id == 400001;

  const getItemIngredients = (itemId) => {
    if (!itemId) return [];

    return Object.values(screening.ingredients || {})
      .filter(ing => ing.ingredient_item === itemId)
      .map(ing => {
        const ingKey = Object.keys(screening.ingredients).find(key => screening.ingredients[key] === ing);
        return {
          id: parseInt(ingKey),
          ...ing
        };
      });
  };

  const getSecondaryIngredients = (secondaryId) => {
    if (DEBUG_SECONDARY) console.log("Looking for secondary ingredients with secondaryId:", secondaryId);

    if (!secondaryId) return [];

    const result = Object.values(screening.ingredients || {})
      .filter(ing => ing.secondary_ingredient === secondaryId)
      .map(ing => {
        const ingKey = Object.keys(screening.ingredients).find(key => screening.ingredients[key] === ing);
        return {
          id: parseInt(ingKey),
          ...ing
        };
      });

    if (DEBUG_SECONDARY) console.log("Found secondary ingredients:", result);
    return result;
  };

  const addIngredientToItem = (itemId) => {
    // Generate a new key for the ingredient
    const ingredientKeys = Object.keys(screening.ingredients || {}).map(k => parseInt(k, 10));
    const newIngredientKey = ingredientKeys.length > 0 ? Math.max(...ingredientKeys) + 1 : 1;

    // Get the dish_id and item number from the item
    const itemIngredient = screening.ingredients[itemId];
    const dish_id = itemIngredient.dish_id;
    const dishId = itemIngredient.dish;
    const itemNumber = itemIngredient.item;

    const newIngredient = {
      dish: dishId,
      dish_id: dish_id,
      ingredient_id: '',
      ingredient_item: itemNumber, // Use the item number, not the ID
      private: false,
      description: ''
    };

    setScreening(prev => ({
      ...prev,
      ingredients: {
        ...prev.ingredients,
        [newIngredientKey]: newIngredient
      }
    }));
  };

  // Function to add a secondary ingredient to an item
  const addSecondaryToItem = (itemId) => {
    // Generate a new key for the secondary ingredient
    const ingredientKeys = Object.keys(screening.ingredients || {}).map(k => parseInt(k, 10));
    const newSecondaryKey = ingredientKeys.length > 0 ? Math.max(...ingredientKeys) + 1 : 1;

    // Get the dish_id and item number from the item
    const itemIngredient = screening.ingredients[itemId];
    const dish_id = itemIngredient.dish_id;
    const dishId = itemIngredient.dish;
    const itemNumber = itemIngredient.item;

    // Find the max secondary number and increment
    const maxSecondary = Math.max(0, ...Object.values(screening.ingredients || {})
      .filter(ing => ing.secondary)
      .map(ing => ing.secondary));

    const newSecondaryNumber = maxSecondary + 1;

    // Create a new secondary ingredient that's part of the item
    const newSecondary = {
      dish: dishId,
      dish_id: dish_id,
      ingredient_id: 400001, // Secondary ingredient ID
      ingredient_item: itemNumber, // This secondary is part of the item
      secondary: newSecondaryNumber, // Assign a new secondary number
      private: true, // Secondary ingredients are always private
      description: '' // Description for the secondary ingredients group
    };

    setScreening(prev => ({
      ...prev,
      ingredients: {
        ...prev.ingredients,
        [newSecondaryKey]: newSecondary
      }
    }));

    // Return the ID of the created secondary ingredient so we can add an ingredient to it
    return newSecondaryKey;
  };

  const addIngredientToSecondary = (secondaryId) => {
    // Generate a new key for the ingredient
    const ingredientKeys = Object.keys(screening.ingredients || {}).map(k => parseInt(k, 10));
    const newIngredientKey = ingredientKeys.length > 0 ? Math.max(...ingredientKeys) + 1 : 1;

    // Get the dish_id and secondary number from the secondary ingredient
    const secondaryIngredient = screening.ingredients[secondaryId];
    const dish_id = secondaryIngredient.dish_id;
    const dishId = secondaryIngredient.dish;
    const secondaryNumber = secondaryIngredient.secondary;

    const newIngredient = {
      dish: dishId,
      dish_id: dish_id,
      ingredient_id: '',
      secondary_ingredient: secondaryNumber, // Use the secondary number, not the ID
      private: false, // Default to false for child ingredients of secondary
      description: '' // Description will be derived from the secondary ingredient
    };

    setScreening(prev => ({
      ...prev,
      ingredients: {
        ...prev.ingredients,
        [newIngredientKey]: newIngredient
      }
    }));
  };

  const removeItem = (itemId) => {
    const itemIngredient = screening.ingredients[itemId];
    if (!itemIngredient || !itemIngredient.item) return;

    const itemNumber = itemIngredient.item;

    // Find all ingredients that belong to this item
    const ingredientsToRemove = Object.keys(screening.ingredients || {}).filter(key => {
      const ing = screening.ingredients[key];
      // Check if this is the item itself (key equals itemId) or a child ingredient
      // or a secondary ingredient that's part of this item or a child of such a secondary
      return key == itemId ||
        ing.ingredient_item === itemNumber ||
        (ing.secondary_ingredient && Object.values(screening.ingredients).some(si =>
          si.secondary === ing.secondary_ingredient && si.ingredient_item === itemNumber
        ));
    });

    // Remove the item and all its ingredients
    setScreening(prev => {
      const newIngredients = { ...prev.ingredients };
      ingredientsToRemove.forEach(key => delete newIngredients[key]);
      return {
        ...prev,
        ingredients: newIngredients
      };
    });
  };

  const removeSecondary = (secondaryId) => {
    const secondaryIngredient = screening.ingredients[secondaryId];
    if (!secondaryIngredient || !secondaryIngredient.secondary) return;

    const secondaryNumber = secondaryIngredient.secondary;

    // Find all ingredients that belong to this secondary ingredient
    const ingredientsToRemove = Object.keys(screening.ingredients || {}).filter(key => {
      const ing = screening.ingredients[key];
      // Check if this is the secondary ingredient itself (key equals secondaryId) or a child ingredient
      return key == secondaryId || ing.secondary_ingredient === secondaryNumber;
    });

    // Remove the secondary ingredient and all its ingredients
    setScreening(prev => {
      const newIngredients = { ...prev.ingredients };
      ingredientsToRemove.forEach(key => delete newIngredients[key]);
      return {
        ...prev,
        ingredients: newIngredients
      };
    });
  };

  // Add these state variables at the top with other states
  const [showCCModal, setShowCCModal] = useState(false);
  const [currentCCIngredientId, setCurrentCCIngredientId] = useState(null);
  const [highlightedCCSql, setHighlightedCCSql] = useState('');
  const [ccForm, setCCForm] = useState({
    allergen_id: '',
    reason: '',
    description: ''
  });
  const [addCCAttempted, setAddCCAttempted] = useState(false);

  // Function to open the CC modal
  const openCCModal = (ingredientId) => {
    setCurrentCCIngredientId(ingredientId);
    setCCForm({
      allergen_id: '',
      reason: '',
      description: ''
    });
    setAddCCAttempted(false);
    setShowCCModal(true);
  };

  // Function to close the CC modal
  const closeCCModal = () => {
    setShowCCModal(false);
    setCurrentCCIngredientId(null);
    setAddCCAttempted(false);
  };

  // Function to handle CC form input changes
  const handleCCFormChange = (e) => {
    const { name, value } = e.target;
    setCCForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to add a CC entry
  const addCCEntry = () => {
    // Set attempted flag to true
    setAddCCAttempted(true);

    // Validate that all required fields are filled
    if (!ccForm.allergen_id || !ccForm.reason || !ccForm.description) {
      return;
    }

    const ingredientId = currentCCIngredientId;
    if (!ingredientId) return;

    setScreening(prev => {
      const newIngredients = { ...prev.ingredients };
      const ingredient = { ...newIngredients[ingredientId] };

      // Initialize CC array if it doesn't exist
      if (!ingredient.cc) {
        ingredient.cc = [];
      }

      // Add new CC entry
      ingredient.cc = [
        ...ingredient.cc,
        { ...ccForm }
      ];

      // Update the ingredient with new CC entry
      newIngredients[ingredientId] = ingredient;

      return {
        ...prev,
        ingredients: newIngredients
      };
    });

    // Reset only the form for the next entry, but keep validation state
    setCCForm({
      allergen_id: '',
      reason: '',
      description: ''
    });

    // Don't reset the attempted flag so validation continues to show
    // This keeps the UI consistent after adding an entry
  };

  // Function to remove a CC entry
  const removeCCEntry = (ingredientId, index) => {
    setScreening(prev => {
      const newIngredients = { ...prev.ingredients };
      const ingredient = { ...newIngredients[ingredientId] };

      if (ingredient.cc) {
        // Remove the CC entry at the specified index
        ingredient.cc = ingredient.cc.filter((_, i) => i !== index);

        // If no more CC entries, remove the cc property
        if (ingredient.cc.length === 0) {
          delete ingredient.cc;
        }

        // Update the ingredient
        newIngredients[ingredientId] = ingredient;
      }

      return {
        ...prev,
        ingredients: newIngredients
      };
    });
  };

  // Highlight SQL for CC entries
  useEffect(() => {
    if (showIngredientSqlBox) {
      const raw = generateCCSql();
      const html = Prism.highlight(raw, Prism.languages.sql, 'sql');
      setHighlightedCCSql(html);
    }
  }, [showIngredientSqlBox, screening.ingredients]);

  // Add TODO tracker state
  const [todoItems, setTodoItems] = useState([]);
  const [currentTodoIndex, setCurrentTodoIndex] = useState(0);
  const [showTodoList, setShowTodoList] = useState(false);

  // Create refs for elements that need to be scrolled to
  const restaurantInfoRef = useRef(null);
  const menuNameRefs = useRef({});
  const dishNameRefs = useRef({});
  const ingredientRefs = useRef({});

  // Initialize refs when component mounts or when ingredients change
  useEffect(() => {
    // Keep ingredientRefs up to date with all current ingredients
    if (screening && screening.ingredients) {
      Object.keys(screening.ingredients).forEach(id => {
        // Initialize placeholder refs for all ingredients
        if (!ingredientRefs.current[id]) {
          ingredientRefs.current[id] = null;
        }
      });
    }
  }, [screening.ingredients]);

  // Function to add an item to the TODO list
  const addTodoItem = (id, type, label, menuId, dishId) => {
    // Check if item already exists
    const existingIndex = todoItems.findIndex(item => item.id === id);

    if (existingIndex !== -1) {
      // Remove it if it already exists (toggle behavior)
      const newItems = [...todoItems];
      newItems.splice(existingIndex, 1);
      setTodoItems(newItems);

      // Also update in screening data
      setScreening(prev => ({
        ...prev,
        todo_list: newItems
      }));

      if (newItems.length > 0 && currentTodoIndex >= newItems.length) {
        setCurrentTodoIndex(newItems.length - 1);
      }
    } else {
      // Add new item
      const newItem = {
        id,
        type,
        label,
        menuId,
        dishId,
        addedAt: Date.now()
      };

      const newItems = [...todoItems, newItem];
      setTodoItems(newItems);

      // Also update in screening data
      setScreening(prev => ({
        ...prev,
        todo_list: newItems
      }));
    }
  };

  // Function to remove a todo item
  const removeTodoItem = (index) => {
    const newItems = [...todoItems];
    newItems.splice(index, 1);
    setTodoItems(newItems);

    // Also update in screening data
    setScreening(prev => ({
      ...prev,
      todo_list: newItems
    }));

    if (newItems.length > 0 && currentTodoIndex >= newItems.length) {
      setCurrentTodoIndex(newItems.length - 1);
    }
  };

  // Function to navigate to a specific todo item
  const navigateToTodoItem = (index) => {
    if (index < 0 || index >= todoItems.length) return;

    setCurrentTodoIndex(index);
    const item = todoItems[index];

    // Calculate header height for offset (secondary header + main header)
    const headerOffset = 150; // Increased offset to ensure elements aren't hidden under header

    // Custom scroll function with offset
    const scrollWithOffset = (element) => {
      if (!element) {
        console.log('Element not found for scrolling');
        return;
      }

      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    };

    // Scroll to the appropriate element based on the type
    if (item.type === 'restaurant') {
      setTimeout(() => {
        scrollWithOffset(restaurantInfoRef.current);
      }, 100); // Small delay to ensure refs are updated
    } else if (item.type === 'menu') {
      // First go to the correct menu
      goToMenu(item.menuId);
      // Then scroll to the element after a short delay to allow state updates
      setTimeout(() => {
        scrollWithOffset(menuNameRefs.current[item.menuId]);
      }, 100);
    } else if (item.type === 'dish') {
      // First go to the correct menu and dish
      goToMenu(item.menuId);
      goToDish(item.dishId);
      // Then scroll to the element
      setTimeout(() => {
        scrollWithOffset(dishNameRefs.current[item.dishId]);
      }, 100);
    } else if (item.type === 'ingredient') {
      // First go to the correct menu and dish
      goToMenu(item.menuId);
      goToDish(item.dishId);

      // Then scroll to the element with a delay to ensure navigation completes
      setTimeout(() => {
        const ingredientElement = ingredientRefs.current[item.id];
        if (ingredientElement) {
          scrollWithOffset(ingredientElement);
        } else {
          console.log('Ingredient ref not found:', item.id);
        }
      }, 300); // Slightly longer delay for ingredients to ensure dish navigation completes
    }
  };

  // Helper function to check if an item is in the todo list
  const isInTodoList = (id) => {
    return todoItems.some(item => item.id === id);
  };

  // Create a reusable component for clickable labels
  const ClickableLabel = ({ id, type, children, menuId, dishId }) => {
    const isInList = isInTodoList(id);

    return (
      <span
        className="label-button"
        onClick={() => addTodoItem(id, type, children, menuId, dishId)}
      >
        {children}
        {isInList && <span className="label-button-indicator" />}
      </span>
    );
  };

  // Add state variable for tracking screening status
  const [screeningStatus, setScreeningStatus] = useState(false);

  // Effect to update screening status when todo list or validation changes
  useEffect(() => {
    // Check if the screening is valid
    const isValid = validateBeforeSave(false); // Pass false to prevent showing alerts

    // Set status to true only if todo list is empty AND screening is valid
    const newStatus = todoItems.length === 0 && isValid;

    // Update the status state
    setScreeningStatus(newStatus);

    // Also update the status in the screening data
    setScreening(prev => ({
      ...prev,
      status: newStatus
    }));
  }, [todoItems, screening.restaurant, screening.menus, screening.dishes, screening.ingredients]);

  // Add state for shared items functionality
  const [sharedItems, setSharedItems] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareModalData, setShareModalData] = useState(null);
  const [shareTitle, setShareTitle] = useState('');
  
  // Add state for shared items dropdown in items
  const [showSharedDropdown, setShowSharedDropdown] = useState({});
  const dropdownRef = useRef({});

  // Initialize shared items from screening data
  useEffect(() => {
    if (initialScreening?.json?.shared_items) {
      setSharedItems(initialScreening.json.shared_items);
    }
  }, [initialScreening]);

  // Functions for shared items functionality
  const openShareModal = (ingredient) => {
    setShareModalData(ingredient);
    setShareTitle('');
    setShowShareModal(true);
  };

  const closeShareModal = () => {
    setShowShareModal(false);
    setShareModalData(null);
    setShareTitle('');
  };

  const handleShareItem = () => {
    if (!shareModalData) return;

    const isItem = shareModalData.ingredient_id == 400000;
    const isSecondary = shareModalData.ingredient_id == 400001;

    let title = shareTitle;
    if (isSecondary && !title) {
      title = shareModalData.description || 'Secondary Ingredient';
    }

    if (!title) return;

    // Get all child ingredients for this item/secondary
    let childIngredients = [];
    if (isItem) {
      childIngredients = getItemIngredients(shareModalData.item);
    } else if (isSecondary) {
      // For secondary ingredients, get their child ingredients
      // If this secondary is inside an item, we still want to share it as an independent secondary
      childIngredients = getSecondaryIngredients(shareModalData.secondary);
    }

    // Create a clean version of the main ingredient without item relationships
    // This ensures that when we share a secondary ingredient that's inside an item,
    // it becomes an independent secondary ingredient
    const cleanMainIngredient = {
      ...shareModalData,
      // Remove item-related properties to make it independent
      ingredient_item: undefined,
      item: undefined
    };

    const sharedItem = {
      id: Date.now(), // Simple ID generation
      title,
      type: isItem ? 'item' : 'secondary',
      mainIngredient: cleanMainIngredient,
      childIngredients,
      createdAt: new Date().toISOString()
    };

    const newSharedItems = [...sharedItems, sharedItem];
    setSharedItems(newSharedItems);

    // Update screening data
    setScreening(prev => ({
      ...prev,
      shared_items: newSharedItems
    }));

    closeShareModal();
  };

  const addSharedItemToDish = (sharedItem) => {
    if (!currentDishId) return;

    // Add the main ingredient first
    const mainIngredientId = Date.now();
    const newMainIngredient = {
      ...sharedItem.mainIngredient,
      id: mainIngredientId,
      dish: currentDishId,
      dish_id: dishIdsByDishKey[currentDishId] || ''
    };

    // If it's an item, assign a new item number
    if (sharedItem.type === 'item') {
      const maxItem = Math.max(0, ...Object.values(screening.ingredients || {})
        .filter(ing => ing.item)
        .map(ing => ing.item));
      newMainIngredient.item = maxItem + 1;
    }

    // If it's a secondary, assign a new secondary number
    if (sharedItem.type === 'secondary') {
      const maxSecondary = Math.max(0, ...Object.values(screening.ingredients || {})
        .filter(ing => ing.secondary)
        .map(ing => ing.secondary));
      newMainIngredient.secondary = maxSecondary + 1;
    }

    // Add child ingredients
    const newIngredients = { ...screening.ingredients };
    newIngredients[mainIngredientId] = newMainIngredient;

    sharedItem.childIngredients.forEach((childIngredient, index) => {
      const childId = Date.now() + index + 1;
      const newChildIngredient = {
        ...childIngredient,
        id: childId,
        dish: currentDishId,
        dish_id: dishIdsByDishKey[currentDishId] || '',
        // Clean any item relationships for child ingredients
        ingredient_item: undefined,
        item: undefined
      };

      if (sharedItem.type === 'item') {
        newChildIngredient.ingredient_item = newMainIngredient.item;
      } else if (sharedItem.type === 'secondary') {
        newChildIngredient.secondary_ingredient = newMainIngredient.secondary;
      }

      newIngredients[childId] = newChildIngredient;
    });

    setScreening(prev => ({
      ...prev,
      ingredients: newIngredients
    }));

    setIsScreeningDirty(true);
  };

  const removeSharedItem = (sharedItemId) => {
    const newSharedItems = sharedItems.filter(item => item.id !== sharedItemId);
    setSharedItems(newSharedItems);

    // Update screening data
    setScreening(prev => ({
      ...prev,
      shared_items: newSharedItems
    }));

    setIsScreeningDirty(true);
  };

  // Functions for shared items dropdown in items
  const toggleSharedDropdown = (itemId) => {
    setShowSharedDropdown(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const addSharedSecondaryToItem = (sharedItem, itemId) => {
    if (!currentDishId || sharedItem.type !== 'secondary') return;

    // Add the shared secondary ingredient to the item
    const mainIngredientId = Date.now();
    const newMainIngredient = {
      ...sharedItem.mainIngredient,
      id: mainIngredientId,
      dish: currentDishId,
      dish_id: dishIdsByDishKey[currentDishId] || '',
      ingredient_item: itemId // Link to the item
    };

    // Assign a new secondary number
    const maxSecondary = Math.max(0, ...Object.values(screening.ingredients || {})
      .filter(ing => ing.secondary)
      .map(ing => ing.secondary));
    newMainIngredient.secondary = maxSecondary + 1;

    // Add child ingredients
    const newIngredients = { ...screening.ingredients };
    newIngredients[mainIngredientId] = newMainIngredient;

    sharedItem.childIngredients.forEach((childIngredient, index) => {
      const childId = Date.now() + index + 1;
      const newChildIngredient = {
        ...childIngredient,
        id: childId,
        dish: currentDishId,
        dish_id: dishIdsByDishKey[currentDishId] || '',
        secondary_ingredient: newMainIngredient.secondary,
        // Clean any item relationships for child ingredients
        ingredient_item: undefined,
        item: undefined
      };

      newIngredients[childId] = newChildIngredient;
    });

    setScreening(prev => ({
      ...prev,
      ingredients: newIngredients
    }));

    setIsScreeningDirty(true);
    
    // Close the dropdown
    setShowSharedDropdown(prev => ({
      ...prev,
      [itemId]: false
    }));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(showSharedDropdown).forEach(itemId => {
        if (showSharedDropdown[itemId] && dropdownRef.current[itemId] && 
            !dropdownRef.current[itemId].contains(event.target)) {
          setShowSharedDropdown(prev => ({
            ...prev,
            [itemId]: false
          }));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSharedDropdown]);

  return (
    <div className="screening-page">
      {/* Secondary Header */}
      <div className={`secondary-header-container${showAllSql ? ' no-border' : ''}`}>
        <div className="secondary-header">
          <div className="secondary-header-content">
            <div className="left-actions">
              <button className="return-button" onClick={() => {
                if (isScreeningDirty) {
                  const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave without saving?');
                  if (!confirmLeave) return;
                  setIsScreeningDirty(false);
                }
                navigate('/dashboard');
              }}>
                ←&nbsp;&nbsp;&nbsp;Dashboard
              </button>

              {/* Always render the separator and navigator but with conditional class for animation */}
              <div className={`header-separator ${todoItems.length > 0 ? 'visible' : 'hidden'}`}></div>
              <div className={`todo-navigator ${todoItems.length > 0 ? 'visible' : 'hidden'}`}>
                <button
                  className="todo-nav-arrow"
                  onClick={() => navigateToTodoItem(currentTodoIndex - 1)}
                  disabled={currentTodoIndex <= 0}
                >
                  <img src={Left} alt="Left" className="todo-nav-arrow-icon" />
                </button>
                <span className="todo-count">
                  {todoItems.length > 0 ? `${currentTodoIndex + 1}` : '0/0'}
                </span>
                <button
                  className="todo-nav-arrow"
                  onClick={() => navigateToTodoItem(currentTodoIndex + 1)}
                  disabled={currentTodoIndex >= todoItems.length - 1}
                >
                  <img src={Right} alt="Right" className="todo-nav-arrow-icon" />
                </button>
              </div>
            </div>
            <div className="right-actions">
              <div className="status-indicator" title={screeningStatus ? "Ready to submit" : "Missing required fields or todo items"}>
                <div className={`status-dot ${screeningStatus ? 'status-complete' : 'status-incomplete'}`}></div>
              </div>
              <button className="action-button" onClick={() => setShowAllSql(v => !v)}>
                View
              </button>
              <button
                className="action-button"
                disabled={initialScreening ? !isScreeningDirty : false || uploadProgress.isUploading}
                onClick={handleSave}
              >
                {uploadProgress.isUploading ? 'Uploading...' : (initialScreening ? 'Save' : 'Create')}
              </button>
            </div>
          </div>
          {uploadProgress.isUploading && (
            <div className="upload-progress-bar">
              <div className="upload-progress-message">{uploadProgress.message}</div>
              <div className="upload-progress-spinner"></div>
            </div>
          )}
        </div>
        <div className={`all-sql-row${showAllSql ? ' expanded' : ''}`}>
          <div className="all-sql-scroll">
            <div className="code-box-secondary-header">
              <div className="code-box-header">
                <span className="code-box-label">sql</span>
                <div className="code-box-actions">
                  <button className="copy-button" onClick={() => navigator.clipboard.writeText(generateSqlQuery())}>
                    Copy
                  </button>
                </div>
              </div>
              <pre className="sql-query language-sql" dangerouslySetInnerHTML={{ __html: highlightedSql }} />
            </div>
            <div className="code-box-secondary-header">
              <div className="code-box-header">
                <span className="code-box-label">sql</span>
                <div className="code-box-actions">
                  <button className="copy-button" onClick={() => navigator.clipboard.writeText(generateMenuSql())}>
                    Copy
                  </button>
                </div>
              </div>
              <pre className="sql-query language-sql" dangerouslySetInnerHTML={{ __html: highlightedMenuSql }} />
            </div>
            <div className="code-box-secondary-header">
              <div className="code-box-header">
                <span className="code-box-label">sql</span>
                <div className="code-box-actions">
                  <button className="copy-button" onClick={() => navigator.clipboard.writeText(generateDishSql())}>
                    Copy
                  </button>
                </div>
              </div>
              <pre className="sql-query language-sql" dangerouslySetInnerHTML={{ __html: highlightedDishSql }} />
            </div>
            <div className="code-box-secondary-header">
              <div className="code-box-header">
                <span className="code-box-label">sql</span>
                <div className="code-box-actions">
                  <button className="copy-button" onClick={() => navigator.clipboard.writeText(generateIngredientSql())}>
                    Copy
                  </button>
                </div>
              </div>
              <pre className="sql-query language-sql" dangerouslySetInnerHTML={{ __html: highlightedIngredientSql }} />
            </div>
            <div className="code-box-secondary-header">
              <div className="code-box-header">
                <span className="code-box-label">sql</span>
                <div className="code-box-actions">
                  <button className="copy-button" onClick={() => navigator.clipboard.writeText(generateCCSql())}>
                    Copy
                  </button>
                </div>
              </div>
              <pre className="sql-query language-sql" dangerouslySetInnerHTML={{ __html: highlightedCCSql }} />
            </div>
          </div>
        </div>
      </div>

      {/* Shared Items Bar */}
      {sharedItems.length > 0 && (
        <div className="shared-items-bar">
          <div className="shared-items-container">
            <div className="shared-items-icon">
              <img src={SharedItemsIcon} alt="Shared Items" />
            </div>
            <div className="shared-items-list">
              {sharedItems.map((sharedItem) => (
                <div key={sharedItem.id} className="shared-item-container">
                  <button
                    className="shared-item-button"
                    onClick={() => addSharedItemToDish(sharedItem)}
                    title={`Add ${sharedItem.title} to current dish`}
                  >
                    {sharedItem.title}
                  </button>
                  <button
                    className="shared-item-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSharedItem(sharedItem.id);
                    }}
                    title={`Remove ${sharedItem.title} from shared items`}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={`screening-page-content${showAllSql ? ' blur' : ''}`}>
        <div className="section-header">
          <h2 ref={restaurantInfoRef}>
            <ClickableLabel
              id="restaurant-info"
              type="restaurant"
            >
              Restaurant Information
            </ClickableLabel>
          </h2>
        </div>
        <div className="section">
          <div className="section-content" id={showSqlBox ? 'code-box-out' : ''}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={restaurantInfo.name}
                  onChange={handleInputChange}
                  maxLength={255}
                  className={formErrors.name ? 'input-error' : ''}
                />
                {formErrors.name && formErrors.name !== 'Name must be less than 255 characters' && <div className="error-message">{formErrors.name}</div>}
                <div className="field-constraint">VARCHAR(255) NOT NULL</div>
              </div>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={restaurantInfo.address}
                  onChange={handleInputChange}
                  maxLength={1000}
                  className={formErrors.address ? 'input-error' : ''}
                />
                {formErrors.address && <div className="error-message">{formErrors.address}</div>}
                <div className="field-constraint">TEXT NOT NULL</div>
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={restaurantInfo.phone}
                  onChange={handleInputChange}
                  maxLength={20}
                  className={formErrors.phone ? 'input-error' : ''}
                />
                {formErrors.phone && formErrors.phone !== 'Phone must be less than 20 characters' && <div className="error-message">{formErrors.phone}</div>}
                <div className="field-constraint">VARCHAR(20) NOT NULL</div>
              </div>
            </div>
            {showSqlBox && (
              <div className="code-box-container">
                <div className="code-box">
                  <div className="code-box-header">
                    <span className="code-box-label">sql</span>
                    <div className="code-box-actions">
                      <button className="copy-button" onClick={() => navigator.clipboard.writeText(generateSqlQuery())}>
                        Copy
                      </button>
                      <button className="edit-button">
                        Edit
                      </button>
                    </div>
                  </div>
                  <pre className="sql-query language-sql" dangerouslySetInnerHTML={{ __html: highlightedSql }} />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="section-actions">
          <button
            className="sql-button"
            onClick={toggleSqlBox}
          >
            {showSqlBox ? 'Hide SQL' : 'Show SQL'}
          </button>
        </div>

        {/* Section separator */}
        <div className="section-separator"></div>
        {/* Section 2: Menu with pagination */}
        <div className="section-header">
          <h2>Menus</h2>
        </div>
        <div className="section">
          <div className="section-content" id={showMenuSqlBox ? 'code-box-out' : ''}>
            <div className="form-row">
              {/* Single Restaurant ID input for all menus */}
              <div className="form-group">
                <label>Restaurant ID</label>
                <input
                  type="number"
                  name="restaurant_id"
                  value={menuRestaurantId}
                  onChange={e => {
                    const value = e.target.value;
                    setMenuRestaurantId(value);

                    // Also update the current menu
                    if (currentMenuId) {
                      updateMenu(currentMenuId, { restaurant_id: value });
                    }

                    // Validate immediately
                    if (!value) {
                      setMenuRestaurantIdError('Restaurant ID is required');
                    } else if (!/^\d+$/.test(value)) {
                      setMenuRestaurantIdError('Must be an integer');
                    } else {
                      setMenuRestaurantIdError('');
                    }
                  }}
                  min={1}
                  required
                  className={menuRestaurantIdError ? 'input-error' : ''}
                />
                {menuRestaurantIdError && <div className="error-message">{menuRestaurantIdError}</div>}
                <div className="field-constraint">INT NOT NULL</div>
              </div>

              {/* Display only the current menu */}
              {currentMenuId && (
                <div className="menu-entry">
                  <div className="form-group" ref={el => {
                    if (currentMenuId !== null) menuNameRefs.current[currentMenuId] = el;
                  }}>
                    <label>
                      <ClickableLabel
                        id={`menu-name-${currentMenuId}`}
                        type="menu"
                        menuId={currentMenuId}
                      >
                        Name
                      </ClickableLabel>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={getCurrentMenu().name || ''}
                      onChange={e => handleMenuInputChange(currentMenuId, e)}
                      maxLength={255}
                      required
                      className={!getCurrentMenu().name ? 'input-error' : ''}
                    />
                    {!getCurrentMenu().name && <div className="error-message">Name is required</div>}
                    <div className="field-constraint">VARCHAR(255) NOT NULL</div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={getCurrentMenu().description || ''}
                      onChange={e => handleMenuInputChange(currentMenuId, e)}
                      className={dishErrorsByMenu[currentMenuId]?.description ? 'input-error' : ''}
                    />
                    {dishErrorsByMenu[currentMenuId]?.description && <div className="error-message">{dishErrorsByMenu[currentMenuId].description}</div>}
                    <div className="field-constraint">TEXT</div>
                  </div>
                  <div className="form-group">
                    <label>Active</label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <label className="switch">
                        <input
                          type="checkbox"
                          name="active"
                          checked={getCurrentMenu().active || false}
                          onChange={e => handleMenuInputChange(currentMenuId, e)}
                        />
                        <span className="slider"></span>
                      </label>
                      <span className="toggle-label">{getCurrentMenu().active ? 'Yes' : 'No'}</span>
                    </div>
                    {dishErrorsByMenu[currentMenuId]?.active && <div className="error-message">{dishErrorsByMenu[currentMenuId].active}</div>}
                    <div className="field-constraint">BOOLEAN NOT NULL</div>
                  </div>
                  <div className="form-group">
                    <label>PDF URL</label>
                    <input
                      type="text"
                      name="pdf"
                      value={getCurrentMenu().pdf || ''}
                      onChange={e => handleMenuInputChange(currentMenuId, e)}
                      maxLength={512}
                      className={dishErrorsByMenu[currentMenuId]?.pdf ? 'input-error' : ''}
                    />
                    {dishErrorsByMenu[currentMenuId]?.pdf && <div className="error-message">{dishErrorsByDish[currentMenuId].pdf}</div>}
                    <div className="field-constraint">VARCHAR(512)</div>
                  </div>
                </div>
              )}
            </div>

            {showMenuSqlBox && (
              <div className="code-box-container">
                <div className="code-box">
                  <div className="code-box-header">
                    <span className="code-box-label">sql</span>
                    <div className="code-box-actions">
                      <button className="copy-button" onClick={() => navigator.clipboard.writeText(generateMenuSql())}>
                        Copy
                      </button>
                      <button className="edit-button">
                        Edit
                      </button>
                    </div>
                  </div>
                  <pre className="sql-query language-sql" dangerouslySetInnerHTML={{ __html: highlightedMenuSql }} />
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Menu section actions */}
        <div className="section-actions">
          <button className="sql-button" type="button" onClick={addNewMenu}>+ Add Menu</button>
          <button className="sql-button" type="button" onClick={toggleMenuSqlBox} style={{ marginLeft: '1rem' }}>
            {showMenuSqlBox ? 'Hide SQL' : 'Show SQL'}
          </button>
        </div>
        {/* Menu pagination */}
        <div className="pagination-controls">
          <button
            className="pagination-arrow"
            onClick={prevMenu}
            disabled={!currentMenuId || Object.keys(screening.menus || {}).length <= 1}
            aria-label="Previous menu"
          >
            &larr;
          </button>
          <div className="pagination-dots">
            {getVisiblePaginationItems(
              Object.keys(screening.menus || {}),
              currentMenuId?.toString()
            ).map((menuId) => (
              <button
                key={menuId}
                className={`pagination-dot ${parseInt(menuId) === currentMenuId ? 'active' : ''}`}
                onClick={() => goToMenu(parseInt(menuId))}
                aria-label={`Go to menu ${menuId}`}
                type="button"
                style={{ position: 'relative' }}
              >
                <span className="pagination-tooltip">
                  {(screening.menus[menuId].name && screening.menus[menuId].name.length > 20)
                    ? screening.menus[menuId].name.slice(0, 20) + '...'
                    : (screening.menus[menuId].name || `Menu ${menuId}`)}
                </span>
              </button>
            ))}
          </div>
          <button
            className="pagination-arrow"
            onClick={nextMenu}
            disabled={!currentMenuId || Object.keys(screening.menus || {}).length <= 1}
            aria-label="Next menu"
          >
            &rarr;
          </button>
        </div>

        {/* Section separator */}
        <div className="section-separator"></div>

        {/* Section 3: Dish with pagination */}
        <div className="section-header">
          <h2>Dishes for {getCurrentMenu().name || `Menu ${currentMenuId}`}</h2>
        </div>
        <div className="section">
          <div className="section-content" id={showDishSqlBox ? 'code-box-out' : ''}>
            <div className="form-row">
              {/* Single Menu ID input for all dishes */}
              <div className="form-group">
                <label>Menu ID</label>
                <input
                  type="number"
                  name="menu_id"
                  value={getCurrentDish().menu_id || menuIdsByMenuIndex[currentMenuId] || ''}
                  onChange={e => {
                    const value = e.target.value;

                    // Update the menuIdsByMenuIndex
                    setMenuIdsByMenuIndex({
                      ...menuIdsByMenuIndex,
                      [currentMenuId]: value
                    });

                    // Update menu_id for ALL dishes in this menu
                    Object.keys(screening.dishes || {}).forEach(dishKey => {
                      const dish = screening.dishes[dishKey];
                      if (dish.menu === currentMenuId) {
                        updateDish(dishKey, { menu_id: value });
                      }
                    });

                    // Validate immediately
                    if (!value) {
                      setMenuIdForDishesError('Menu ID is required');
                    } else if (!/^\d+$/.test(value)) {
                      setMenuIdForDishesError('Must be an integer');
                    } else {
                      setMenuIdForDishesError('');
                    }
                  }}
                  min={1}
                  required
                  className={menuIdForDishesError ? 'input-error' : ''}
                />
                {menuIdForDishesError && <div className="error-message">{menuIdForDishesError}</div>}
                <div className="field-constraint">INT NOT NULL</div>
              </div>

              {/* Current dish (paginated) */}
              {currentDishId && (
                <div className="menu-entry">
                  <div className="form-group" ref={el => {
                    if (currentDishId !== null) dishNameRefs.current[currentDishId] = el;
                  }}>
                    <label>
                      <ClickableLabel
                        id={`dish-name-${currentDishId}`}
                        type="dish"
                        menuId={currentMenuId}
                        dishId={currentDishId}
                      >
                        Name
                      </ClickableLabel>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={getCurrentDish().name || ''}
                      onChange={e => handleDishInputChange(currentDishId, e)}
                      maxLength={255}
                      required
                      className={!getCurrentDish().name ? 'input-error' : ''}
                    />
                    {!getCurrentDish().name && <div className="error-message">Name is required</div>}
                    <div className="field-constraint">VARCHAR(255) NOT NULL</div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={getCurrentDish().description || ''}
                      onChange={e => handleDishInputChange(currentDishId, e)}
                      className={dishErrorsByMenu[currentMenuId]?.[currentDishId]?.description ? 'input-error' : ''}
                    />
                    {dishErrorsByMenu[currentMenuId]?.[currentDishId]?.description && <div className="error-message">{dishErrorsByMenu[currentMenuId][currentDishId].description}</div>}
                    <div className="field-constraint">TEXT</div>
                  </div>
                  <div className="form-group">
                    <label>Price</label>
                    <input
                      type="text"
                      name="price"
                      value={getCurrentDish().price || ''}
                      onChange={e => handleDishInputChange(currentDishId, e)}
                      onKeyPress={e => {
                        // Allow only digits and one decimal point with max 2 decimal places
                        const keyCode = e.charCode;
                        const currentValue = e.target.value;

                        // Allow digits (0-9)
                        if (keyCode >= 48 && keyCode <= 57) {
                          // Check if we're trying to add a digit after the decimal point
                          if (currentValue.includes('.')) {
                            const parts = currentValue.split('.');
                            // If we already have 2 decimal places, prevent adding more
                            if (parts[1] && parts[1].length >= 2) {
                              e.preventDefault();
                              return;
                            }
                          }
                          return;
                        }

                        // Allow decimal point (.) only if it doesn't already exist in the value
                        if (keyCode === 46 && !currentValue.includes('.')) {
                          return;
                        }

                        // Block all other characters
                        e.preventDefault();
                      }}
                      placeholder="0.00"
                      required
                      className={!getCurrentDish().price ? 'input-error' : ''}
                    />
                    {!getCurrentDish().price && <div className="error-message">Price is required</div>}
                    <div className="field-constraint">DECIMAL(10,2) NOT NULL</div>
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      name="category"
                      value={getCurrentDish().category || ''}
                      onChange={e => handleDishInputChange(currentDishId, e)}
                      maxLength={100}
                      className={dishErrorsByMenu[currentMenuId]?.[currentDishId]?.category ? 'input-error' : ''}
                    />
                    {dishErrorsByMenu[currentMenuId]?.[currentDishId]?.category && <div className="error-message">{dishErrorsByMenu[currentMenuId][currentDishId].category}</div>}
                    <div className="field-constraint">VARCHAR(100)</div>
                  </div>
                  <div className="form-group">
                    <label>Active</label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <label className="switch">
                        <input
                          type="checkbox"
                          name="active"
                          checked={getCurrentDish().active || false}
                          onChange={e => handleDishInputChange(currentDishId, e)}
                        />
                        <span className="slider"></span>
                      </label>
                      <span className="toggle-label">{getCurrentDish().active ? 'Yes' : 'No'}</span>
                    </div>
                    {dishErrorsByMenu[currentMenuId]?.[currentDishId]?.active && <div className="error-message">{dishErrorsByMenu[currentMenuId][currentDishId].active}</div>}
                    <div className="field-constraint">BOOLEAN NOT NULL</div>
                  </div>
                </div>
              )}
            </div>

            {/* Dish SQL Box */}
            {showDishSqlBox && (
              <div className="code-box-container">
                <div className="code-box">
                  <div className="code-box-header">
                    <span className="code-box-label">sql</span>
                    <div className="code-box-actions">
                      <button className="copy-button" onClick={() => navigator.clipboard.writeText(generateDishSql())}>
                        Copy
                      </button>
                      <button className="edit-button">
                        Edit
                      </button>
                    </div>
                  </div>
                  <pre className="sql-query language-sql" dangerouslySetInnerHTML={{ __html: highlightedDishSql }} />
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Dish section actions */}
        <div className="section-actions">
          <button className="sql-button" type="button" onClick={() => currentMenuId && addNewDish(currentMenuId)}>+ Add Dish</button>
          <button className="sql-button" type="button" onClick={toggleDishSqlBox} style={{ marginLeft: '1rem' }}>
            {showDishSqlBox ? 'Hide SQL' : 'Show SQL'}
          </button>
        </div>
        <div className="pagination-controls">
          <button
            className="pagination-arrow"
            onClick={prevDish}
            disabled={!currentDishId || getCurrentMenuDishes().length <= 1}
            aria-label="Previous dish"
          >
            &larr;
          </button>
          <div className="pagination-dots">
            {getVisiblePaginationItems(
              getCurrentMenuDishes(),
              currentDishId
            ).map((dish) => (
              <button
                key={dish.id}
                className={`pagination-dot ${dish.id === currentDishId ? 'active' : ''}`}
                onClick={() => goToDish(dish.id)}
                aria-label={`Go to dish ${dish.id}`}
                type="button"
                style={{ position: 'relative' }}
              >
                <span className="pagination-tooltip">
                  {(dish.name && dish.name.length > 20)
                    ? dish.name.slice(0, 20) + '...'
                    : (dish.name || `Dish ${dish.id}`)}
                </span>
              </button>
            ))}
          </div>
          <button
            className="pagination-arrow"
            onClick={nextDish}
            disabled={!currentDishId || getCurrentMenuDishes().length <= 1}
            aria-label="Next dish"
          >
            &rarr;
          </button>
        </div>
        {/* Ingredients for current dish */}
        <div className="ingredients-section">
          <div className="section-header">
            <h3>Ingredients for {getCurrentDish().name || `Dish ${currentDishId}`}</h3>
          </div>
          <div className="section">
            <div className="section-content" id={showIngredientSqlBox ? 'code-box-out' : ''}>
              <div className="form-row">
                {/* Dish ID input for all ingredients of this dish */}
                <div className="form-group">
                  <label>Dish ID</label>
                  <input
                    type="number"
                    name="dish_id_for_ingredients"
                    value={dishIdsByDishKey[currentDishId] || ''}
                    onChange={e => {
                      const value = e.target.value;

                      // Update the dishIdsByDishKey mapping
                      setDishIdsByDishKey({
                        ...dishIdsByDishKey,
                        [currentDishId]: value
                      });

                      // Update dish_id for ALL ingredients of this dish
                      Object.keys(screening.ingredients || {}).forEach(ingredientKey => {
                        const ingredient = screening.ingredients[ingredientKey];
                        if (ingredient.dish === currentDishId) {
                          updateIngredient(ingredientKey, { dish_id: value });
                        }
                      });
                    }}
                    min={1}
                    required
                  />
                  <div className="field-constraint">INT NOT NULL</div>
                </div>

                {/* Current dish's ingredients */}
                {getCurrentDishIngredients().map((ingredient, idx) => (
                  <React.Fragment key={ingredient.id}>
                    <div
                      className="menu-entry ingredient-entry"
                      ref={el => {
                        if (ingredient.id) ingredientRefs.current[ingredient.id] = el;
                      }}
                    >
                      <div className="form-group">
                        <div className="ingredient-header">
                          <label>
                            <ClickableLabel
                              id={ingredient.id}
                              type="ingredient"
                              menuId={currentMenuId}
                              dishId={currentDishId}
                            >
                              {isItem(ingredient) ? 'Item' : isSecondary(ingredient) ? 'Secondary Ingredient' : 'Ingredient'}
                            </ClickableLabel>
                          </label>
                          {(isItem(ingredient) || isSecondary(ingredient)) && (
                            <button
                              type="button"
                              className="share-button"
                              onClick={() => openShareModal(ingredient)}
                              title={`Share this ${isItem(ingredient) ? 'item' : 'secondary ingredient'}`}
                            >
                              <img src={SharedItemsIcon} alt="Share" />
                            </button>
                          )}
                        </div>
                        <IngredientSelector
                          selectedId={ingredient.ingredient_id || ''}
                          onChange={(e) => {
                            handleIngredientInputChange(ingredient.id, e);
                            // If the ingredient is being set as an item (400000), add item field
                            if (e.target.value == 400000 && !ingredient.item) {
                              // Find the max item number and increment
                              const maxItem = Math.max(0, ...Object.values(screening.ingredients || {})
                                .filter(ing => ing.item)
                                .map(ing => ing.item));

                              updateIngredient(ingredient.id, {
                                item: maxItem + 1
                              });
                            }
                            // If the ingredient is being set as a secondary ingredient (400001), add secondary field
                            else if (e.target.value == 400001 && !ingredient.secondary) {
                              // Find the max secondary number and increment
                              const maxSecondary = Math.max(0, ...Object.values(screening.ingredients || {})
                                .filter(ing => ing.secondary)
                                .map(ing => ing.secondary));

                              updateIngredient(ingredient.id, {
                                secondary: maxSecondary + 1,
                                private: true // Secondary ingredients are always private
                              });
                            }
                            // If changing from item to regular ingredient, remove item field and all its children
                            else if (ingredient.item && e.target.value != 400000) {
                              const itemIngredients = Object.keys(screening.ingredients || {}).filter(key =>
                                screening.ingredients[key].ingredient_item === ingredient.item
                              );

                              // Remove all child ingredients
                              const newIngredients = { ...screening.ingredients };
                              itemIngredients.forEach(key => delete newIngredients[key]);

                              // Update the screening with ingredients removed and item field removed
                              setScreening(prev => ({
                                ...prev,
                                ingredients: newIngredients
                              }));

                              // Remove the item field
                              updateIngredient(ingredient.id, {
                                item: undefined
                              });
                            }
                            // If changing from secondary to regular ingredient, remove secondary field and all its children
                            else if (ingredient.secondary && e.target.value != 400001) {
                              const secondaryIngredients = Object.keys(screening.ingredients || {}).filter(key =>
                                screening.ingredients[key].secondary_ingredient === ingredient.secondary
                              );

                              // Remove all child ingredients
                              const newIngredients = { ...screening.ingredients };
                              secondaryIngredients.forEach(key => delete newIngredients[key]);

                              // Update the screening with ingredients removed and secondary field removed
                              setScreening(prev => ({
                                ...prev,
                                ingredients: newIngredients
                              }));

                              // Remove the secondary field
                              updateIngredient(ingredient.id, {
                                secondary: undefined
                              });
                            }
                          }}
                          hasError={!ingredient.ingredient_id}
                          ingredientList={ingredientList}
                          disabled={isItem(ingredient) || isSecondary(ingredient)}
                          isPartOfItem={!!ingredient.ingredient_item}
                          isPartOfSecondary={!!ingredient.secondary_ingredient}
                          isSecondaryIngredient={isSecondary(ingredient)}
                        />
                        {!ingredient.ingredient_id && (
                          <div className="error-message">
                            Ingredient ID is required
                          </div>
                        )}
                        <div className="field-constraint">INT NOT NULL</div>
                      </div>

                      {/* Private toggle for ingredients */}
                      {!ingredient.ingredient_item && !isItem(ingredient) && ingredient.ingredient_id !== 400001 && (
                        <div className="form-group">
                          <label>Private</label>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <label className="switch">
                              <input
                                type="checkbox"
                                name="private"
                                checked={ingredient.private || false}
                                onChange={e => handleIngredientInputChange(ingredient.id, e)}
                              />
                              <span className="slider"></span>
                            </label>
                            <span className="toggle-label">{ingredient.private ? 'Yes' : 'No'}</span>
                          </div>
                          <div className="field-constraint">BOOLEAN NOT NULL</div>
                        </div>
                      )}

                      {/* Don't show description field for ingredients that are part of secondary ingredients */}
                      {!ingredient.secondary_ingredient && (
                        <div className="form-group">
                          <label>Description</label>
                          <textarea
                            name="description"
                            value={ingredient.description || ''}
                            onChange={e => handleIngredientInputChange(ingredient.id, e)}
                            className={ingredientErrorsByDish[`${currentMenuId}-${currentDishId}`]?.[idx]?.description ? 'input-error' : ''}
                          />
                          {ingredientErrorsByDish[`${currentMenuId}-${currentDishId}`]?.[idx]?.description && (
                            <div className="error-message">
                              {ingredientErrorsByDish[`${currentMenuId}-${currentDishId}`][idx].description}
                            </div>
                          )}
                          <div className="field-constraint">TEXT</div>
                        </div>
                      )}

                      {/* Display item's ingredients if this is an item */}
                      {isItem(ingredient) && ingredient.item && (
                        <div className="item-ingredients">
                          {getItemIngredients(ingredient.item).map((itemIngredient) => (
                            <div className="menu-entry ingredient-entry item-child" key={itemIngredient.id}>
                              {isSecondary(itemIngredient) ? (
                                // This is a secondary ingredient within an item
                                <div className="secondary-in-item">
                                  <div className="form-group">
                                    <div className="ingredient-header">
                                      <label>Secondary Ingredient</label>
                                      <button
                                        type="button"
                                        className="share-button"
                                        onClick={() => openShareModal(itemIngredient)}
                                        title="Share this secondary ingredient"
                                      >
                                        <img src={SharedItemsIcon} alt="Share" />
                                      </button>
                                    </div>
                                    <IngredientSelector
                                      selectedId={itemIngredient.ingredient_id || ''}
                                      onChange={(e) => handleIngredientInputChange(itemIngredient.id, e)}
                                      hasError={!itemIngredient.ingredient_id}
                                      ingredientList={ingredientList}
                                      disabled={isItem(itemIngredient) || isSecondary(itemIngredient)}
                                      isPartOfItem={!!itemIngredient.ingredient_item}
                                      isPartOfSecondary={true} // Always true for secondary ingredient children
                                      isSecondaryIngredient={isSecondary(itemIngredient)}
                                    />
                                    {!itemIngredient.ingredient_id && (
                                      <div className="error-message">
                                        Ingredient ID is required
                                      </div>
                                    )}
                                    <div className="field-constraint">INT NOT NULL</div>
                                  </div>
                                  <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                      name="description"
                                      value={itemIngredient.description || ''}
                                      onChange={e => handleIngredientInputChange(itemIngredient.id, e)}
                                    />
                                    <div className="field-constraint">TEXT</div>
                                  </div>

                                  {/* Add image upload UI for secondary ingredients in items */}
                                  <div className="image-upload-container">
                                    <button
                                      type="button"
                                      className="image-upload-button"
                                      onClick={() => triggerFileInput(itemIngredient.id)}
                                    >
                                      <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 10.0001C9.10457 10.0001 10 9.10466 10 8.00009C10 6.89552 9.10457 6.00009 8 6.00009C6.89543 6.00009 6 6.89552 6 8.00009C6 9.10466 6.89543 10.0001 8 10.0001Z" fill="#333" />
                                        <path d="M6 1.00009L4.5 3.00009H2C1.44772 3.00009 1 3.4478 1 4.00009V12.0001C1 12.5524 1.44772 13.0001 2 13.0001H14C14.5523 13.0001 15 12.5524 15 12.0001V4.00009C15 3.4478 14.5523 3.00009 14 3.00009H11.5L10 1.00009H6ZM8 11.5001C6.067 11.5001 4.5 9.93309 4.5 8.00009C4.5 6.06709 6.067 4.50009 8 4.50009C9.933 4.50009 11.5 6.06709 11.5 8.00009C11.5 9.93309 9.933 11.5001 8 11.5001Z" fill="#333" />
                                      </svg>
                                      Add Images
                                    </button>
                                    <input
                                      ref={el => fileInputRefs.current[itemIngredient.id] = el}
                                      type="file"
                                      accept="image/*"
                                      multiple
                                      style={{ display: 'none' }}
                                      onChange={(e) => handleImageSelect(itemIngredient.id, e)}
                                      capture="environment"
                                    />
                                    {uploadErrors[itemIngredient.id] && (
                                      <div className="error-message">{uploadErrors[itemIngredient.id]}</div>
                                    )}

                                    {/* Show compression status */}
                                    {compressionStatus[itemIngredient.id] && (
                                      <div className="compression-status">{compressionStatus[itemIngredient.id]}</div>
                                    )}

                                    {/* Display uploaded images and loading state */}
                                    <div className="image-preview-container">
                                      {/* No loading indicator needed here anymore since we upload on save */}

                                      {/* Show existing images */}
                                      {itemIngredient.images && itemIngredient.images.length > 0 &&
                                        itemIngredient.images.map((imageUrl, index) => (
                                          <div key={index} className="image-preview-item">
                                            <img src={imageUrl} alt={`Uploaded ${index}`} className="image-preview" />
                                            <button
                                              type="button"
                                              className="remove-image-button"
                                              onClick={() => removeImage(itemIngredient.id, imageUrl)}
                                            >
                                              &times;
                                            </button>
                                          </div>
                                        ))
                                      }
                                    </div>
                                  </div>

                                  <div className="secondary-ingredients">
                                    <p className="secondary-description">Child ingredients in this group will use this description: <strong>{itemIngredient.description || 'No description'}</strong></p>
                                    {getSecondaryIngredients(itemIngredient.secondary).map((secondaryIngredient) => (
                                      <div className="menu-entry ingredient-entry secondary-child" key={secondaryIngredient.id}>
                                        <div className="form-group">
                                          <label>Ingredient</label>
                                          <IngredientSelector
                                            selectedId={secondaryIngredient.ingredient_id || ''}
                                            onChange={(e) => handleIngredientInputChange(secondaryIngredient.id, e)}
                                            hasError={!secondaryIngredient.ingredient_id}
                                            ingredientList={ingredientList}
                                            disabled={isItem(secondaryIngredient) || isSecondary(secondaryIngredient)}
                                            isPartOfItem={true}
                                            isPartOfSecondary={true}
                                            isSecondaryIngredient={isSecondary(secondaryIngredient)}
                                          />
                                          {!secondaryIngredient.ingredient_id && (
                                            <div className="error-message">
                                              Ingredient ID is required
                                            </div>
                                          )}
                                          <div className="field-constraint">INT NOT NULL</div>
                                        </div>
                                        <div className="form-group">
                                          <label>Private</label>
                                          <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <label className="switch">
                                              <input
                                                type="checkbox"
                                                name="private"
                                                checked={secondaryIngredient.private || false}
                                                onChange={e => handleIngredientInputChange(secondaryIngredient.id, e)}
                                              />
                                              <span className="slider"></span>
                                            </label>
                                            <span className="toggle-label">{secondaryIngredient.private ? 'Yes' : 'No'}</span>
                                          </div>
                                          <div className="field-constraint">BOOLEAN NOT NULL</div>
                                        </div>
                                        <button
                                          type="button"
                                          className="remove-ingredient-under-button"
                                          onClick={() => {
                                            const ingredientName = secondaryIngredient.ingredient_id
                                              ? (ingredientList.find(i => i.id == secondaryIngredient.ingredient_id)?.name || 'this ingredient')
                                              : 'this ingredient';

                                            if (window.confirm(`Are you sure you want to remove ${ingredientName}?`)) {
                                              setScreening(prev => {
                                                const newIngredients = { ...prev.ingredients };
                                                delete newIngredients[secondaryIngredient.id];
                                                return {
                                                  ...prev,
                                                  ingredients: newIngredients
                                                };
                                              });
                                            }
                                          }}
                                          aria-label="Remove ingredient"
                                        >
                                          Remove Ingredient
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="ingredient-actions">
                                    <button
                                      type="button"
                                      className="secondary-add-ingredient-button"
                                      onClick={() => addIngredientToSecondary(itemIngredient.id)}
                                    >
                                      Add Ingredient (S)
                                    </button>
                                    <button
                                      type="button"
                                      className="remove-secondary-button"
                                      onClick={() => {
                                        const confirmed = window.confirm(`Are you sure you want to remove this secondary ingredient group and all its ingredients?`);
                                        if (confirmed) {
                                          removeSecondary(itemIngredient.id);
                                        }
                                      }}
                                    >
                                      Remove Ingredient (S)
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                // Regular ingredient within an item
                                <>
                                  <div className="form-group">
                                    <label>Ingredient</label>
                                    <IngredientSelector
                                      selectedId={itemIngredient.ingredient_id || ''}
                                      onChange={(e) => handleIngredientInputChange(itemIngredient.id, e)}
                                      hasError={!itemIngredient.ingredient_id}
                                      ingredientList={ingredientList}
                                      disabled={isItem(itemIngredient) || isSecondary(itemIngredient)}
                                      isPartOfItem={!!itemIngredient.ingredient_item}
                                      isPartOfSecondary={!!itemIngredient.secondary_ingredient}
                                      isSecondaryIngredient={isSecondary(itemIngredient)}
                                    />
                                    {!itemIngredient.ingredient_id && (
                                      <div className="error-message">
                                        Ingredient ID is required
                                      </div>
                                    )}
                                    <div className="field-constraint">INT NOT NULL</div>
                                  </div>
                                  <div className="form-group">
                                    <label>Private</label>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                      <label className="switch">
                                        <input
                                          type="checkbox"
                                          name="private"
                                          checked={itemIngredient.private || false}
                                          onChange={e => handleIngredientInputChange(itemIngredient.id, e)}
                                        />
                                        <span className="slider"></span>
                                      </label>
                                      <span className="toggle-label">{itemIngredient.private ? 'Yes' : 'No'}</span>
                                    </div>
                                    <div className="field-constraint">BOOLEAN NOT NULL</div>
                                  </div>
                                  <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                      name="description"
                                      value={itemIngredient.description || ''}
                                      onChange={e => handleIngredientInputChange(itemIngredient.id, e)}
                                    />
                                    <div className="field-constraint">TEXT</div>
                                  </div>
                                  <button
                                    type="button"
                                    className="remove-ingredient-under-button"
                                    onClick={() => {
                                      const ingredientName = itemIngredient.ingredient_id
                                        ? (ingredientList.find(i => i.id == itemIngredient.ingredient_id)?.name || 'this ingredient')
                                        : 'this ingredient';

                                      if (window.confirm(`Are you sure you want to remove ${ingredientName}?`)) {
                                        setScreening(prev => {
                                          const newIngredients = { ...prev.ingredients };
                                          delete newIngredients[itemIngredient.id];
                                          return {
                                            ...prev,
                                            ingredients: newIngredients
                                          };
                                        });
                                      }
                                    }}
                                    aria-label="Remove ingredient"
                                  >
                                    Remove Ingredient
                                  </button>
                                </>
                              )}
                            </div>
                          ))}


                        </div>
                      )}

                      {/* Display secondary's ingredients if this is a secondary ingredient */}
                      {isSecondary(ingredient) && ingredient.secondary && (
                        <div className="secondary-ingredients">
                          <p className="secondary-description">Child ingredients in this group will use this description: <strong>{ingredient.description || 'No description'}</strong></p>

                          {/* Add image upload UI for secondary ingredients */}
                          <div className="image-upload-container">
                            <button
                              type="button"
                              className="image-upload-button"
                              onClick={() => triggerFileInput(ingredient.id)}
                            >
                              <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 10.0001C9.10457 10.0001 10 9.10466 10 8.00009C10 6.89552 9.10457 6.00009 8 6.00009C6.89543 6.00009 6 6.89552 6 8.00009C6 9.10466 6.89543 10.0001 8 10.0001Z" fill="#333" />
                                <path d="M6 1.00009L4.5 3.00009H2C1.44772 3.00009 1 3.4478 1 4.00009V12.0001C1 12.5524 1.44772 13.0001 2 13.0001H14C14.5523 13.0001 15 12.5524 15 12.0001V4.00009C15 3.4478 14.5523 3.00009 14 3.00009H11.5L10 1.00009H6ZM8 11.5001C6.067 11.5001 4.5 9.93309 4.5 8.00009C4.5 6.06709 6.067 4.50009 8 4.50009C9.933 4.50009 11.5 6.06709 11.5 8.00009C11.5 9.93309 9.933 11.5001 8 11.5001Z" fill="#333" />
                              </svg>
                              Add Images
                            </button>
                            <input
                              ref={el => fileInputRefs.current[ingredient.id] = el}
                              type="file"
                              accept="image/*"
                              multiple
                              style={{ display: 'none' }}
                              onChange={(e) => handleImageSelect(ingredient.id, e)}
                              capture="environment"
                            />
                            {uploadErrors[ingredient.id] && (
                              <div className="error-message">{uploadErrors[ingredient.id]}</div>
                            )}

                            {/* Show compression status */}
                            {compressionStatus[ingredient.id] && (
                              <div className="compression-status">{compressionStatus[ingredient.id]}</div>
                            )}

                            {/* Display uploaded images and loading state */}
                            <div className="image-preview-container">
                              {/* No loading indicator needed here anymore since we upload on save */}

                              {/* Show existing images and print image url */}
                              {ingredient.images && ingredient.images.length > 0 &&
                                ingredient.images.map((imageUrl, index) => {
                                  return (
                                    <div key={index} className="image-preview-item">
                                      <img src={imageUrl} alt={`Uploaded ${index}`} className="image-preview" />
                                      <button
                                        type="button"
                                        className="remove-image-button"
                                        onClick={() => removeImage(ingredient.id, imageUrl)}
                                      >
                                        &times;
                                      </button>
                                    </div>
                                  )
                                })
                              }
                            </div>
                          </div>

                          {getSecondaryIngredients(ingredient.secondary).map((secondaryIngredient) => (
                            <div className="menu-entry ingredient-entry secondary-child" key={secondaryIngredient.id}>
                              <div className="form-group">
                                <label>Ingredient</label>
                                <IngredientSelector
                                  selectedId={secondaryIngredient.ingredient_id || ''}
                                  onChange={(e) => handleIngredientInputChange(secondaryIngredient.id, e)}
                                  hasError={!secondaryIngredient.ingredient_id}
                                  ingredientList={ingredientList}
                                  disabled={isItem(secondaryIngredient) || isSecondary(secondaryIngredient)}
                                  isPartOfItem={!!secondaryIngredient.ingredient_item}
                                  isPartOfSecondary={true} // Always true for secondary ingredient children
                                  isSecondaryIngredient={isSecondary(secondaryIngredient)}
                                />
                                {!secondaryIngredient.ingredient_id && (
                                  <div className="error-message">
                                    Ingredient ID is required
                                  </div>
                                )}
                                <div className="field-constraint">INT NOT NULL</div>
                              </div>
                              {/* Add private toggle for secondary ingredient children */}
                              <div className="form-group">
                                <label>Private</label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      name="private"
                                      checked={secondaryIngredient.private || false}
                                      onChange={e => handleIngredientInputChange(secondaryIngredient.id, e)}
                                    />
                                    <span className="slider"></span>
                                  </label>
                                  <span className="toggle-label">{secondaryIngredient.private ? 'Yes' : 'No'}</span>
                                </div>
                                <div className="field-constraint">BOOLEAN NOT NULL</div>
                              </div>
                              <button
                                type="button"
                                className="remove-ingredient-under-button"
                                onClick={() => {
                                  const ingredientName = secondaryIngredient.ingredient_id
                                    ? (ingredientList.find(i => i.id == secondaryIngredient.ingredient_id)?.name || 'this ingredient')
                                    : 'this ingredient';

                                  if (window.confirm(`Are you sure you want to remove ${ingredientName}?`)) {
                                    setScreening(prev => {
                                      const newIngredients = { ...prev.ingredients };
                                      delete newIngredients[secondaryIngredient.id];
                                      return {
                                        ...prev,
                                        ingredients: newIngredients
                                      };
                                    });
                                  }
                                }}
                                aria-label="Remove ingredient"
                              >
                                Remove Ingredient
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="ingredient-actions">
                        {isItem(ingredient) ? (
                          <>
                            {/* Shared Items Dropdown for Items */}
                            <div 
                              className="shared-items-dropdown-container" 
                              ref={el => dropdownRef.current[ingredient.id] = el}
                              data-open={showSharedDropdown[ingredient.id] || false}
                            >
                              <button
                                type="button"
                                className="shared-items-dropdown-button"
                                onClick={() => toggleSharedDropdown(ingredient.id)}
                                disabled={sharedItems.filter(item => item.type === 'secondary').length === 0}
                                title="Add shared secondary ingredient to this item"
                              >
                                <img src={SharedItemsIcon} alt="Shared Items" />
                                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </button>
                              {showSharedDropdown[ingredient.id] && (
                                <div className="shared-items-dropdown-menu">
                                  {sharedItems.filter(item => item.type === 'secondary').length === 0 ? (
                                    <div className="shared-items-dropdown-empty">No shared secondary ingredients available</div>
                                  ) : (
                                    sharedItems
                                      .filter(item => item.type === 'secondary')
                                      .map(sharedItem => (
                                        <button
                                          key={sharedItem.id}
                                          className="shared-items-dropdown-item"
                                          onClick={() => addSharedSecondaryToItem(sharedItem, ingredient.item)}
                                          title={`Add ${sharedItem.title} to this item`}
                                        >
                                          {sharedItem.title}
                                        </button>
                                      ))
                                  )}
                                </div>
                              )}
                            </div>
                            
                            <button
                              type="button"
                              className="cc-button"
                              onClick={() => openCCModal(ingredient.id)}
                            >
                              {ingredient.cc && ingredient.cc.length > 0
                                ? `CC(${ingredient.cc.length})`
                                : "CC"}
                            </button>
                            <button
                              type="button"
                              className="item-add-ingredient-button"
                              onClick={() => addIngredientToItem(ingredient.id)}
                            >
                              Add Ingredient
                            </button>
                            <button
                              type="button"
                              className="remove-item-button"
                              onClick={() => {
                                const confirmed = window.confirm(`Are you sure you want to remove this item and all its ingredients?`);
                                if (confirmed) {
                                  removeItem(ingredient.id);
                                }
                              }}
                            >
                              Remove Item
                            </button>
                          </>
                        ) : isSecondary(ingredient) ? (
                          <div className="ingredient-actions">
                            <button
                              type="button"
                              className="cc-button"
                              onClick={() => openCCModal(ingredient.id)}
                            >
                              {ingredient.cc && ingredient.cc.length > 0
                                ? `CC(${ingredient.cc.length})`
                                : "CC"}
                            </button>
                            <button
                              type="button"
                              className="secondary-add-ingredient-button"
                              onClick={() => addIngredientToSecondary(ingredient.id)}
                            >
                              Add Ingredient
                            </button>
                            <button
                              type="button"
                              className="remove-secondary-button"
                              onClick={() => {
                                const confirmed = window.confirm(`Are you sure you want to remove this secondary ingredient and all its ingredients?`);
                                if (confirmed) {
                                  removeSecondary(ingredient.id);
                                }
                              }}
                            >
                              Remove Ingredient
                            </button>
                          </div>
                        ) : (
                          <div className="ingredient-action-buttons">
                            <button
                              type="button"
                              className="cc-button"
                              onClick={() => openCCModal(ingredient.id)}
                            >
                              {ingredient.cc && ingredient.cc.length > 0
                                ? `CC(${ingredient.cc.length})`
                                : "CC"}
                            </button>
                            <button
                              type="button"
                              className="remove-ingredient-under-button"
                              onClick={() => {
                                const ingredientName = ingredient.ingredient_id
                                  ? (ingredientList.find(i => i.id == ingredient.ingredient_id)?.name || 'this ingredient')
                                  : 'this ingredient';

                                if (window.confirm(`Are you sure you want to remove ${ingredientName}?`)) {
                                  // Remove the ingredient from the screening data
                                  setScreening(prev => {
                                    const newIngredients = { ...prev.ingredients };
                                    delete newIngredients[ingredient.id];
                                    return {
                                      ...prev,
                                      ingredients: newIngredients
                                    };
                                  });
                                }
                              }}
                              aria-label="Remove ingredient"
                            >
                              Remove Ingredient
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  </React.Fragment>
                ))}
              </div>

              {/* Ingredients SQL Box */}
              {showIngredientSqlBox && (
                <div className="code-box-container">
                  <div className="code-box">
                    <div className="code-box-header">
                      <span className="code-box-label">sql</span>
                      <div className="code-box-actions">
                        <button className="copy-button" onClick={() => navigator.clipboard.writeText(generateIngredientSql())}>
                          Copy
                        </button>
                        <button className="edit-button">
                          Edit
                        </button>
                      </div>
                    </div>
                    <pre className="sql-query language-sql" dangerouslySetInnerHTML={{ __html: highlightedIngredientSql }} />
                  </div>
                  <div className="code-box">
                    <div className="code-box-header">
                      <span className="code-box-label">sql</span>
                      <div className="code-box-actions">
                        <button className="copy-button" onClick={() => navigator.clipboard.writeText(generateCCSql())}>
                          Copy
                        </button>
                        <button className="edit-button">
                          Edit
                        </button>
                      </div>
                    </div>
                    <pre className="sql-query language-sql" dangerouslySetInnerHTML={{ __html: highlightedCCSql }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ingredients section actions */}
          <div className="section-actions">
            <button
              className="sql-button main-add-ingredient-button"
              type="button"
              onClick={addIngredientEntry}
            >
              + Add Ingredient
            </button>
            <button className="sql-button" type="button" onClick={toggleIngredientSqlBox} style={{ marginLeft: '1rem' }}>
              {showIngredientSqlBox ? 'Hide SQL' : 'Show SQL'}
            </button>
          </div>
        </div>
      </div>

      {/* TODO List */}
      <div className={`todo-list-container ${showTodoList ? 'open' : ''}`}>
        <div className="todo-list-header">
          <h3>Todo List ({todoItems.length})</h3>
          <button className="todo-list-close" onClick={() => setShowTodoList(false)}>
            &times;
          </button>
        </div>
        <ul className="todo-list">
          {todoItems.length === 0 ? (
            <li className="todo-item">No items in todo list</li>
          ) : (
            todoItems.map((item, index) => (
              <li
                key={item.id}
                className={`todo-item ${index === currentTodoIndex ? 'active' : ''}`}
                onClick={() => navigateToTodoItem(index)}
              >
                <div className={`todo-item-icon ${item.type}`}></div>
                {item.label}
                <button
                  className="todo-item-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTodoItem(index);
                  }}
                >
                  &times;
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      <button className="todo-list-toggle" onClick={() => setShowTodoList(!showTodoList)}>
        {todoItems.length > 0 ? todoItems.length : '☰'}
      </button>

      {/* CC Modal */}
      {showCCModal && (
        <div className="modal-overlay">
          <div className="cc-modal">
            <div className="modal-header">
              <h3>Cross Contamination</h3>
              <button onClick={closeCCModal} className="close-modal">&times;</button>
            </div>

            <div className="modal-content">
              {/* Display existing CC entries for this ingredient */}
              {currentCCIngredientId && screening.ingredients[currentCCIngredientId]?.cc &&
                screening.ingredients[currentCCIngredientId].cc.length > 0 && (
                  <div className="cc-entries">
                    {screening.ingredients[currentCCIngredientId].cc.map((entry, index) => (
                      <div key={index} className="cc-entry">
                        <div className="cc-entry-details">
                          <div className="cc-entry-field">
                            Allergen: {allergens.find(a => a.id == entry.allergen_id)?.name || entry.allergen_id}
                          </div>
                          <div className="cc-entry-field">
                            Reason: {cookingMethods.find(m => m.id === entry.reason)?.name || entry.reason}
                          </div>
                          {entry.description && (
                            <div className="cc-entry-field">
                              Description: {entry.description}
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          className="remove-cc-button"
                          onClick={() => removeCCEntry(currentCCIngredientId, index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

              <div className="cc-form">
                <div className="form-group">
                  <label>Allergen</label>
                  <select
                    name="allergen_id"
                    value={ccForm.allergen_id}
                    onChange={handleCCFormChange}
                    required
                    className={!ccForm.allergen_id && addCCAttempted ? 'input-error' : ''}
                  >
                    <option value="">Select Allergen</option>
                    {allergens.map(allergen => (
                      <option key={allergen.id} value={allergen.id}>
                        {allergen.name}
                      </option>
                    ))}
                  </select>
                  {!ccForm.allergen_id && addCCAttempted && (
                    <div className="error-message">Please select an allergen</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Reason</label>
                  <select
                    name="reason"
                    value={ccForm.reason}
                    onChange={handleCCFormChange}
                    required
                    className={!ccForm.reason && addCCAttempted ? 'input-error' : ''}
                  >
                    <option value="">Select Cooking Method</option>
                    {cookingMethods.map(method => (
                      <option key={method.id} value={method.id}>
                        {method.name}
                      </option>
                    ))}
                  </select>
                  {!ccForm.reason && addCCAttempted && (
                    <div className="error-message">Please select a cooking method</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={ccForm.description}
                    onChange={handleCCFormChange}
                    placeholder="Additional details about the cross contamination"
                    required
                    className={!ccForm.description && addCCAttempted ? 'input-error' : ''}
                  />
                  {!ccForm.description && addCCAttempted && (
                    <div className="error-message">Please provide a description</div>
                  )}
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="add-cc-button"
                    onClick={addCCEntry}
                    disabled={!ccForm.allergen_id || !ccForm.reason || !ccForm.description}
                  >
                    Add CC Entry
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={closeCCModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal-overlay" onClick={closeShareModal}>
          <div className="modal share-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              {shareModalData && isItem(shareModalData) ? (
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={shareTitle}
                    onChange={(e) => setShareTitle(e.target.value)}
                    placeholder="Enter a title for this item"
                    autoFocus
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label>Title (optional)</label>
                  <input
                    type="text"
                    value={shareTitle}
                    onChange={(e) => setShareTitle(e.target.value)}
                    placeholder={shareModalData?.description || "Secondary Ingredient"}
                    autoFocus
                  />
                  <div className="field-info">
                    If left empty, the description will be used as the title.
                  </div>
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button className="cancel-button" onClick={closeShareModal}>
                Cancel
              </button>
              <button
                className="action-button"
                onClick={handleShareItem}
                disabled={shareModalData && isItem(shareModalData) && !shareTitle}
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreeningPage; 