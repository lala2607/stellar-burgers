import feedsReducer, { fetchFeeds, initialState } from '../feedSlice';
import { TOrdersData } from '@utils-types';
import * as burgerApi from '@api';

jest.mock('@api', () => ({
  getFeedsApi: jest.fn()
}));

const mockData: TOrdersData = {
  orders: [{
    _id: '1',
    ingredients: [],
    status: 'done',
    name: 'Бургер',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    number: 1
  }],
  total: 100,
  totalToday: 10
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
        error: { message: 'Ошибка' }
      }
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка');
  });

  it('rejected без message должен использовать дефолтную ошибку', () => {
    const state = feedsReducer(
      initialState,
      {
        type: fetchFeeds.rejected.type,
        error: {}
      }
    );
    expect(state.error).toBe('Ошибка загрузки ленты заказов');
  });
});