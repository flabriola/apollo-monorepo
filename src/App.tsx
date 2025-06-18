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
import NotFound from './pages/NotFound';
import MainLayout from './pages/MainLayout';
import PreferencesSelector from './pages/Restaurant/Preferences';

function App() {
  return (
    <Router>
      <Routes>  

        <Route path="" element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/404" element={<NotFound />} />
        </Route>

        <Route path="/:restaurantName" element={<Restaurant />}>
          <Route path="preferences" element={<PreferencesSelector />} />
          <Route path="" element={<RestaurantHome />} />
          <Route path="menu" element={<RestaurantMenu />} />
          <Route path="menu/:menuName/:menuId" element={<RestaurantMenu />} />
        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;
