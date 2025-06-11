import { Navigate, Outlet, useParams } from "react-router-dom";
import { checkRestaurantExist } from "../../hooks/checkRestaurantExist";
import { RestaurantContext } from "./RestaurantContext";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import { fetchRestaurantData } from "../../hooks/restaurantData";
import type { RestaurantData } from "../../shared/restaurant/types";
import { useTranslation } from "react-i18next";

function Restaurant() {
    const { t } = useTranslation();

    // Context
    const { restaurantName } = useParams();
    const restaurantRoute = checkRestaurantExist(restaurantName?.toString() ?? "");
    const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);
    
    const [isLoading, setIsLoading] = useState(true);

    // Return 404 component if restaurant is not found
    if (!restaurantRoute) {
        return <Navigate to="/404" />;
    }

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchRestaurantData(restaurantRoute?.route ?? "");
                setRestaurant(data);
                setIsLoading(false);
            } catch (error) {
                console.error(t("error.fetchingRestaurantData"), error);
                // TODO: Add error handling to display error message to users
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    // Loading Screen else Restaurant Context
    if (isLoading) {
        return <Loading restaurantRoute={restaurantRoute} />;
    } else {
        return (
            <RestaurantContext.Provider value={restaurant}>
                <Outlet />
            </RestaurantContext.Provider>
        );
    }
}

export default Restaurant;