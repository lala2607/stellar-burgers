import authReducer, {
  loginUser,
  registerUser,
  logoutUser,
  checkUserAuth,
  clearError,
  initialState
} from '../authSlice';
import { TUser } from '@utils-types';
import * as burgerApi from '@api';

jest.mock('@api', () => ({
  loginUserApi: jest.fn(),
  registerUserApi: jest.fn(),
  logoutApi: jest.fn(),
  getUserApi: jest.fn()
}));

jest.mock('../../../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
  getCookie: jest.fn(() => null)
}));

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

describe('authSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('clearError должен очищать ошибку', () => {
    const state = authReducer(
      { ...initialState, error: 'Ошибка' },
      clearError()
    );
    expect(state.error).toBeNull();
  });

  describe('loginUser', () => {
    it('pending должен устанавливать загрузку', () => {
      const state = authReducer(initialState, { type: loginUser.pending.type });
      expect(state.isLoading).toBe(true);
    });

    it('fulfilled должен сохранять пользователя', () => {
      const state = authReducer(
        initialState,
        {
          type: loginUser.fulfilled.type,
          payload: mockUser
        }
      );
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('rejected должен сохранять ошибку', () => {
      const state = authReducer(
        initialState,
        {
          type: loginUser.rejected.type,
          error: { message: 'Ошибка' }
        }
      );
      expect(state.error).toBe('Ошибка');
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('registerUser', () => {
    it('pending должен устанавливать загрузку', () => {
      const state = authReducer(initialState, { type: registerUser.pending.type });
      expect(state.isLoading).toBe(true);
    });

    it('fulfilled должен сохранять пользователя', () => {
      const state = authReducer(
        initialState,
        {
          type: registerUser.fulfilled.type,
          payload: mockUser
        }
      );
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('rejected должен сохранять ошибку', () => {
      const state = authReducer(
        initialState,
        {
          type: registerUser.rejected.type,
          error: { message: 'Ошибка' }
        }
      );
      expect(state.error).toBe('Ошибка');
    });
  });

  describe('logoutUser', () => {
    it('fulfilled должен очищать данные', () => {
      const state = authReducer(
        { ...initialState, user: mockUser, isAuthenticated: true },
        { type: logoutUser.fulfilled.type }
      );
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('checkUserAuth', () => {
    it('pending должен устанавливать загрузку', () => {
      const state = authReducer(initialState, { type: checkUserAuth.pending.type });
      expect(state.isLoading).toBe(true);
    });

    it('fulfilled должен сохранять пользователя', () => {
      const state = authReducer(
        initialState,
        {
          type: checkUserAuth.fulfilled.type,
          payload: mockUser
        }
      );
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('rejected должен сбрасывать авторизацию', () => {
      const state = authReducer(
        initialState,
        {
          type: checkUserAuth.rejected.type,
          error: { message: 'Ошибка' }
        }
      );
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });
});