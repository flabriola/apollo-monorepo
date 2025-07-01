import { LogoIcon } from "../../assets/icons";
import { MainContainer, TextContainer, Text, BackgroundBlur, Close } from "./styles";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useRestaurant } from "../../pages/Restaurant/RestaurantContext";
import type { RestaurantData, Preferences } from "../../shared/restaurant/types";
import { getPreferenceIcon } from "../../hooks/getPreferenceIcon";

function DishDetails({ dishDetails, setDishDetails, menu }: { dishDetails: string | null, setDishDetails: (dishDetails: string | null) => void, menu: RestaurantData["menus"] }) {
    const { t } = useTranslation();
    const [isClosing, setIsClosing] = useState(false);
    const dish = menu.dishes[parseInt(dishDetails as string)];
    const { userPreferences } = useRestaurant();
    const dishPreferences = userPreferences.preferences.filter((preference: Preferences) =>
        dish.allergens.some((allergen: any) => allergen.id === preference) ||
        dish.diets.some((diet: any) => diet.id === preference) ||
        dish.cross_contaminations.some((cross_contamination: any) => cross_contamination.allergen === preference)
    );

    const handleClose = () => {
        setIsClosing(true);
        // Wait for animation to complete before setting disclaimer to false
        setTimeout(() => {
            setDishDetails(null);
        }, 700); // Match the fadeOut animation duration
    };


    return (
        <>
            <Close onClick={handleClose} />
            <BackgroundBlur className={isClosing ? 'closing' : ''} onClick={handleClose} />
            <MainContainer className={isClosing ? 'closing' : ''} onClick={handleClose}>
                <LogoIcon size={46} />
                <TextContainer>
                    <Text style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-lg)' }}>
                        {dish.name}
                        {dishPreferences.map((preference: Preferences) => getPreferenceIcon(preference, 13, "var(--color-negative)"))}
                    </Text>
                    <Text>
                        {dish.description}
                    </Text>
                    {dishPreferences.length > 0 &&
                        <Text style={{ fontSize: '0.65rem', marginTop: '0.8rem', color: 'var(--color-negative)' }}>
                            {t('dish_details.disclaimer')}
                        </Text>
                    }
                </TextContainer>
            </MainContainer>
        </>
    );
}

export default DishDetails;