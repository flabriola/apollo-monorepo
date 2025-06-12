import { useState } from "react";
import LineButton from '../../../components/Buttons/LineButton';
import { useRestaurant } from '../RestaurantContext';
import { Container, MainContainer, RestaurantLogo, RightContainer, Text, LeftContainer, MenuList, Menu, MenuListContainer, MenuListBackground } from './styles';
import { useTranslation } from 'react-i18next';


function RestaurantHome() {
    const { t } = useTranslation();
    const { restaurant } = useRestaurant();

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

    return (
        <>
            <MainContainer>
                <Container>
                    <LeftContainer>
                        <RestaurantLogo src={restaurant.logo_url} alt={restaurant.name} />
                    </LeftContainer>
                    <RightContainer>
                        <Text style={{ fontSize: t('restaurantHome.title').length > 5 ? 'var(--font-size-2xl)' : '' }}>{t('restaurantHome.title')}</Text>
                        <LineButton onClick={handleMenuListOpen} style={{ zIndex: menuListOpen ? 100 : 0 }} isOpen={menuListOpenX} />
                    </RightContainer>
                </Container>
            </MainContainer>

            {menuListOpen && (
                <>
                    <MenuListBackground className={isClosing ? 'closing' : ''} />
                    <MenuListContainer>
                        <MenuList className={isClosing ? 'closing' : ''}>
                            {restaurant.menu_list.map((menu: any) => {
                                return (
                                    <Menu key={menu.id}>{menu.name}</Menu>
                                )
                            })}
                        </MenuList>
                    </MenuListContainer>
                </>
            )}
        </>
    );
}

export default RestaurantHome;