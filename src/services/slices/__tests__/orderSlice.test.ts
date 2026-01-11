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

const TEST_ERROR_MESSAGE = 'Ошибка';
const DEFAULT_ERROR_MESSAGE = 'Ошибка загрузки заказа';

const ORDER_ID = '1';
const ORDER_STATUS = 'done';
const ORDER_NAME = 'Бургер';
const ORDER_DATE = '2023-01-01';
const ORDER_NUMBER = 1;

const mockOrder: TOrder = {
  _id: ORDER_ID,
  ingredients: [],
  status: ORDER_STATUS,
  name: ORDER_NAME,
  createdAt: ORDER_DATE,
  updatedAt: ORDER_DATE,
  number: ORDER_NUMBER
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
          error: { message: TEST_ERROR_MESSAGE }
        }
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(TEST_ERROR_MESSAGE);
    });

    it('rejected без message должен использовать дефолтную ошибку', () => {
      const state = orderReducer(
        initialState,
        {
          type: fetchOrderByNumber.rejected.type,
          error: {}
        }
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(DEFAULT_ERROR_MESSAGE);
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