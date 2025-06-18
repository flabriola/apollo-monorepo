import { useEffect } from "react";
import { useRestaurant } from "../RestaurantContext";
import { Preferences } from "../../../shared/restaurant/types";


function PreferencesSelector() {

    const { preferencesState, setPreferencesState, userPreferences, setUserPreferences } = useRestaurant();

    useEffect(() => {
        if (userPreferences && userPreferences.preferences && userPreferences.preferences.length > 0) {
            setPreferencesState("preferences_with_selection");
        } else {
            setPreferencesState("preferences");
        }
    }, [userPreferences]);
    
    return (
        <div>
            <h1>Preferences</h1>
            <button onClick={() => {
                setUserPreferences({preferences: [Preferences.EGG]});
            }}>egg</button>
        </div>
    );
}  

export default PreferencesSelector;