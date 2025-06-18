import { Navigate, Outlet, useParams } from "react-router-dom";
import { checkRestaurantExist } from "../../hooks/checkRestaurantExist";
import { RestaurantContext } from "./RestaurantContext";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import { fetchRestaurantData } from "../../hooks/restaurantData";
import type { RestaurantData, UserPreferences } from "../../shared/restaurant/types";
import { useTranslation } from "react-i18next";
import PreferencesFooterButton from "../../components/PreferencesFooterButton";

type PreferencesStates = "default" | "preferences" | "preferences_with_selection" | "menu";

function Restaurant() {

    const { t } = useTranslation();

    // Context
    const { restaurantName } = useParams();
    const restaurantRoute = checkRestaurantExist(restaurantName?.toString() ?? "");
    const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);

    // UI
    const [isLoading, setIsLoading] = useState(true);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [minLoadingTimePassed, setMinLoadingTimePassed] = useState(false);

    // Preferences
    const [preferencesState, setPreferencesState] = useState<PreferencesStates>("default");
    const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);

    // Return 404 component if restaurant is not found
    if (!restaurantRoute) {
        return <Navigate to="/404" />;
    }

    // Set minimum loading time of 2 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setMinLoadingTimePassed(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchRestaurantData(restaurantRoute?.route ?? "");
                setRestaurant(data);
                setDataLoaded(true);
            } catch (error) {
                console.error(t("error.fetchingRestaurantData"), error);
                // TODO: Add error handling to display error message to users
                setDataLoaded(true);
            }
        }
        fetchData();
    }, []);

    // Only stop loading when both conditions are met
    useEffect(() => {
        if (minLoadingTimePassed && dataLoaded) {
            // Dispatch event to trigger fade-out animation
            window.dispatchEvent(new Event('restaurantDataLoaded'));
            // Wait for animation to complete before unmounting
            setTimeout(() => {
                setIsLoading(false);
            }, 200);
        }
    }, [minLoadingTimePassed, dataLoaded]);

    // Loading Screen else Restaurant Context
    if (isLoading) {
        return <Loading restaurantRoute={restaurantRoute} />;
    } else {
        return (
            <RestaurantContext.Provider
                value={{
                    restaurant,
                    restaurantRoute,
                    preferencesState,
                    setPreferencesState,
                    userPreferences,
                    setUserPreferences
                }}>
                <PreferencesFooterButton />
                <Outlet />
            </RestaurantContext.Provider>
        );
    }
}

export default Restaurant;