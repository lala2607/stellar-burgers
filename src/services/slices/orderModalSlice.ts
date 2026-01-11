import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';

export interface OrderModalState {
  orderRequest: boolean;
  orderModalData: TOrder | null;
}

export const initialState: OrderModalState = {
  orderRequest: false,
  orderModalData: null
};

export const createOrder = createAsyncThunk(
  'orderModal/createOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    if (response.success) {
      return response.order;
    }
    throw new Error('Ошибка создания заказа');
  }
);

const orderModalSlice = createSlice({
  name: 'orderModal',
  initialState,
  reducers: {
    clearOrderModal: (state) => {
      state.orderModalData = null;
    },
    resetOrderRequest: (state) => {
      state.orderRequest = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
      });
  }
});

// Экспорт нового редьюсера
export const { clearOrderModal, resetOrderRequest } = orderModalSlice.actions;
export default orderModalSlice.reducer;
