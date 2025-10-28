import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Ingredients.css';

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
    { id: 500013, name: 'Mustard' },
    { id: 500014, name: 'Allium' }
];

const diets = [
    { id: 600000, name: 'Vegetarian' },
    { id: 600001, name: 'Vegan' },
    { id: 600002, name: 'Pescatarian' },
    { id: 600003, name: 'Gluten Free' },
    { id: 600004, name: 'Lactose Free' },
    { id: 600005, name: 'Dairy Free' },
    { id: 600006, name: 'Fructose Free' }
];

// Mock ingredients data for the selection box (similar to ScreeningPage)
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

const Ingredients = ({ ingredients }) => {
    const navigate = useNavigate();
    const [ingredientsData, setIngredientsData] = useState([]);
    const [filteredIngredients, setFilteredIngredients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    // Form state for adding ingredient relationships
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [selectedAllergens, setSelectedAllergens] = useState([]);
    const [selectedDiets, setSelectedDiets] = useState([]);
    const [highlightedSql, setHighlightedSql] = useState('');

    // Get ingredient list (from props or mock data)
    const ingredientList = ingredients ? Object.values(ingredients) : mockIngredients;

    useEffect(() => {
        const raw = generateSQL();
        const html = Prism.highlight(raw, Prism.languages.sql, 'sql');
        setHighlightedSql(html);
    }, [showAddForm, selectedIngredients]);

    useEffect(() => {
        const fetchIngredientsData = async () => {
            try {
                const API_URL = `${import.meta.env.VITE_API_URL}/ingredients-allergens-diets`;
                const response = await fetch(API_URL);

                if (!response.ok) {
                    throw new Error('Failed to fetch ingredients data');
                }

                const data = await response.json();

                // Process the data to split comma-separated allergens and diets into arrays
                const processedData = data.map(item => ({
                    ingredient_name: item.ingredient_name,
                    allergens: item.allergens ? item.allergens.split(', ').filter(a => a.trim()) : [],
                    diets: item.diets ? item.diets.split(', ').filter(d => d.trim()) : []
                }));

                setIngredientsData(processedData);
                setFilteredIngredients(processedData);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch ingredients data:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchIngredientsData();
    }, []);

    useEffect(() => {
        // Filter ingredients based on search term
        const filtered = ingredientsData.filter(ingredient =>
            ingredient.ingredient_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredIngredients(filtered);
    }, [searchTerm, ingredientsData]);

    const handleScreeningsClick = () => {
        navigate('/dashboard');
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleAddButtonClick = () => {
        setShowAddForm(!showAddForm);
    };

    const addIngredient = () => {
        setSelectedIngredients([...selectedIngredients, { ingredient_id: '', allergens: [], diets: [] }]);
    };

    const updateIngredient = (index, field, value) => {
        const updated = [...selectedIngredients];
        updated[index] = { ...updated[index], [field]: value };
        setSelectedIngredients(updated);
    };

    const removeIngredient = (index) => {
        const updated = selectedIngredients.filter((_, i) => i !== index);
        setSelectedIngredients(updated);
    };

    const toggleAllergen = (ingredientIndex, allergenId) => {
        const updated = [...selectedIngredients];
        const currentAllergens = updated[ingredientIndex].allergens || [];

        if (currentAllergens.includes(allergenId)) {
            updated[ingredientIndex].allergens = currentAllergens.filter(id => id !== allergenId);
        } else {
            updated[ingredientIndex].allergens = [...currentAllergens, allergenId];
        }

        setSelectedIngredients(updated);
    };

    const toggleDiet = (ingredientIndex, dietId) => {
        const updated = [...selectedIngredients];
        const currentDiets = updated[ingredientIndex].diets || [];

        if (currentDiets.includes(dietId)) {
            updated[ingredientIndex].diets = currentDiets.filter(id => id !== dietId);
        } else {
            updated[ingredientIndex].diets = [...currentDiets, dietId];
        }

        setSelectedIngredients(updated);
    };

    const generateSQL = () => {
        let allergenValues = [];
        let dietValues = [];

        selectedIngredients.forEach(ingredient => {
            if (ingredient.ingredient_id) {
                // Add allergen relationships
                ingredient.allergens?.forEach(allergenId => {
                    allergenValues.push(`    (${ingredient.ingredient_id}, ${allergenId})`);
                });

                // Add diet relationships
                ingredient.diets?.forEach(dietId => {
                    dietValues.push(`    (${ingredient.ingredient_id}, ${dietId})`);
                });
            }
        });

        const allergenSQL = allergenValues.length > 0
            ? `INSERT INTO ingredient_allergen (ingredient_id, allergen_id) \nVALUES \n${allergenValues.join(',\n')}\nON DUPLICATE KEY UPDATE \n    ingredient_id = VALUES(ingredient_id),\n    allergen_id = VALUES(allergen_id);`
            : '-- No allergen relationships to insert';

        const dietSQL = dietValues.length > 0
            ? `INSERT INTO ingredient_diet (ingredient_id, diet_id) \nVALUES \n${dietValues.join(',\n')}\nON DUPLICATE KEY UPDATE \n    ingredient_id = VALUES(ingredient_id),\n    diet_id = VALUES(diet_id);`
            : '-- No diet relationships to insert';

        return `${allergenSQL}\n\n${dietSQL}`;
    };

    // Ingredient Selector Component (similar to ScreeningPage)
    const IngredientSelector = ({ selectedId, onChange, hasError }) => {
        const [searchTerm, setSearchTerm] = useState('');
        const [isOpen, setIsOpen] = useState(false);
        const [filtered, setFiltered] = useState(ingredientList);
        const containerRef = useRef(null);

        useEffect(() => {
            if (!searchTerm) {
                setFiltered(ingredientList);
            } else {
                setFiltered(ingredientList.filter(ingredient =>
                    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (ingredient.description && ingredient.description.toLowerCase().includes(searchTerm.toLowerCase()))
                ));
            }
        }, [searchTerm]);

        useEffect(() => {
            const handleClickOutside = (event) => {
                if (containerRef.current && !containerRef.current.contains(event.target)) {
                    setIsOpen(false);
                }
            };

            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

        const selectedIngredient = ingredientList.find(i => i.id == selectedId);
        const displayValue = selectedId && selectedIngredient
            ? `${selectedIngredient.name}`
            : searchTerm;

        return (
            <div
                ref={containerRef}
                className={`ingredient-select-container ${isOpen ? 'open' : ''} ${hasError ? 'error' : ''}`}
            >
                <input
                    type="text"
                    placeholder="Search ingredients..."
                    value={displayValue}
                    onChange={(e) => {
                        const value = e.target.value;
                        setSearchTerm(value);
                        if (selectedId && value !== displayValue) {
                            onChange('');
                        }
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    className="ingredient-search"
                />
                <div className="dropdown-arrow"></div>
                {isOpen && (
                    <div className="ingredient-dropdown">
                        {filtered.length > 0 ? (
                            filtered.map(option => (
                                <div
                                    key={option.id}
                                    className={`dropdown-item ${option.id == selectedId ? 'selected' : ''}`}
                                    onClick={() => {
                                        onChange(option.id);
                                        setSearchTerm('');
                                        setIsOpen(false);
                                    }}
                                >
                                    {option.name}
                                    <p className="ingredient-description">{option.description ? `${option.description}` : ''}</p>
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

    if (loading) {
        return (
            <div style={{ height: '100vh' }}>
                <div className="ingredients">
                    <div className="ingredients-header">
                        <div className="ingredients-titles">
                            <button
                                className="screenings-nav-button"
                                onClick={handleScreeningsClick}
                            >
                                Screenings
                            </button>
                            <span className="slash">/</span>
                            <h1 id='ingredients-title'>Ingredients</h1>
                        </div>
                    </div>
                    <div className="loading-message">Loading ingredients...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ height: '100vh' }}>
                <div className="ingredients">
                    <div className="ingredients-header">
                        <div className="ingredients-titles">
                            <button
                                className="screenings-nav-button"
                                onClick={handleScreeningsClick}
                            >
                                Screenings
                            </button>
                            <span className="slash">/</span>
                            <h1 id='ingredients-title'>Ingredients</h1>
                        </div>
                    </div>
                    <div className="error-message">Error: {error}</div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ height: '100vh' }}>
            <div className="ingredients">
                <div className="ingredients-header">
                    <div className="ingredients-titles">
                        <button
                            className="screenings-nav-button"
                            onClick={handleScreeningsClick}
                        >
                            Screenings
                        </button>
                        <span className="slash">/</span>
                        <h1 id='ingredients-title'>Ingredients</h1>
                    </div>
                </div>

                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search ingredients..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    <button
                        className="add-button"
                        onClick={handleAddButtonClick}
                        title="Add ingredient relationships"
                    >
                        +
                    </button>
                </div>

                <div className="ingredients-content">
                    {showAddForm ? (
                        <div className="add-form-container">
                            <div className="form-section">
                                <h3 style={{ marginBottom: '1.2rem', fontWeight: '400' }}>Add Ingredient Relationships</h3>

                                {selectedIngredients.map((ingredient, index) => (
                                    <div key={index} className="ingredient-form-group">
                                        <div className="ingredient-selector-group">
                                            <label>Ingredient</label>
                                            <IngredientSelector
                                                selectedId={ingredient.ingredient_id}
                                                onChange={(value) => updateIngredient(index, 'ingredient_id', value)}
                                                hasError={!ingredient.ingredient_id}
                                            />
                                            <button
                                                className="remove-ingredient-btn"
                                                onClick={() => removeIngredient(index)}
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        {/* Selected Allergens/Diets Section */}
                                        <div className="selected-section">
                                            <h4>Selected Allergens & Diets</h4>
                                            <div className="selected-tags">
                                                {ingredient.allergens?.map(allergenId => {
                                                    const allergen = allergens.find(a => a.id === allergenId);
                                                    return allergen ? (
                                                        <div key={allergenId} className="tag allergen-tag selected">
                                                            {allergen.name}
                                                        </div>
                                                    ) : null;
                                                })}
                                                {ingredient.diets?.map(dietId => {
                                                    const diet = diets.find(d => d.id === dietId);
                                                    return diet ? (
                                                        <div key={dietId} className="tag diet-tag selected">
                                                            {diet.name}
                                                        </div>
                                                    ) : null;
                                                })}
                                            </div>
                                        </div>

                                        {/* Allergens Selection */}
                                        <div className="selection-section">
                                            <h4>Allergens</h4>
                                            <div className="selection-grid">
                                                {allergens.map(allergen => (
                                                    <div
                                                        key={allergen.id}
                                                        className={`selection-box allergen-box ${ingredient.allergens?.includes(allergen.id) ? 'selected' : ''
                                                            }`}
                                                        onClick={() => toggleAllergen(index, allergen.id)}
                                                    >
                                                        {allergen.name}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Diets Selection */}
                                        <div className="selection-section">
                                            <h4>Diets</h4>
                                            <div className="selection-grid">
                                                {diets.map(diet => (
                                                    <div
                                                        key={diet.id}
                                                        className={`selection-box diet-box ${ingredient.diets?.includes(diet.id) ? 'selected' : ''
                                                            }`}
                                                        onClick={() => toggleDiet(index, diet.id)}
                                                    >
                                                        {diet.name}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button className="add-ingredient-btn" onClick={addIngredient}>
                                    Add Ingredient
                                </button>
                            </div>

                            <div className="query-section">
                                <h3 style={{ marginBottom: '1.2rem', fontWeight: '400' }}>Generated SQL</h3>
                                <div className="ing-code-box">
                                    <div className="code-box-header">
                                        <span className="code-box-label">sql</span>
                                        <div className="code-box-actions">
                                            <button className="copy-button" onClick={() => navigator.clipboard.writeText(generateSQL())}>
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
                        </div>
                    ) : (
                        <>
                            {filteredIngredients.length === 0 ? (
                                <div className="no-results">
                                    {searchTerm ? `No ingredients found matching "${searchTerm}"` : 'No ingredients available'}
                                </div>
                            ) : (
                                <div className="ingredients-grid">
                                    {filteredIngredients.map((ingredient, index) => (
                                        <div key={index} className="ingredient-container">
                                            <div className="ingredient-name">{ingredient.ingredient_name}</div>

                                            <div className="connections">
                                                {/* Allergens */}
                                                {ingredient.allergens.length > 0 && (
                                                    <div className="connection-group">
                                                        <div className="connection-line allergen-line"></div>
                                                        <div className="tags-container">
                                                            {ingredient.allergens.map((allergen, idx) => (
                                                                <div key={idx} className="tag allergen-tag">
                                                                    {allergen}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Diets */}
                                                {ingredient.diets.length > 0 && (
                                                    <div className="connection-group">
                                                        <div className="connection-line diet-line"></div>
                                                        <div className="tags-container">
                                                            {ingredient.diets.map((diet, idx) => (
                                                                <div key={idx} className="tag diet-tag">
                                                                    {diet}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Ingredients; 