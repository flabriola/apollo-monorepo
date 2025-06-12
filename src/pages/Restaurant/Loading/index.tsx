import { LogoName, LogoSlogan } from "../../../assets/icons";
import type { RestaurantRoute } from "../../../shared/restaurant/types";
import { LoadingContainer, LoadingFooter, Text } from "./styles";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TextContainer } from "../../NotFound/styles";
import LoadingBar from "../../../components/LoadingBar";
import { useEffect, useState } from "react";

function Loading({ restaurantRoute }: { restaurantRoute: RestaurantRoute }) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Listen for the restaurant data being loaded
        const handleBeforeUnmount = () => {
            setIsExiting(true);
            // Wait for animation to complete before unmounting
            return new Promise(resolve => setTimeout(resolve, 200));
        };

        // Add the event listener
        window.addEventListener('restaurantDataLoaded', handleBeforeUnmount);

        return () => {
            window.removeEventListener('restaurantDataLoaded', handleBeforeUnmount);
        };
    }, []);
    
    return (
        <LoadingContainer className={isExiting ? 'fade-out' : ''}>
            <TextContainer>
                <Text>
                    {t("loading.title")} {restaurantRoute.name}...
                </Text>
            </TextContainer>
            <LoadingBar style={{ marginTop: "2rem", position: "fixed", top: "0" }}/>
            <LoadingFooter onClick={() => navigate("/")}>
                <LogoName /> | <LogoSlogan />
            </LoadingFooter>
        </LoadingContainer>
    );
}

export default Loading;