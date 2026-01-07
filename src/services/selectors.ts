import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';

export const getIngredients = (state: RootState) => state.ingredients.items;
export const getIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;

export const getFeeds = (state: RootState) => state.feed.data;
export const getFeedsLoading = (state: RootState) => state.feed.isLoading;

export const getOrders = (state: RootState) => state.orders.items;
export const getOrdersLoading = (state: RootState) => state.orders.isLoading;

export const getUserLoading = (state: RootState) => state.user.isLoading;

export const getOrder = (state: RootState) => state.order.order;
export const getOrderLoading = (state: RootState) => state.order.isLoading;

const getConstructorState = (state: RootState) => state.burgerConstructor;

export const getConstructorItems = createSelector(
  [getConstructorState],
  (constructor) => ({
    bun: constructor?.bun ?? null,
    ingredients: constructor?.ingredients ?? []
  })
);

export const getOrderRequest = (state: RootState) =>
  state.orderModal.orderRequest;
export const getOrderModalData = (state: RootState) =>
  state.orderModal.orderModalData;

export const getUser = (state: RootState) => state.auth.user;
export const getIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const getAuthLoading = (state: RootState) => state.auth.isLoading;
export const getAuthError = (state: RootState) => state.auth.error;
