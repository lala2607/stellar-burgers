import ordersReducer, { fetchOrders, initialState } from '../ordersSlice';
import { TOrder } from '@utils-types';
import * as burgerApi from '@api';

jest.mock('@api', () => ({
  getOrdersApi: jest.fn()
}));

const mockOrders: TOrder[] = [
  {
    _id: '1',
    ingredients: [],
    status: 'done',
    name: 'Бургер',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    number: 1
  }
];

describe('ordersSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchOrders', () => {
    it('pending должен устанавливать загрузку', () => {
      const state = ordersReducer(initialState, { type: fetchOrders.pending.type });
      expect(state.isLoading).toBe(true);
    });

    it('fulfilled должен сохранять заказы', () => {
      const state = ordersReducer(
        initialState,
        {
          type: fetchOrders.fulfilled.type,
          payload: mockOrders
        }
      );
      expect(state.isLoading).toBe(false);
      expect(state.items).toEqual(mockOrders);
    });

    it('rejected должен сохранять ошибку', () => {
      const state = ordersReducer(
        initialState,
        {
          type: fetchOrders.rejected.type,
          error: { message: 'Ошибка' }
        }
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка');
    });

    it('rejected без message должен использовать дефолтную ошибку', () => {
      const state = ordersReducer(
        initialState,
        {
          type: fetchOrders.rejected.type,
          error: {}
        }
      );
      expect(state.error).toBe('Ошибка загрузки заказов');
    });
  });
});