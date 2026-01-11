import { rootReducer } from '../rootReducer';

const INITIAL_STATE_EXPECTATIONS = {
  feed: {
    data: null,
    isLoading: false,
    error: null
  },
  ingredients: {
    items: [],
    isLoading: false,
    error: null
  },
  orders: {
    items: [],
    isLoading: false,
    error: null
  },
  user: {
    user: null,
    isLoading: false,
    error: null
  },
  order: {
    order: null,
    isLoading: false,
    error: null
  },
  burgerConstructor: {
    bun: null,
    ingredients: []
  },
  orderModal: {
    orderModalData: null,
    orderRequest: false
  },
  auth: {
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false
  }
};

describe('rootReducer', () => {
  it('должен возвращать начальное состояние для неизвестного экшена', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN' });
    
    Object.keys(INITIAL_STATE_EXPECTATIONS).forEach((key) => {
      expect(state).toHaveProperty(key);
    });
    
    expect(state.feed).toEqual(INITIAL_STATE_EXPECTATIONS.feed);
    expect(state.ingredients).toEqual(INITIAL_STATE_EXPECTATIONS.ingredients);
    expect(state.auth).toMatchObject(INITIAL_STATE_EXPECTATIONS.auth);
  });
});