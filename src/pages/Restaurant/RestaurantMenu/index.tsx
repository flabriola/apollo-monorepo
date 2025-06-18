import { useParams } from "react-router-dom";
import { useRestaurant } from "../RestaurantContext";
import { useEffect } from "react";
import { Preferences } from "../../../shared/restaurant/types";

function RestaurantMenu() {
    const { menuName, menuId } = useParams();
    const { restaurant, setPreferencesState, userPreferences, setUserPreferences } = useRestaurant();

    useEffect(() => {
        if (userPreferences && userPreferences.preferences && userPreferences.preferences.length > 0) {
            setPreferencesState("menu");
        } else {
            setPreferencesState("default");
        }
    }, [userPreferences]); 
    
    return (
        <div>
            <h1>Restaurant Menu: {restaurant.menus.find((menu: any) => menu.id === parseInt(menuId ?? "0"))?.name}</h1>
            <button onClick={() => {
                setUserPreferences({preferences: [Preferences.EGG]});
            }}>egg</button>
        </div>
    );
}

export default RestaurantMenu;