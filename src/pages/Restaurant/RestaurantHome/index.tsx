import { Link } from 'react-router-dom';
import { useRestaurant } from '../RestaurantContext';

function RestaurantHome() {
    const restaurant = useRestaurant();
    const restaurantRoute = useRestaurant();

    // Use restaurantName to fetch data from your API
    return (
        <>
            <div>Restaurant: {restaurant.name}</div>
        </>
    );
}

export default RestaurantHome;