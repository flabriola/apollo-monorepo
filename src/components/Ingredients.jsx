import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Ingredients.css';

const Ingredients = () => {
  const navigate = useNavigate();
  const [ingredientsData, setIngredientsData] = useState([]);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        </div>

        <div className="ingredients-content">
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
        </div>
      </div>
    </div>
  );
};

export default Ingredients; 