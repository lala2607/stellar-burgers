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

const TEST_ERROR_MESSAGE = 'Ошибка';

const ORDER_ID = '1';
const ORDER_STATUS = 'done';
const ORDER_NAME = 'Бургер';
const ORDER_DATE = '2023-01-01';
const ORDER_NUMBER = 1;

const API_MOCK_PATH = '@api';

const mockOrder: TOrder = {
  _id: ORDER_ID,
  ingredients: [],
  status: ORDER_STATUS,
  name: ORDER_NAME,
  createdAt: ORDER_DATE,
  updatedAt: ORDER_DATE,
  number: ORDER_NUMBER
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
          error: { message: TEST_ERROR_MESSAGE }
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