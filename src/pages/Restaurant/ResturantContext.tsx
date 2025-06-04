import { createContext, useContext } from 'react';

export const RestaurantContext = createContext<any>(null);

export const useRestaurant = () => {
  return useContext(RestaurantContext);
};