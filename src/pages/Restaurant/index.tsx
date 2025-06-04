import { Outlet, useParams } from "react-router-dom";
import NotFound from "../../components/Restaurant/NotFound";
import { checkRestaurantExist } from "../../hooks/checkRestaurantExist";
import { RestaurantContext } from "./ResturantContext";


function Restaurant() {
    
    const { restaurantName } = useParams();
    const restaurant = checkRestaurantExist(restaurantName?.toString() ?? "");

    // Return 404 component if restaurant is not found
    if (!restaurant) {
        return <NotFound />;
    }
    
    return (
        <RestaurantContext.Provider value={restaurant}>
            <Outlet />
        </RestaurantContext.Provider>
    );
}

export default Restaurant;