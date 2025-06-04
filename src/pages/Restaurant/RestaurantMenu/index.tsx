import { useParams } from "react-router-dom";

function RestaurantMenu() {
    const { menuId = "1" } = useParams();

    return (
        <div>
            <h1>Restaurant Menu: {menuId}</h1>
        </div>
    );
}

export default RestaurantMenu;