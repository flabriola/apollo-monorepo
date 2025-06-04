import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import RestaurantHome from './pages/Restaurant/RestaurantHome';
import Home from './pages/Home';
import RestaurantMenu from './pages/Restaurant/RestaurantMenu';
import Restaurant from './pages/Restaurant';


function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/:restaurantName" element={<Restaurant />}>
          <Route path="" element={<RestaurantHome />} />
          <Route path="menu" element={<RestaurantMenu />} />
          <Route path="menu/:menuId" element={<RestaurantMenu />} />
        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;
