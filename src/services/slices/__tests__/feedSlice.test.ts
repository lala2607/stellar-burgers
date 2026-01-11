import feedsReducer, { fetchFeeds, initialState } from '../feedSlice';
import { TOrdersData } from '@utils-types';
import * as burgerApi from '@api';

jest.mock('@api', () => ({
  getFeedsApi: jest.fn()
}));

const TEST_ERROR_MESSAGE = 'Ошибка';
const DEFAULT_ERROR_MESSAGE = 'Ошибка загрузки ленты заказов';

const ORDER_ID = '1';
const ORDER_STATUS = 'done';
const ORDER_NAME = 'Бургер';
const ORDER_DATE = '2023-01-01';
const ORDER_NUMBER = 1;

const TOTAL_ORDERS = 100;
const TOTAL_TODAY = 10;

const API_MOCK_PATH = '@api';

const mockData: TOrdersData = {
  orders: [{
    _id: ORDER_ID,
    ingredients: [],
    status: ORDER_STATUS,
    name: ORDER_NAME,
    createdAt: ORDER_DATE,
    updatedAt: ORDER_DATE,
    number: ORDER_NUMBER
  }],
  total: TOTAL_ORDERS,
  totalToday: TOTAL_TODAY
};

describe('feedSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('pending должен устанавливать загрузку', () => {
    const state = feedsReducer(initialState, { type: fetchFeeds.pending.type });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fulfilled должен сохранять данные', () => {
    const state = feedsReducer(
      initialState,
      {
        type: fetchFeeds.fulfilled.type,
        payload: mockData
      }
    );
    expect(state.isLoading).toBe(false);
    expect(state.data).toEqual(mockData);
  });

  it('rejected должен сохранять ошибку', () => {
    const state = feedsReducer(
      initialState,
      {
        type: fetchFeeds.rejected.type,
        error: { message: TEST_ERROR_MESSAGE }
      }
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(TEST_ERROR_MESSAGE);
  });

  it('rejected без message должен использовать дефолтную ошибку', () => {
    const state = feedsReducer(
      initialState,
      {
        type: fetchFeeds.rejected.type,
        error: {}
      }
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(DEFAULT_ERROR_MESSAGE);
  });
});