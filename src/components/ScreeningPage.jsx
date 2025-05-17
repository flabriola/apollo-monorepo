import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/ScreeningPage.css';
import Prism from 'prismjs';
import 'prismjs/components/prism-sql';
import 'prismjs/themes/prism.css';

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
    ingredients: {}
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
        ingredients: {}
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

      // Skip items (ingredient_id = 400000)
      if (isItem(ingredient)) {
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
            // For secondary ingredients inside items: {secondary description}item's description
            description = `{${parentSecondary.description}}${parentItem.description}`;
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

  // Save handler
  const handleSave = async () => {
    // Perform comprehensive validation before saving
    const isValid = validateBeforeSave();

    if (!isValid) {
      alert("Please fix the validation errors before saving.");
      return;
    }

    // Get restaurant name for the title
    const restaurantName = screening.restaurant.name || restaurantInfo.name;
    const screeningTitle = restaurantName || 'Untitled Screening';

    try {
      // Determine if this is a new screening or an update
      if (initialScreening?.id) {
        // This is an existing screening - UPDATE

        // Prepare data to send for update
        const updateData = {
          title: screeningTitle,
          json_data: screening // This is the current state with all changes
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
        setOriginalScreening(screening);
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
          json_data: screening,
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
          json: screening,
          title: screeningTitle
        };

        // Update state to treat this as an existing screening from now on
        setOriginalScreening(screening);
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
  const validateBeforeSave = () => {
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

    // If not valid, log the error fields
    if (!isValid) {
      console.error("Validation failed for:", errorFields);
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
            </div>
            <div className="right-actions">
              <button className="action-button" onClick={() => setShowAllSql(v => !v)}>
                View
              </button>
              <button
                className="action-button"
                disabled={initialScreening ? !isScreeningDirty : false}
                onClick={handleSave}
              >
                {initialScreening ? 'Save' : 'Create'}
              </button>
            </div>
          </div>
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
          </div>
        </div>
      </div>
      <div className={`screening-page-content${showAllSql ? ' blur' : ''}`}>
        <div className="section-header">
          <h2>Restaurant Information</h2>
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
                  <div className="form-group">
                    <label>Name</label>
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
            {Object.keys(screening.menus || {}).map((menuId) => (
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
                  <div className="form-group">
                    <label>Name</label>
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
            {getCurrentMenuDishes().map((dish) => (
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
                    <div className="menu-entry ingredient-entry">
                      <div className="form-group">
                        <label>{isItem(ingredient) ? 'Item' : isSecondary(ingredient) ? 'Secondary Ingredient' : 'Ingredient'}</label>
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
                                    <label>Secondary Ingredient</label>
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
                        )}
                      </div>

                    </div>
                  </React.Fragment>
                ))}
              </div>

              {/* Ingredients SQL Box */}
              {showIngredientSqlBox && (
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
    </div>
  );
};

export default ScreeningPage; 