import { useTranslation } from "react-i18next";
import { Container, Title, Subtitle } from "./styles";
import { MainContainer } from "./styles";
import { useRestaurant } from "../../pages/Restaurant/RestaurantContext";
import { Preferences } from "../../shared/restaurant/types";
import { getPreferenceIcon } from "../../hooks/getPreferenceIcon";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function PreferencesFooterButton() {

    const { preferencesState, userPreferences, restaurantRoute, setDisclaimer } = useRestaurant();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [animate, setAnimate] = useState(false);

    const states = {
        default: {
            title: t("preferencesFooterButton.default_title"),
            subtitle: t("preferencesFooterButton.default_subtitle"),
        },
        preferences: {
            title: t("preferencesFooterButton.preferences_title"),
            subtitle: t("preferencesFooterButton.preferences_subtitle"),
        },
        preferences_with_selection: {
            title: t("preferencesFooterButton.preferences_with_selection_title"),
            subtitle: t("preferencesFooterButton.preferences_with_selection_subtitle"),
        },
        menu: {
            title: t("preferencesFooterButton.menu_title"),
            subtitle: t("preferencesFooterButton.menu_subtitle"),
        }
    }

    const handleClick = () => {
        if (window.matchMedia('(hover: none)').matches) {
            // Only run on mobile (touch devices)
            setAnimate(false);
            requestAnimationFrame(() => setAnimate(true));
            setTimeout(() => setAnimate(false), 1300);
          }

        if (preferencesState === "default" || preferencesState === "menu") {
            navigate(`/${restaurantRoute.route}/preferences`);
        } else if (preferencesState === "preferences" || preferencesState === "preferences_with_selection") {

            if (userPreferences?.preferences?.length > 0 && preferencesState === "preferences_with_selection") {
                setDisclaimer(true);
            } else {
                setDisclaimer(false);
            }

            navigate(`/${restaurantRoute.route}/menu`);
        }
    }


    if (preferencesState === "default") {
        return (
            <MainContainer>
                <Container animate={animate} onClick={handleClick}>
                    <Title key={states.default.title}>
                        {states.default.title}
                    </Title>
                    <Subtitle key={states.default.subtitle}>
                        {states.default.subtitle}
                    </Subtitle>
                </Container>
            </MainContainer>
        );
    } else if (preferencesState === "preferences") {
        return (
            <MainContainer>
                <Container animate={animate} onClick={handleClick}>
                    <Title key={states.preferences.title}>
                        {states.preferences.title}
                    </Title>
                    <Subtitle key={states.preferences.subtitle}>
                        {states.preferences.subtitle}
                    </Subtitle>
                </Container>
            </MainContainer>
        );
    } else if (preferencesState === "preferences_with_selection") {
        return (
            <MainContainer>
                <Container animate={animate} onClick={handleClick}>
                    <Title key={states.preferences_with_selection.subtitle}>
                        {states.preferences_with_selection.subtitle}
                        {userPreferences?.preferences?.map((preference: Preferences) => {
                            return (
                                getPreferenceIcon(preference, 15, 'var(--color-negative)')
                            )
                        })}
                    </Title>
                    <Subtitle key={states.preferences_with_selection.title}>
                        {states.preferences_with_selection.title}
                    </Subtitle>
                </Container>
            </MainContainer>
        );
    } else if (preferencesState === "menu") {
        return (
            <MainContainer>
                <Container animate={animate} onClick={handleClick}>
                    <Title key={states.menu.subtitle}>
                        {states.menu.subtitle}
                        {userPreferences?.preferences?.map((preference: Preferences) => {
                            return (
                                getPreferenceIcon(preference, 15, 'var(--color-negative)')
                            )
                        })}
                    </Title>
                    <Subtitle key={states.menu.title}>
                        {states.menu.title}
                    </Subtitle>
                </Container>
            </MainContainer>
        );
    }
}

export default PreferencesFooterButton;

