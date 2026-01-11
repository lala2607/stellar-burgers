import ordersReducer, { fetchOrders, initialState } from '../ordersSlice';
import { TOrder } from '@utils-types';
import * as burgerApi from '@api';

jest.mock('@api', () => ({
  getOrdersApi: jest.fn()
}));

const TEST_ERROR_MESSAGE = 'Ошибка';
const DEFAULT_ERROR_MESSAGE = 'Ошибка загрузки заказов';

const ORDER_ID = '1';
const ORDER_STATUS = 'done';
const ORDER_NAME = 'Бургер';
const ORDER_DATE = '2023-01-01';
const ORDER_NUMBER = 1;

const API_MOCK_PATH = '@api';

const mockOrders: TOrder[] = [
  {
    _id: ORDER_ID,
    ingredients: [],
    status: ORDER_STATUS,
    name: ORDER_NAME,
    createdAt: ORDER_DATE,
    updatedAt: ORDER_DATE,
    number: ORDER_NUMBER
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
          error: { message: TEST_ERROR_MESSAGE }
        }
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(TEST_ERROR_MESSAGE);
    });

    it('rejected без message должен использовать дефолтную ошибку', () => {
      const state = ordersReducer(
        initialState,
        {
          type: fetchOrders.rejected.type,
          error: {}
        }
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(DEFAULT_ERROR_MESSAGE);
    });
  });
});