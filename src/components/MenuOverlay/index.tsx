import React, { useEffect, useState } from 'react';
import { Wrapper, MenuImage, Rectangle, Icons, Icon } from './styles';
import { getPreferenceIcon } from '../../hooks/getPreferenceIcon';
import type { Preferences, RestaurantData } from '../../shared/restaurant/types';
import DishDetails from '../DishDetails';

function MenuOverlay({
    menu_overlay,
    filteredIds,
    menu,
}: {
    menu_overlay: {
        image: string;
        width: number;
        height: number;
        rectangles: { id: string; width: number; height: number; left: number; top: number }[];
        color: string;
    }
    filteredIds: { dishId: string, preferenceIds: string[] }[];
    menu: RestaurantData["menus"][number];
}) {
    const { image, width, height, rectangles, color } = menu_overlay;
    const [key, setKey] = useState(0);
    const [dishDetails, setDishDetails] = useState<string | null>(null);

    // Force re-render when menu_overlay changes
    useEffect(() => {
        setKey(prev => prev + 1);
    }, [menu_overlay]);
    
    return (
        <Wrapper key={key} baseWidth={width} baseHeight={height}>
            <MenuImage src={image} />
            {rectangles.map(({ id, ...rect }) => (
                <React.Fragment key={id}>
                    <Rectangle
                        {...rect}
                        blocked={filteredIds.some((item) => item.dishId === id)}
                        style={{
                            left: `${(rect.left / width) * 100}%`,
                            top: `${(rect.top / height) * 100}%`,
                            width: `${(rect.width / width) * 100}%`,
                            height: `${(rect.height / height) * 100}%`,
                            backgroundColor: color,
                        }}
                    />
                    <Icons
                        {...rect}
                        blocked={filteredIds.some((item) => item.dishId === id)}
                        style={{
                            left: `${(rect.left / width) * 100}%`,
                            top: `${(rect.top / height) * 100}%`,
                            width: `${(rect.width / width) * 100}%`,
                            height: `${(rect.height / height) * 100}%`
                        }}
                        onClick={() => {
                            if(menu.dishes[parseInt(id)]) {
                                setDishDetails(id);
                            }

                        }}
                    >
                        {filteredIds.some((item) => item.dishId === id) && (
                            filteredIds.find(item => item.dishId === id)?.preferenceIds.map((preferenceId: string) => {
                                // Cast to unknown first to avoid type error
                                const preference = parseInt(preferenceId) as Preferences;
                                return (<Icon>{getPreferenceIcon(preference, 50, "var(--color-negative)")}</Icon>)
                            })
                        )}
                    </Icons>
                </React.Fragment>
            ))}
            {dishDetails && <DishDetails dishDetails={dishDetails} setDishDetails={setDishDetails} menu={menu}/>}
        </Wrapper>
    );
}

export default MenuOverlay;