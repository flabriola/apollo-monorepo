import { LogoIcon } from "../../assets/icons";
import { MainContainer, TextContainer, Text, BackgroundBlur } from "./styles";
import { useTranslation } from "react-i18next";
import { useRestaurant } from "../../pages/Restaurant/RestaurantContext";
import { Preferences, getPreferencesNames } from "../../shared/restaurant/types";
import { useState } from "react";

function PreferencesDisclaimer() {
    const { t } = useTranslation();
    const { userPreferences, setDisclaimer } = useRestaurant();
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        // Wait for animation to complete before setting disclaimer to false
        setTimeout(() => {
            setDisclaimer(false);
        }, 700); // Match the fadeOut animation duration
    };

    const formatList = (items: string[]) => {
        if (items.length === 0) return "";
        if (items.length === 1) return items[0];
        if (items.length === 2) return `${items[0]} ${t('preferences_disclaimer.and')} ${items[1]}`;
        return `${items.slice(0, -1).join(", ")} ${t('preferences_disclaimer.and')} ${items[items.length - 1]}`;
    }

    const getDescription = () => {
        let text = t('preferences_disclaimer.main_one');
        let allergens: Preferences[] = [];
        let diets: Preferences[] = [];

        userPreferences.preferences.forEach((preference: Preferences) => {
            if (preference >= 500000 && preference < 600000) {
                allergens.push(preference);
            } else {
                diets.push(preference);
            }
        });

        let allergensText = allergens.length > 0 ? ` ${t('preferences_disclaimer.main_allergen')} ${formatList(allergens.map((preference: Preferences) => getPreferencesNames()[preference])).toLowerCase()}` : '';
        let dietsText = diets.length > 0 ? ` ${t('preferences_disclaimer.main_diet_start')} ${formatList(diets.map((preference: Preferences) => getPreferencesNames()[preference])).toLowerCase()} ${t('preferences_disclaimer.main_diet_end')}` : '';

        text += allergensText && dietsText ? `${allergensText} ${t('preferences_disclaimer.and')} ${dietsText}` : allergensText || dietsText;
        return `${text}.`;
    }

    return (
        <>
            <BackgroundBlur className={isClosing ? 'closing' : ''} onClick={handleClose}/>
            <MainContainer className={isClosing ? 'closing' : ''}onClick={handleClose}>
                <LogoIcon size={46} />
                <TextContainer>
                    <Text style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                        {getDescription()}
                    </Text>
                    <Text style={{ fontSize: 'var(--font-size-sm)', marginTop: '1.8rem' }}>
                        {t('preferences_disclaimer.advice')}
                    </Text>
                    <Text style={{ fontSize: 'var(--font-size-xs)'}}>
                        {t('preferences_disclaimer.disclaimer')}
                    </Text>
                </TextContainer>
            </MainContainer>
        </>
    );
}

export default PreferencesDisclaimer;