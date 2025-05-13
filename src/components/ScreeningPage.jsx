import React, { useState, useEffect } from 'react';
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

const ScreeningPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
  const [showSqlBox, setShowSqlBox] = useState(true);
  const [highlightedSql, setHighlightedSql] = useState('');

  // Section 2: Menu (multiple entries)
  const [menuRestaurantId, setMenuRestaurantId] = useState('');
  const [menuRestaurantIdError, setMenuRestaurantIdError] = useState('');
  const [showMenuSqlBox, setShowMenuSqlBox] = useState(true);
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

  const [showDishSqlBox, setShowDishSqlBox] = useState(true);
  const [highlightedDishSql, setHighlightedDishSql] = useState('');
  const [currentDishId, setCurrentDishId] = useState(null);

  // Section 4: Ingredients associated with dishes
  const [ingredientsByDish, setIngredientsByDish] = useState({
    [`0-0`]: [{ ingredient_id: '', private: false, description: '' }]
  });
  const [ingredientErrorsByDish, setIngredientErrorsByDish] = useState({
    [`0-0`]: [{ ingredient_id: '', private: '', description: '' }]
  });
  const [showIngredientSqlBox, setShowIngredientSqlBox] = useState(true);
  const [highlightedIngredientSql, setHighlightedIngredientSql] = useState('');
  const [ingredientSearchTerm, setIngredientSearchTerm] = useState('');
  const [filteredIngredients, setFilteredIngredients] = useState(mockIngredients);

  // Instead, track the current menu ID and dish ID
  const [currentMenuId, setCurrentMenuId] = useState(null);

  // Change the single dishIdForIngredients state to a map of IDs by dish key
  const [dishIdsByDishKey, setDishIdsByDishKey] = useState({
    "0-0": ""
  });

  // Initialize original screening state
  const [originalScreening, setOriginalScreening] = useState(null);
  const [isScreeningDirty, setIsScreeningDirty] = useState(false);

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
    setIsScreeningDirty(JSON.stringify(screening) !== JSON.stringify(originalScreening));
  }, [screening, originalScreening]);

  // Filter ingredients based on search term
  useEffect(() => {
    if (ingredientSearchTerm) {
      const filtered = mockIngredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(ingredientSearchTerm.toLowerCase()) ||
        ingredient.description.toLowerCase().includes(ingredientSearchTerm.toLowerCase())
      );
      setFilteredIngredients(filtered);
    } else {
      setFilteredIngredients(mockIngredients);
    }
  }, [ingredientSearchTerm]);

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
    const newErrors = { ...dishErrorsByMenu };
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

    const currentMenuDishErrors = { ...dishErrorsByMenu[menuIdx] };
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

    const currentErrors = [...(ingredientErrorsByDish[dishKey] || [])];
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
      const dishId = ingredient.dish;
      // Get dish_id from the consistent mapping
      const dish_id = dishIdsByDishKey[dishId] || '1';  // Use default value of 1

      // Include all ingredients with placeholder values for empty fields
      const ingredient_id = ingredient.ingredient_id || '1';  // Use default value of 1

      const ingredientValue =
        `    (${dish_id}, ${ingredient_id}, ${ingredient.private ? 1 : 0}, '${ingredient.description?.replace(/'/g, "''") || ''}')`;
      allValues.push(ingredientValue);
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
      if (screening.ingredients[ingredientKey].dish === currentDishId) {
        ingredients.push({
          id: parseInt(ingredientKey),
          ...screening.ingredients[ingredientKey]
        });
      }
    });
    return ingredients.sort((a, b) => a.id - b.id);
  };

  // Save handler
  const handleSave = () => {
    // Get screening ID from initialScreening or return if none (new screening)
    const screeningId = initialScreening?.id;
    if (!screeningId) {
      console.error('Cannot save: No screening ID');
      return;
    }

    // Prepare data to send
    const data = {
      title: initialScreening.title || 'Untitled Screening', // Use existing title or default
      json_data: screening // This is the current state with all changes
    };

    // Make API request
    const API_URL = `${import.meta.env.VITE_API_URL}/screenings/${screeningId}`;
    
    fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(result => {
        console.log('Screening saved successfully:', result);
        
        // Update originalScreening to match current screening (no longer dirty)
        setOriginalScreening(screening);
        setIsScreeningDirty(false);
        
        // Optionally show success message
        alert('Screening saved successfully!');
      })
      .catch(error => {
        console.error('Error saving screening:', error);
        alert('Failed to save screening. Please try again.');
      });
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
              <button className="action-button" disabled={!isScreeningDirty} onClick={handleSave}>
                Save
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
                  }}
                  min={1}
                  required
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
                    />
                    <div className="field-constraint">VARCHAR(255) NOT NULL</div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={getCurrentMenu().description || ''}
                      onChange={e => handleMenuInputChange(currentMenuId, e)}
                    />
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
                    />
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
                  }}
                  min={1}
                  required
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
                    />
                    <div className="field-constraint">VARCHAR(255) NOT NULL</div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={getCurrentDish().description || ''}
                      onChange={e => handleDishInputChange(currentDishId, e)}
                    />
                    <div className="field-constraint">TEXT</div>
                  </div>
                  <div className="form-group">
                    <label>Price</label>
                    <input
                      type="text"
                      name="price"
                      value={getCurrentDish().price || ''}
                      onChange={e => handleDishInputChange(currentDishId, e)}
                      placeholder="0.00"
                      required
                    />
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
                    />
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

                {/* Ingredients for current dish */}
                {getCurrentDishIngredients().map((ingredient, idx) => (
                  <div className="menu-entry ingredient-entry" key={ingredient.id}>
                    <div className="form-group">
                      <label>Ingredient</label>
                      <div className="ingredient-select-container">
                        <input
                          type="text"
                          placeholder="Search ingredients..."
                          value={ingredientSearchTerm}
                          onChange={e => setIngredientSearchTerm(e.target.value)}
                          className="ingredient-search"
                        />
                        <select
                          name="ingredient_id"
                          value={ingredient.ingredient_id || ''}
                          onChange={e => handleIngredientInputChange(ingredient.id, e)}
                          required
                          className="ingredient-select"
                        >
                          <option value="">Select an ingredient</option>
                          {filteredIngredients.map(option => (
                            <option key={option.id} value={option.id}>
                              {option.name} - {option.description}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="field-constraint">INT NOT NULL</div>
                    </div>
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
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        name="description"
                        value={ingredient.description || ''}
                        onChange={e => handleIngredientInputChange(ingredient.id, e)}
                      />
                      <div className="field-constraint">TEXT</div>
                    </div>
                    <button
                      type="button"
                      className="remove-ingredient-under-button"
                      onClick={() => {
                        const ingredientName = ingredient.ingredient_id
                          ? (filteredIngredients.find(i => i.id == ingredient.ingredient_id)?.name || 'this ingredient')
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
              className="sql-button add-ingredient-button"
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