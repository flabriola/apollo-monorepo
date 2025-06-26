import { Navigate, Outlet, useParams } from "react-router-dom";
import { checkRestaurantExist } from "../../hooks/checkRestaurantExist";
import { RestaurantContext } from "./RestaurantContext";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import { fetchRestaurantData } from "../../hooks/restaurantData";
import type { RestaurantData, UserPreferences } from "../../shared/restaurant/types";
import { useTranslation } from "react-i18next";
import PreferencesFooterButton from "../../components/PreferencesFooterButton";
import { useSearchParams } from "react-router-dom";


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
    const [searchParams, setSearchParams] = useSearchParams();

    // Menu
    const [menu, setMenu] = useState<RestaurantData["menus"] | null>(null);
    const [disclaimer, setDisclaimer] = useState<boolean>(false);

    // Return 404 component if restaurant is not found
    if (!restaurantRoute) {
        return <Navigate to="/404" />;
    }

    const preloadImages = (urls: string[]) => {
        urls.forEach((url) => {
          const img = new Image();
          img.src = url;
        });
      };

    // Set user preferences from search params
    useEffect(() => {
        const preferences = searchParams.get("preferences");

        const initialPreferences: UserPreferences = {
            preferences: preferences ? preferences.split(",").map(pref => parseInt(pref)) : []
        };

        setUserPreferences(initialPreferences);
    }, []);

    // Update search params when user preferences change
    useEffect(() => {
        if (!userPreferences) return;

        const current = searchParams.get("preferences");
        const joined = userPreferences.preferences?.join(",");

        if (current !== joined) {
            setSearchParams({ preferences: joined });
        }
    }, [userPreferences]);

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

                // Preload images used in app to make them faster because fuck mediocricy and just letting things be slow
                const imageUrls = Object.values(data.menus).map((menu: any) => menu.menu_overlay?.image).filter(Boolean);
                imageUrls.push(data.logo_url);

                preloadImages(imageUrls);
                
                // Get first active menu from menu list
                const firstActiveMenu = Object.values(data.menus).find((menu: any) => menu.active);
                if (firstActiveMenu) {
                    setMenu(firstActiveMenu);
                }
                
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
                    setUserPreferences,
                    menu,
                    setMenu,
                    disclaimer,
                    setDisclaimer
                }}>
                <PreferencesFooterButton />
                <Outlet />
            </RestaurantContext.Provider>
        );
    }
}

export default Restaurant;