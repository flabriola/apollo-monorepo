import { useEffect, useState } from "react";
import LineButton from '../../../components/Buttons/LineButton';
import { useRestaurant } from '../RestaurantContext';
import { Text, Menu, MenuTitleContainer, Restaurant, ContainerN, MainContainerN, MenuListHomeN, MenuListContainerHomeN, MenuListBackgroundHomeN } from './styles';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function RestaurantHome() {
    const { t } = useTranslation();
    const { restaurant, restaurantRoute, setPreferencesState, setMenu } = useRestaurant();
    const navigate = useNavigate();
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
        navigate(`/${restaurantRoute?.route}/menu`);
    };

    useEffect(() => {
        setPreferencesState("default");
    }, []);

    return (
        <>
            <MainContainerN>
                <ContainerN>
                    <Restaurant src={restaurant.logo_url} alt={restaurant.name} />
                    <MenuTitleContainer>
                        <Text>{t('restaurantHome.title')}</Text>
                        <LineButton style={{ zIndex: menuListOpen ? 100 : 0 }} isOpen={menuListOpenX} />
                    </MenuTitleContainer>
                </ContainerN>
            </MainContainerN>

            <MainContainerN style={{ zIndex: menuListOpen ? 100 : 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh' }}>
                <ContainerN>
                    <Restaurant src={restaurant.logo_url} alt={restaurant.name} style={{ opacity: 0 }} />
                    <MenuTitleContainer>

                        {menuListOpen &&
                            <MenuListContainerHomeN>
                                <MenuListHomeN className={isClosing ? 'closing' : ''}>
                                    {restaurant.menu_list.map((menu: any) => {
                                        return (
                                            <Menu key={menu.id} onClick={() => handleMenuClick(menu.id)} style={{ zIndex: 1000 }}>{menu.name}</Menu>
                                        )
                                    })}
                                </MenuListHomeN>
                            </MenuListContainerHomeN>
                        }

                        <Text onClick={handleMenuListOpen} style={{ opacity: 0 }}>{t('restaurantHome.title')}</Text>
                        <LineButton onClick={handleMenuListOpen} style={{ zIndex: menuListOpen ? 100 : 0 }} isOpen={menuListOpenX} />
                    </MenuTitleContainer>
                </ContainerN>
            </MainContainerN>



            {menuListOpen && <MenuListBackgroundHomeN className={isClosing ? 'closing' : ''} />}
        </>
    );
}

export default RestaurantHome;