import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredientsSlice';
import feedsReducer from './slices/feedSlice';
import ordersReducer from './slices/ordersSlice';
import userReducer from './slices/userSlice';
import orderReducer from './slices/orderSlice';
import constructorReducer from './slices/burgerConstructorSlice';
import orderModalReducer from './slices/orderModalSlice';
import authReducer from './slices/authSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feed: feedsReducer,
  orders: ordersReducer,
  user: userReducer,
  order: orderReducer,
  burgerConstructor: constructorReducer,
  orderModal: orderModalReducer,
  auth: authReducer
});
