import type { RestaurantRoute } from "../../../shared/restaurant/types";

function Loading({ restaurantRoute }: { restaurantRoute: RestaurantRoute }) {
    return (
        <div>Loading... {restaurantRoute.name}</div>
    );
}

export default Loading;