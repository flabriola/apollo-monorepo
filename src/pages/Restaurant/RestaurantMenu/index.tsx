import { useRestaurant } from "../RestaurantContext";
import { useEffect, useState } from "react";
import { MainContainer, HeaderContainer, MenuListBackground, MenuListContainer, MenuList, Menu, HeaderTitle, MenuContainer, Container, HeaderContent } from "./styles";
import { LineButton } from "../../../components/Buttons/LineButton";
import { useNavigate } from "react-router-dom";
import MenuOverlay from "../../../components/MenuOverlay";
import PreferencesDisclaimer from "../../../components/PreferencesDisclaimer";

function RestaurantMenu() {

    const { restaurant, setPreferencesState, userPreferences, setMenu, menu, restaurantRoute, disclaimer } = useRestaurant();
    const navigate = useNavigate();

    const [filteredIds, setFilteredIds] = useState<{ dishId: string, preferenceIds: string[] }[]>([]);
    const [menuListOpen, setMenuListOpen] = useState(false);
    const [menuListOpenX, setMenuListOpenX] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const handleMenuListOpen = () => {
        if (menuListOpen) {
            setIsClosing(true);
            setMenuListOpenX(false);
            setTimeout(() => {
                setMenuListOpen(false);
                setIsClosing(false);
            }, 500); // Match the animation duration
        } else {
            setMenuListOpen(true);
            setMenuListOpenX(true);
        }
    };

    const handleMenuClick = (menuId: string) => {
        setMenu(restaurant.menus[parseInt(menuId)]);
        handleMenuListOpen();
    };

    useEffect(() => {
        if (userPreferences && userPreferences.preferences && userPreferences.preferences.length > 0) {
            setPreferencesState("menu");
        } else {
            setPreferencesState("default");
        }
    }, [userPreferences]);

    // Apply preferences to the menu
    // TODO: Consider including reasong for CC, and ingredient triggering preference.
    useEffect(() => {
        const applyPreferences = () => {
            let dishesToFilter: { dishId: string, preferenceIds: string[] }[] = [];
            if (userPreferences && userPreferences.preferences && userPreferences.preferences.length > 0) {
                // For every menu
                if (restaurant.menus) {
                    Object.values(restaurant.menus).forEach((menu: any) => {
                        if (menu.dishes) {
                            // For every dish
                            Object.entries(menu.dishes).forEach(([dishId, dish]: [string, any]) => {
                                // If the dish's diets, allergens, or cross-contaminations include any of the user's preferences,
                                // add the id of the dish and id of the allergen and/or diet to filteredIds
                                // ensure that if the dish has multiple diets, allergens, or cross-contaminations (which is same as allergen)
                                // that the dish id is only added once to filteredIds but the preferenceIds are added for each allergen and/or diet
                                // the fields for diets and allergens triggeerd in the dish can be found in:
                                // dish.diets.id
                                // dish.allergens.id
                                // dish.cross_contaminations.allergen
                                // diets, allergens and cross_contaminations are arrays which may be null
                                // add to filteredIds if the dish has any of the user's preferences
                                let preferenceIds: string[] = [];

                                // Check diets
                                if (dish.diets) {
                                    dish.diets.forEach((diet: any) => {
                                        if (userPreferences.preferences.includes(diet.id)) {
                                            preferenceIds.push(diet.id.toString());
                                        }
                                    });
                                }

                                // Check allergens
                                if (dish.allergens) {
                                    dish.allergens.forEach((allergen: any) => {
                                        if (userPreferences.preferences.includes(allergen.id)) {
                                            preferenceIds.push(allergen.id.toString());
                                        }
                                    });
                                }

                                // Check cross contaminations
                                if (dish.cross_contaminations) {
                                    dish.cross_contaminations.forEach((contamination: any) => {
                                        if (userPreferences.preferences.includes(contamination.allergen)) {
                                            preferenceIds.push(contamination.allergen.toString());
                                        }
                                    });
                                }

                                // If we found any matching preferences, add this dish to filtered list
                                if (preferenceIds.length > 0) {
                                    dishesToFilter.push({
                                        dishId: dishId,
                                        preferenceIds: preferenceIds
                                    });
                                }
                            });
                        }
                    });
                }
            }
            setFilteredIds(dishesToFilter);
        }
        applyPreferences();
    }, [userPreferences]);

    return (
        <MainContainer>
            <Container>
                <HeaderContainer>
                    <HeaderContent>
                        <HeaderTitle onClick={() => navigate(`/${restaurantRoute?.route}`)}>←</HeaderTitle>
                        <LineButton onClick={handleMenuListOpen} style={{ zIndex: menuListOpen ? 100 : 0 }} isOpen={menuListOpenX} />
                    </HeaderContent>
                </HeaderContainer>

                <MenuContainer>
                    <MenuOverlay menu_overlay={menu.menu_overlay} filteredIds={filteredIds} menu={menu}/>
                </MenuContainer>
            </Container>

            {disclaimer && <PreferencesDisclaimer />}

            {menuListOpen && (
                <>
                    <MenuListBackground className={isClosing ? 'closing' : ''} />
                    <MenuListContainer>
                        <MenuList className={isClosing ? 'closing' : ''}>
                            {restaurant.menu_list.map((menu: any) => {
                                return (
                                    <Menu key={menu.id} onClick={() => handleMenuClick(menu.id)} style={{ zIndex: 1000 }}>{menu.name}</Menu>
                                )
                            })}
                        </MenuList>
                    </MenuListContainer>
                </>
            )}

        </MainContainer>
    );
}

export default RestaurantMenu;