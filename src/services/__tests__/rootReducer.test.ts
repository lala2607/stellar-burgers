import { rootReducer } from '../rootReducer';

describe('rootReducer', () => {
  it('должен возвращать начальное состояние для неизвестного экшена', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN' });
    
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('orders');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('orderModal');
    expect(state).toHaveProperty('auth');

    expect(state.feed).toEqual({
      data: null,
      isLoading: false,
      error: null
    });
    
    expect(state.ingredients).toEqual({
      items: [],
      isLoading: false,
      error: null
    });
    
    expect(state.auth).toMatchObject({
      user: null,
      isLoading: false,
      error: null
    });
  });
});