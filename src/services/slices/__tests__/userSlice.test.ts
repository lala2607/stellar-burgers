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

const TEST_USER_EMAIL = 'test@example.com';
const TEST_USER_NAME = 'Test User';
const TEST_ERROR_MESSAGE = 'Ошибка';
const DEFAULT_ERROR_MESSAGE = 'Ошибка загрузки данных пользователя';

const API_MOCK_PATH = '@api';

const mockUser: TUser = {
  email: TEST_USER_EMAIL,
  name: TEST_USER_NAME
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
          error: { message: TEST_ERROR_MESSAGE }
        }
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(TEST_ERROR_MESSAGE);
    });

    it('rejected без message должен использовать дефолтную ошибку', () => {
      const state = userReducer(
        initialState,
        {
          type: fetchUser.rejected.type,
          error: {}
        }
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(DEFAULT_ERROR_MESSAGE);
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