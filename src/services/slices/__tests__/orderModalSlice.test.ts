import orderModalReducer, {
  createOrder,
  clearOrderModal,
  initialState
} from '../orderModalSlice';
import { TOrder } from '@utils-types';
import * as burgerApi from '@api';

jest.mock('@api', () => ({
  orderBurgerApi: jest.fn()
}));

const mockOrder: TOrder = {
  _id: '1',
  ingredients: [],
  status: 'done',
  name: 'Бургер',
  createdAt: '2023-01-01',
  updatedAt: '2023-01-01',
  number: 1
};

describe('orderModalSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('pending должен устанавливать загрузку', () => {
      const state = orderModalReducer(initialState, { type: createOrder.pending.type });
      expect(state.orderRequest).toBe(true);
    });

    it('fulfilled должен сохранять заказ', () => {
      const state = orderModalReducer(
        initialState,
        {
          type: createOrder.fulfilled.type,
          payload: mockOrder
        }
      );
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(mockOrder);
    });

    it('rejected должен сбрасывать загрузку', () => {
      const state = orderModalReducer(
        initialState,
        {
          type: createOrder.rejected.type,
          error: { message: 'Ошибка' }
        }
      );
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toBeNull();
    });
  });

  it('clearOrderModal должен очищать данные', () => {
    const state = orderModalReducer(
      { ...initialState, orderModalData: mockOrder },
      clearOrderModal()
    );
    expect(state.orderModalData).toBeNull();
  });
});