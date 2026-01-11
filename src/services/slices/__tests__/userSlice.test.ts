import userReducer, {
  fetchUser,
  clearUser,
  initialState
} from '../userSlice';
import { TUser } from '@utils-types';
import * as burgerApi from '@api';

jest.mock('@api', () => ({
  getUserApi: jest.fn()
}));

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

describe('userSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchUser', () => {
    it('pending должен устанавливать загрузку', () => {
      const state = userReducer(initialState, { type: fetchUser.pending.type });
      expect(state.isLoading).toBe(true);
    });

    it('fulfilled должен сохранять пользователя', () => {
      const state = userReducer(
        initialState,
        {
          type: fetchUser.fulfilled.type,
          payload: mockUser
        }
      );
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
    });

    it('rejected должен сохранять ошибку', () => {
      const state = userReducer(
        initialState,
        {
          type: fetchUser.rejected.type,
          error: { message: 'Ошибка' }
        }
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка');
    });

    it('rejected без message должен использовать дефолтную ошибку', () => {
      const state = userReducer(
        initialState,
        {
          type: fetchUser.rejected.type,
          error: {}
        }
      );
      expect(state.error).toBe('Ошибка загрузки данных пользователя');
    });
  });

  it('clearUser должен очищать пользователя', () => {
    const state = userReducer(
      { ...initialState, user: mockUser },
      clearUser()
    );
    expect(state.user).toBeNull();
  });
});