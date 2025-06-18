import { useEffect, useState } from "react";
import LineButton from '../../../components/Buttons/LineButton';
import { useRestaurant } from '../RestaurantContext';
import { Container, MainContainer, RestaurantLogo, RightContainer, Text, LeftContainer, MenuList, Menu, MenuListContainer, MenuListBackground } from './styles';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import flamingoImage from '../../../assets/icons/flamingoroom10-1100x1540.jpg';
import menuImg from '../../../assets/icons/menu_test.png';

function RestaurantHome() {
    const { t } = useTranslation();
    const { restaurant, restaurantRoute, setPreferencesState } = useRestaurant();
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
        const menu = restaurant.menus.find((menu: any) => menu.id === menuId);
        navigate(`/${restaurantRoute?.route}/menu/${menu.name.toLowerCase().replace(/ /g, '-')}/${menu.id}`);
    };

    useEffect(() => {
        setPreferencesState("default");
    }, []);

    return (
        <>
            {/* <MainContainer style={{ backgroundImage: `url(${flamingoImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}> */}
            {/* <MainContainer style={{ backgroundImage: `url(${menuImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}> */}
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
                                    <Menu key={menu.id} onClick={() => handleMenuClick(menu.id)} style={{ zIndex: 1000 }}>{menu.name}</Menu>
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