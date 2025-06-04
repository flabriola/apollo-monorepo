import { Link, useParams } from 'react-router-dom';
import { checkRestaurantExist } from '../../../hooks/checkRestaurantExist';
import NotFound from '../../../components/Restaurant/NotFound';
import { useRestaurant } from '../ResturantContext';

function RestaurantHome() {
    const restaurant = useRestaurant();

    // Use restaurantName to fetch data from your API
    return (
        <>
            <div>2 Restaurant: {restaurant.name}</div>
            <Link to={`/${restaurant.route}/menu`}>Menu</Link>
        </>
    );
}

export default RestaurantHome;