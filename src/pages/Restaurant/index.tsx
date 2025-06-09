import { Navigate, Outlet, useParams } from "react-router-dom";
import { checkRestaurantExist } from "../../hooks/checkRestaurantExist";
import { RestaurantContext } from "./ResturantContext";


function Restaurant() {
    
    const { restaurantName } = useParams();
    const restaurant = checkRestaurantExist(restaurantName?.toString() ?? "");

    // Return 404 component if restaurant is not found
    if (!restaurant) {
        return <Navigate to="/404" />;
    }
    
    return (
        <RestaurantContext.Provider value={restaurant}>
            <Outlet />
        </RestaurantContext.Provider>
    );
}

export default Restaurant;