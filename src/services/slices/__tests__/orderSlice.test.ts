import orderReducer, {
  fetchOrderByNumber,
  clearOrder,
  initialState
} from '../orderSlice';
import { TOrder } from '@utils-types';
import * as burgerApi from '@api';

jest.mock('@api', () => ({
  getOrderByNumberApi: jest.fn()
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

describe('orderSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchOrderByNumber', () => {
    it('pending должен устанавливать загрузку', () => {
      const state = orderReducer(initialState, { type: fetchOrderByNumber.pending.type });
      expect(state.isLoading).toBe(true);
    });

    it('fulfilled должен сохранять заказ', () => {
      const state = orderReducer(
        initialState,
        {
          type: fetchOrderByNumber.fulfilled.type,
          payload: mockOrder
        }
      );
      expect(state.isLoading).toBe(false);
      expect(state.order).toEqual(mockOrder);
    });

    it('rejected должен сохранять ошибку', () => {
      const state = orderReducer(
        initialState,
        {
          type: fetchOrderByNumber.rejected.type,
          error: { message: 'Ошибка' }
        }
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка');
    });

    it('rejected без message должен использовать дефолтную ошибку', () => {
      const state = orderReducer(
        initialState,
        {
          type: fetchOrderByNumber.rejected.type,
          error: {}
        }
      );
      expect(state.error).toBe('Ошибка загрузки заказа');
    });
  });

  it('clearOrder должен очищать заказ', () => {
    const state = orderReducer(
      { ...initialState, order: mockOrder },
      clearOrder()
    );
    expect(state.order).toBeNull();
  });
});