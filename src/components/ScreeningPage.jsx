import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
  const initialScreening = location.state?.screening;

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
  const [menus, setMenus] = useState([
    { id: '', name: '', description: '', active: true, pdf: '' }
  ]);
  const [menuErrors, setMenuErrors] = useState([
    { id: '', name: '', description: '', active: '', pdf: '' }
  ]);
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
  const [currentDishIndex, setCurrentDishIndex] = useState(0);

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

  // Add current menu index state
  const [currentMenuIndex, setCurrentMenuIndex] = useState(0);

  // Change the single dishIdForIngredients state to a map of IDs by dish key
  const [dishIdsByDishKey, setDishIdsByDishKey] = useState({
    "0-0": ""
  });

  // Initialize from screening data if it exists
  useEffect(() => {
    if (initialScreening) {
      // In a real app, you'd extract restaurant info from the screening
      // For now, we'll just use mock data if available
      setRestaurantInfo({
        name: initialScreening.title.split(' - ')[0] || '',
        address: '123 Main St',  // Mock data
        phone: '555-123-4567'    // Mock data
      });
    }
  }, [initialScreening]);

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

  // Generate SQL query with the current values
  const generateSqlQuery = () => {
    return `INSERT INTO restaurant (name, address, phone) \nVALUES \n    ('${restaurantInfo.name}', '${restaurantInfo.address}', '${restaurantInfo.phone}')\nON DUPLICATE KEY UPDATE \n    name = VALUES(name), \n    address = VALUES(address), \n    phone = VALUES(phone);`;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRestaurantInfo(prev => ({
      ...prev,
      [name]: value
    }));

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
    const newMenuIndex = menus.length;
    const newDishKey = `${newMenuIndex}-0`;
    
    setMenus([...menus, { id: '', name: '', description: '', active: true, pdf: '' }]);
    setMenuErrors([...menuErrors, { id: '', name: '', description: '', active: '', pdf: '' }]);
    
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
    
    setCurrentMenuIndex(newMenuIndex);
    setCurrentDishIndex(0); // Reset to first dish of the new menu
  };

  // Handle menu input changes
  const handleMenuInputChange = (idx, e) => {
    const { name, value, type, checked } = e.target;
    const newMenus = [...menus];
    newMenus[idx][name] = type === 'checkbox' ? checked : value;
    setMenus(newMenus);
    validateMenuField(idx, name, newMenus[idx][name]);
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
    const newErrors = [...menuErrors];
    newErrors[idx][field] = error;
    setMenuErrors(newErrors);
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
    menus.forEach((menu, idx) => {
      Object.keys(menu).forEach(field => {
        if (!validateMenuField(idx, field, menu[field])) valid = false;
      });
    });
    return valid;
  };

  // Generate SQL for menus
  const generateMenuSql = () => {
    const rid = menuRestaurantId;
    const values = menus.map(menu =>
      `    (${rid}, '${menu.name.replace(/'/g, "''")}', '${menu.description.replace(/'/g, "''")}', ${menu.active ? 1 : 0}, '${menu.pdf.replace(/'/g, "''")}')`
    ).join(',\n');
    return `INSERT INTO menu (restaurant_id, name, description, active, pdf_url) \nVALUES\n${values}\nON DUPLICATE KEY UPDATE \n    name = VALUES(name), \n    description = VALUES(description), \n    active = VALUES(active), \n    pdf_url = VALUES(pdf_url);`;
  };

  // Highlight SQL for menus
  useEffect(() => {
    if (showMenuSqlBox) {
      const raw = generateMenuSql();
      const html = Prism.highlight(raw, Prism.languages.sql, 'sql');
      setHighlightedMenuSql(html);
    }
  }, [showMenuSqlBox, menus, menuRestaurantId]);

  // Toggle menu SQL box
  const toggleMenuSqlBox = () => {
    if (!showMenuSqlBox) validateAllMenus();
    setShowMenuSqlBox(!showMenuSqlBox);
  };

  // Update addDish function to initialize the dish ID for the new dish
  const addDish = () => {
    const currentMenuDishes = dishesByMenu[currentMenuIndex] || [];
    const newDishIndex = currentMenuDishes.length;
    const newDishKey = `${currentMenuIndex}-${newDishIndex}`;
    
    setDishesByMenu({
      ...dishesByMenu,
      [currentMenuIndex]: [
        ...currentMenuDishes,
        { id: '', name: '', description: '', price: '', category: '', active: true }
      ]
    });
    
    const currentMenuDishErrors = dishErrorsByMenu[currentMenuIndex] || [];
    setDishErrorsByMenu({
      ...dishErrorsByMenu,
      [currentMenuIndex]: [
        ...currentMenuDishErrors,
        { id: '', name: '', description: '', price: '', category: '', active: '' }
      ]
    });
    
    // Initialize ingredients for the new dish
    setIngredientsByDish({
      ...ingredientsByDish,
      [newDishKey]: [{ ingredient_id: '', private: false, description: '' }]
    });
    
    setIngredientErrorsByDish({
      ...ingredientErrorsByDish,
      [newDishKey]: [{ ingredient_id: '', private: '', description: '' }]
    });
    
    // Initialize dish ID for the new dish
    setDishIdsByDishKey({
      ...dishIdsByDishKey,
      [newDishKey]: ''
    });
    
    // Navigate to the newly added dish
    setCurrentDishIndex(newDishIndex);
  };

  // Update handleDishInputChange to handle dishes by menu
  const handleDishInputChange = (menuIdx, dishIdx, e) => {
    const { name, value, type, checked } = e.target;
    
    const currentMenuDishes = [...(dishesByMenu[menuIdx] || [])];
    currentMenuDishes[dishIdx] = {
      ...currentMenuDishes[dishIdx],
      [name]: type === 'checkbox' ? checked : value
    };
    
    setDishesByMenu({
      ...dishesByMenu,
      [menuIdx]: currentMenuDishes
    });
    
    validateDishField(menuIdx, dishIdx, name, currentMenuDishes[dishIdx][name]);
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
    
    const currentMenuDishErrors = [...(dishErrorsByMenu[menuIdx] || [])];
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
    const currentMenuId = menuIdsByMenuIndex[currentMenuIndex] || '';
    
    if (!currentMenuId) {
      setMenuIdForDishesError('Menu ID is required');
      valid = false;
    } else if (!/^\d+$/.test(currentMenuId)) {
      setMenuIdForDishesError('Must be an integer');
      valid = false;
    } else {
      setMenuIdForDishesError('');
    }
    
    const currentMenuDishes = dishesByMenu[currentMenuIndex] || [];
    currentMenuDishes.forEach((dish, idx) => {
      Object.keys(dish).forEach(field => {
        if (field !== 'description' && field !== 'category') { // These can be empty
          if (!validateDishField(currentMenuIndex, idx, field, dish[field])) valid = false;
        }
      });
    });
    
    return valid;
  };

  // Update the dish SQL generation to include ALL dishes across all menus
  const generateDishSql = () => {
    let allValues = [];
    
    // Loop through all menu indices in dishesByMenu
    Object.keys(dishesByMenu).forEach(menuIdx => {
      const menuId = menuIdsByMenuIndex[menuIdx] || '';
      const dishes = dishesByMenu[menuIdx] || [];
      
      if (menuId && dishes.length > 0) {
        const menuDishValues = dishes.map(dish =>
          `    (${menuId}, '${dish.name.replace(/'/g, "''")}', '${dish.description.replace(/'/g, "''")}', ${dish.price || 0}, '${dish.category.replace(/'/g, "''")}', ${dish.active ? 1 : 0})`
        );
        allValues = [...allValues, ...menuDishValues];
      }
    });
    
    return allValues.length > 0
      ? `INSERT INTO dish (menu_id, name, description, price, category, active) \nVALUES\n${allValues.join(',\n')}\nON DUPLICATE KEY UPDATE \n    name = VALUES(name), \n    description = VALUES(description), \n    price = VALUES(price), \n    category = VALUES(category), \n    active = VALUES(active);`
      : '-- No dishes added to any menu';
  };

  // Update dish navigation functions
  const nextDish = () => {
    const currentMenuDishes = dishesByMenu[currentMenuIndex] || [];
    if (currentDishIndex < currentMenuDishes.length - 1) {
      setCurrentDishIndex(currentDishIndex + 1);
    }
  };

  const prevDish = () => {
    if (currentDishIndex > 0) {
      setCurrentDishIndex(currentDishIndex - 1);
    }
  };

  const goToDish = (index) => {
    const currentMenuDishes = dishesByMenu[currentMenuIndex] || [];
    if (index >= 0 && index < currentMenuDishes.length) {
      setCurrentDishIndex(index);
    }
  };

  // Update addIngredientEntry function to not include dish_id property
  const addIngredientEntry = () => {
    const dishKey = `${currentMenuIndex}-${currentDishIndex}`;
    const currentIngredients = ingredientsByDish[dishKey] || [];
    const currentErrors = ingredientErrorsByDish[dishKey] || [];

    setIngredientsByDish({
      ...ingredientsByDish,
      [dishKey]: [
        ...currentIngredients,
        { ingredient_id: '', private: false, description: '' }
      ]
    });

    setIngredientErrorsByDish({
      ...ingredientErrorsByDish,
      [dishKey]: [
        ...currentErrors,
        { ingredient_id: '', private: '', description: '' }
      ]
    });
  };

  // Update handleIngredientInputChange to not handle dish_id field since we're using dishIdsByDishKey
  const handleIngredientInputChange = (idx, e) => {
    const { name, value, type, checked } = e.target;
    
    // Skip if trying to update dish_id directly from an ingredient entry
    if (name === 'dish_id') return;
    
    const dishKey = `${currentMenuIndex}-${currentDishIndex}`;
    const currentIngredients = [...(ingredientsByDish[dishKey] || [])];

    currentIngredients[idx] = {
      ...currentIngredients[idx],
      [name]: type === 'checkbox' ? checked : value
    };

    setIngredientsByDish({
      ...ingredientsByDish,
      [dishKey]: currentIngredients
    });

    validateIngredientField(dishKey, idx, name, currentIngredients[idx][name]);
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
    const currentDishKey = `${currentMenuIndex}-${currentDishIndex}`;
    const currentDishId = dishIdsByDishKey[currentDishKey] || '';
    
    if (!currentDishId) {
      // Could add error state for dish ID if needed
      valid = false;
    } else if (!/^\d+$/.test(currentDishId)) {
      // Could add error state for dish ID if needed
      valid = false;
    }
    
    const dishKey = `${currentMenuIndex}-${currentDishIndex}`;
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
    
    // Loop through all dish keys in ingredientsByDish
    Object.keys(ingredientsByDish).forEach(dishKey => {
      const [menuIdx, dishIdx] = dishKey.split('-');
      const dishId = dishIdsByDishKey[dishKey] || '';
      const ingredients = ingredientsByDish[dishKey] || [];
      
      if (dishId && ingredients.length > 0) {
        const dishValues = ingredients.map(entry =>
          `    (${dishId}, ${entry.ingredient_id}, ${entry.private ? 1 : 0}, '${entry.description?.replace(/'/g, "''") || ''}')`
        );
        allValues = [...allValues, ...dishValues];
      }
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
  }, [showIngredientSqlBox, ingredientsByDish, currentMenuIndex, currentDishIndex, dishesByMenu, dishIdsByDishKey]);

  // Toggle ingredient SQL box
  const toggleIngredientSqlBox = () => {
    if (!showIngredientSqlBox) validateAllIngredients();
    setShowIngredientSqlBox(!showIngredientSqlBox);
  };

  // Add these functions for menu navigation
  const nextMenu = () => {
    if (currentMenuIndex < menus.length - 1) {
      setCurrentMenuIndex(currentMenuIndex + 1);
    }
  };

  const prevMenu = () => {
    if (currentMenuIndex > 0) {
      setCurrentMenuIndex(currentMenuIndex - 1);
    }
  };

  const goToMenu = (index) => {
    if (index >= 0 && index < menus.length) {
      setCurrentMenuIndex(index);
    }
  };

  // Highlight SQL for dishes
  useEffect(() => {
    if (showDishSqlBox) {
      const raw = generateDishSql();
      const html = Prism.highlight(raw, Prism.languages.sql, 'sql');
      setHighlightedDishSql(html);
    }
  }, [showDishSqlBox, dishesByMenu, currentMenuIndex, menuIdsByMenuIndex]);

  // Toggle dish SQL box
  const toggleDishSqlBox = () => {
    if (!showDishSqlBox) validateAllDishes();
    setShowDishSqlBox(!showDishSqlBox);
  };

  return (
    <div className="screening-page">
      <div className="screening-page-content">
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
                  name="menu_restaurant_id"
                  value={menuRestaurantId}
                  onChange={e => setMenuRestaurantId(e.target.value)}
                  min={1}
                  required
                />
                {menuRestaurantIdError && <div className="error-message">{menuRestaurantIdError}</div>}
                <div className="field-constraint">INT NOT NULL</div>
              </div>
              {/* Display only the current menu */}
              {menus.length > 0 && (
                <div className="menu-entry">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={menus[currentMenuIndex].name}
                      onChange={e => handleMenuInputChange(currentMenuIndex, e)}
                      maxLength={255}
                      required
                    />
                    {menuErrors[currentMenuIndex]?.name && <div className="error-message">{menuErrors[currentMenuIndex].name}</div>}
                    <div className="field-constraint">VARCHAR(255) NOT NULL</div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={menus[currentMenuIndex].description}
                      onChange={e => handleMenuInputChange(currentMenuIndex, e)}
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
                          checked={menus[currentMenuIndex].active}
                          onChange={e => handleMenuInputChange(currentMenuIndex, e)}
                        />
                        <span className="slider"></span>
                      </label>
                      <span className="toggle-label">{menus[currentMenuIndex].active ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="field-constraint">BOOLEAN NOT NULL</div>
                  </div>
                  <div className="form-group">
                    <label>PDF URL</label>
                    <input
                      type="text"
                      name="pdf"
                      value={menus[currentMenuIndex].pdf}
                      onChange={e => handleMenuInputChange(currentMenuIndex, e)}
                      maxLength={512}
                    />
                    {menuErrors[currentMenuIndex]?.pdf && <div className="error-message">{menuErrors[currentMenuIndex].pdf}</div>}
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
          <button className="sql-button" type="button" onClick={addMenu}>+ Add Menu</button>
          <button className="sql-button" type="button" onClick={toggleMenuSqlBox} style={{ marginLeft: '1rem' }}>
            {showMenuSqlBox ? 'Hide SQL' : 'Show SQL'}
          </button>
        </div>
        {/* Menu pagination */}
        <div className="pagination-controls">
          <button
            className="pagination-arrow"
            onClick={prevMenu}
            disabled={currentMenuIndex === 0}
            aria-label="Previous menu"
          >
            &larr;
          </button>
          <div className="pagination-dots">
            {menus.map((menu, idx) => (
              <button
                key={idx}
                className={`pagination-dot ${idx === currentMenuIndex ? 'active' : ''}`}
                onClick={() => goToMenu(idx)}
                aria-label={`Go to menu ${idx + 1}`}
                type="button"
                style={{ position: 'relative' }}
              >
                <span className="pagination-tooltip">
                  {(menu.name && menu.name.length > 20)
                    ? menu.name.slice(0, 20) + '...'
                    : (menu.name || `Menu ${idx + 1}`)}
                </span>
              </button>
            ))}
          </div>
          <button
            className="pagination-arrow"
            onClick={nextMenu}
            disabled={currentMenuIndex === menus.length - 1}
            aria-label="Next menu"
          >
            &rarr;
          </button>
        </div>

        {/* Section separator */}
        <div className="section-separator"></div>

        {/* Section 3: Dish with pagination */}
        <div className="section-header">
          <h2>Dishes for {menus[currentMenuIndex]?.name || `Menu ${currentMenuIndex + 1}`}</h2>
        </div>
        <div className="section">
          <div className="section-content" id={showDishSqlBox ? 'code-box-out' : ''}>
            <div className="form-row">
              {/* Single Menu ID input for all dishes */}
              <div className="form-group">
                <label>Menu ID</label>
                <input
                  type="number"
                  name="menu_id_for_dishes"
                  value={menuIdsByMenuIndex[currentMenuIndex] || ''}
                  onChange={e => {
                    const value = e.target.value;
                    setMenuIdsByMenuIndex({
                      ...menuIdsByMenuIndex,
                      [currentMenuIndex]: value
                    });
                  }}
                  min={1}
                  required
                />
                {menuIdForDishesError && <div className="error-message">{menuIdForDishesError}</div>}
                <div className="field-constraint">INT NOT NULL</div>
              </div>
              {/* Current dish (paginated) */}
              {dishesByMenu[currentMenuIndex]?.length > 0 && (
                <div className="menu-entry">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={dishesByMenu[currentMenuIndex][currentDishIndex]?.name || ''}
                      onChange={e => handleDishInputChange(currentMenuIndex, currentDishIndex, e)}
                      maxLength={255}
                      required
                    />
                    {dishErrorsByMenu[currentMenuIndex]?.[currentDishIndex]?.name && (
                      <div className="error-message">{dishErrorsByMenu[currentMenuIndex][currentDishIndex].name}</div>
                    )}
                    <div className="field-constraint">VARCHAR(255) NOT NULL</div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={dishesByMenu[currentMenuIndex][currentDishIndex]?.description || ''}
                      onChange={e => handleDishInputChange(currentMenuIndex, currentDishIndex, e)}
                    />
                    <div className="field-constraint">TEXT</div>
                  </div>
                  <div className="form-group">
                    <label>Price</label>
                    <input
                      type="text"
                      name="price"
                      value={dishesByMenu[currentMenuIndex][currentDishIndex]?.price || ''}
                      onChange={e => handleDishInputChange(currentMenuIndex, currentDishIndex, e)}
                      placeholder="0.00"
                      required
                    />
                    {dishErrorsByMenu[currentMenuIndex]?.[currentDishIndex]?.price && (
                      <div className="error-message">{dishErrorsByMenu[currentMenuIndex][currentDishIndex].price}</div>
                    )}
                    <div className="field-constraint">DECIMAL(10,2) NOT NULL</div>
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      name="category"
                      value={dishesByMenu[currentMenuIndex][currentDishIndex]?.category || ''}
                      onChange={e => handleDishInputChange(currentMenuIndex, currentDishIndex, e)}
                      maxLength={100}
                    />
                    {dishErrorsByMenu[currentMenuIndex]?.[currentDishIndex]?.category && (
                      <div className="error-message">{dishErrorsByMenu[currentMenuIndex][currentDishIndex].category}</div>
                    )}
                    <div className="field-constraint">VARCHAR(100)</div>
                  </div>
                  <div className="form-group">
                    <label>Active</label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <label className="switch">
                        <input
                          type="checkbox"
                          name="active"
                          checked={dishesByMenu[currentMenuIndex][currentDishIndex]?.active || false}
                          onChange={e => handleDishInputChange(currentMenuIndex, currentDishIndex, e)}
                        />
                        <span className="slider"></span>
                      </label>
                      <span className="toggle-label">{dishesByMenu[currentMenuIndex][currentDishIndex]?.active ? 'Yes' : 'No'}</span>
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
          <button className="sql-button" type="button" onClick={addDish}>+ Add Dish</button>
          <button className="sql-button" type="button" onClick={toggleDishSqlBox} style={{ marginLeft: '1rem' }}>
            {showDishSqlBox ? 'Hide SQL' : 'Show SQL'}
          </button>
        </div>
        <div className="pagination-controls">
          <button
            className="pagination-arrow"
            onClick={prevDish}
            disabled={currentDishIndex === 0}
            aria-label="Previous dish"
          >
            &larr;
          </button>
          <div className="pagination-dots">
            {(dishesByMenu[currentMenuIndex] || []).map((dish, idx) => (
              <button
                key={idx}
                className={`pagination-dot ${idx === currentDishIndex ? 'active' : ''}`}
                onClick={() => goToDish(idx)}
                aria-label={`Go to dish ${idx + 1}`}
                type="button"
                style={{ position: 'relative' }}
              >
                <span className="pagination-tooltip">
                  {(dish.name && dish.name.length > 20)
                    ? dish.name.slice(0, 20) + '...'
                    : (dish.name || `Dish ${idx + 1}`)}
                </span>
              </button>
            ))}
          </div>
          <button
            className="pagination-arrow"
            onClick={nextDish}
            disabled={currentDishIndex === (dishesByMenu[currentMenuIndex] || []).length - 1}
            aria-label="Next dish"
          >
            &rarr;
          </button>
        </div>
        {/* Ingredients for current dish */}
        <div className="ingredients-section">
          <div className="section-header">
            <h3>Ingredients for {dishesByMenu[currentMenuIndex]?.[currentDishIndex]?.name || `Dish ${currentDishIndex + 1}`}</h3>
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
                    value={dishIdsByDishKey[`${currentMenuIndex}-${currentDishIndex}`] || ''}
                    onChange={e => {
                      const value = e.target.value;
                      setDishIdsByDishKey({
                        ...dishIdsByDishKey,
                        [`${currentMenuIndex}-${currentDishIndex}`]: value
                      });
                    }}
                    min={1}
                    required
                  />
                  <div className="field-constraint">INT NOT NULL</div>
                </div>
                {(ingredientsByDish[`${currentMenuIndex}-${currentDishIndex}`] || []).map((entry, idx) => (
                  <div className="menu-entry ingredient-entry" key={idx}>
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
                          value={entry.ingredient_id}
                          onChange={e => handleIngredientInputChange(idx, e)}
                          required
                          className="ingredient-select"
                        >
                          <option value="">Select an ingredient</option>
                          {filteredIngredients.map(ingredient => (
                            <option key={ingredient.id} value={ingredient.id}>
                              {ingredient.name} - {ingredient.description}
                            </option>
                          ))}
                        </select>
                      </div>
                      {ingredientErrorsByDish[`${currentMenuIndex}-${currentDishIndex}`]?.[idx]?.ingredient_id && (
                        <div className="error-message">
                          {ingredientErrorsByDish[`${currentMenuIndex}-${currentDishIndex}`][idx].ingredient_id}
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
                            checked={entry.private}
                            onChange={e => handleIngredientInputChange(idx, e)}
                          />
                          <span className="slider"></span>
                        </label>
                        <span className="toggle-label">{entry.private ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="field-constraint">BOOLEAN NOT NULL</div>
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        name="description"
                        value={entry.description}
                        onChange={e => handleIngredientInputChange(idx, e)}
                      />
                      <div className="field-constraint">TEXT</div>
                    </div>
                    <button
                      type="button"
                      className="remove-ingredient-under-button"
                      onClick={() => {
                        const dishKey = `${currentMenuIndex}-${currentDishIndex}`;
                        const ingredientName = entry.ingredient_id
                          ? (filteredIngredients.find(i => i.id == entry.ingredient_id)?.name || 'this ingredient')
                          : 'this ingredient';
                        if (window.confirm(`Are you sure you want to remove ${ingredientName}?`)) {
                          const updated = [...(ingredientsByDish[dishKey] || [])];
                          updated.splice(idx, 1);
                          setIngredientsByDish({
                            ...ingredientsByDish,
                            [dishKey]: updated
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
              {/* Ingredients SQL Box - now to the side */}
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
            <button className="sql-button add-ingredient-button" type="button" onClick={() => {
              const dishKey = `${currentMenuIndex}-${currentDishIndex}`;
              const currentIngredients = ingredientsByDish[dishKey] || [];
              const currentErrors = ingredientErrorsByDish[dishKey] || [];
              
              setIngredientsByDish({
                ...ingredientsByDish,
                [dishKey]: [
                  ...currentIngredients,
                  { ingredient_id: '', private: false, description: '' }
                ]
              });
              
              setIngredientErrorsByDish({
                ...ingredientErrorsByDish,
                [dishKey]: [
                  ...currentErrors,
                  { ingredient_id: '', private: '', description: '' }
                ]
              });
            }}>
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