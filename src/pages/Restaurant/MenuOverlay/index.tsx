import { Wrapper, MenuImage, Rectangle, Icons } from './styles';
import { getPreferenceIcon } from '../../../hooks/getPreferenceIcon';
import type { Preferences } from '../../../shared/restaurant/types';

function MenuOverlay({
    menu_overlay,
    filteredIds
}: {
    menu_overlay: {
        image: string;
        width: number;
        height: number;
        rectangles: { id: string; width: number; height: number; left: number; top: number }[];
        color: string;
    }
    filteredIds: { dishId: string, preferenceIds: string[] }[];
}) {
    const { image, width, height, rectangles, color } = menu_overlay;
    
    return (
        <Wrapper baseWidth={width} baseHeight={height}>
            <MenuImage src={image}/>
            {rectangles.map(({ id, ...rect }) => (
                <>
                    <Rectangle
                        key={id}
                        {...rect}
                        blocked={filteredIds.some((item) => item.dishId === id)}
                        style={{
                            left: `${(rect.left / width) * 100}%`,
                            top: `${(rect.top / height) * 100}%`,
                            width: `${(rect.width / width) * 100}%`,
                            height: `${(rect.height / height) * 100}%`,
                            backgroundColor: 'red',
                        }}
                    />
                    <Icons
                        key={id}
                        {...rect}
                        blocked={filteredIds.some((item) => item.dishId === id)}
                        style={{
                            left: `${(rect.left / width) * 100}%`,
                            top: `${(rect.top / height) * 100}%`,
                            width: `${(rect.width / width) * 100}%`,
                            height: `${(rect.height / height) * 100}%`,
                        }}
                    >
                        {filteredIds.some((item) => item.dishId === id) && (
                            filteredIds.find(item => item.dishId === id)?.preferenceIds.map((preferenceId: string) => {
                                // Cast to unknown first to avoid type error
                                const preference = parseInt(preferenceId) as Preferences;
                                return (getPreferenceIcon(preference, 7, "var(--color-negative)"))
                            })
                        )}
                    </Icons>
                </>
            ))}
        </Wrapper>
    );
}

export default MenuOverlay;