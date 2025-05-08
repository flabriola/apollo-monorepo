import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/ScreeningPage.css';
import Prism from 'prismjs';
import 'prismjs/components/prism-sql';
import 'prismjs/themes/prism.css';

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
    { name: '', description: '', active: true, pdf: '' }
  ]);
  const [menuErrors, setMenuErrors] = useState([
    { name: '', description: '', active: '', pdf: '' }
  ]);
  const [showMenuSqlBox, setShowMenuSqlBox] = useState(true);
  const [highlightedMenuSql, setHighlightedMenuSql] = useState('');

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

  // Add a new menu entry
  const addMenu = () => {
    setMenus([...menus, { name: '', description: '', active: true, pdf: '' }]);
    setMenuErrors([...menuErrors, { name: '', description: '', active: '', pdf: '' }]);
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
  }, [showMenuSqlBox, menus]);

  // Toggle menu SQL box
  const toggleMenuSqlBox = () => {
    if (!showMenuSqlBox) validateAllMenus();
    setShowMenuSqlBox(!showMenuSqlBox);
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
        {/* Section 2: Menu */}
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
              {menus.map((menu, idx) => (
                <div className="menu-entry" key={idx} style={{marginBottom: '2rem', paddingBottom: '2rem'}}>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={menu.name}
                      onChange={e => handleMenuInputChange(idx, e)}
                      maxLength={255}
                      required
                    />
                    {menuErrors[idx]?.name && <div className="error-message">{menuErrors[idx].name}</div>}
                    <div className="field-constraint">VARCHAR(255) NOT NULL</div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={menu.description}
                      onChange={e => handleMenuInputChange(idx, e)}
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
                          checked={menu.active}
                          onChange={e => handleMenuInputChange(idx, e)}
                        />
                        <span className="slider"></span>
                      </label>
                      <span className="toggle-label">{menu.active ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="field-constraint">BOOLEAN NOT NULL</div>
                  </div>
                  <div className="form-group">
                    <label>PDF URL</label>
                    <input
                      type="text"
                      name="pdf"
                      value={menu.pdf}
                      onChange={e => handleMenuInputChange(idx, e)}
                      maxLength={512}
                    />
                    {menuErrors[idx]?.pdf && <div className="error-message">{menuErrors[idx].pdf}</div>}
                    <div className="field-constraint">VARCHAR(512)</div>
                  </div>
                </div>
              ))}
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
        <div className="section-actions">
          <button className="sql-button" type="button" onClick={addMenu}>+ Add Menu</button>
          <button className="sql-button" type="button" onClick={toggleMenuSqlBox} style={{ marginLeft: '1rem' }}>
            {showMenuSqlBox ? 'Hide SQL' : 'Show SQL'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScreeningPage; 