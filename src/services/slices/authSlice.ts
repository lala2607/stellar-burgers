import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  TLoginData,
  TRegisterData
} from '@api';
import { setCookie, deleteCookie, getCookie } from '../../utils/cookie';

export interface AuthState {
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: !!getCookie('accessToken')
};

interface AuthResponse {
  success: boolean;
  user: TUser;
  accessToken: string;
  refreshToken: string;
}

interface UserResponse {
  success: boolean;
  user: TUser;
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: TLoginData): Promise<TUser> => {
    const response = await loginUserApi(data);
    if (response.success) {
      const token = (response as AuthResponse).accessToken.startsWith('Bearer ')
        ? (response as AuthResponse).accessToken.split('Bearer ')[1]
        : (response as AuthResponse).accessToken;

      setCookie('accessToken', token, { expires: 1200 });
      localStorage.setItem(
        'refreshToken',
        (response as AuthResponse).refreshToken
      );

      return (response as AuthResponse).user;
    }
    throw new Error('Ошибка авторизации');
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: TRegisterData): Promise<TUser> => {
    const response = await registerUserApi(data);
    if (response.success) {
      const token = (response as AuthResponse).accessToken.startsWith('Bearer ')
        ? (response as AuthResponse).accessToken.split('Bearer ')[1]
        : (response as AuthResponse).accessToken;

      setCookie('accessToken', token, { expires: 1200 });
      localStorage.setItem(
        'refreshToken',
        (response as AuthResponse).refreshToken
      );

      return (response as AuthResponse).user;
    }
    throw new Error('Ошибка регистрации');
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const checkUserAuth = createAsyncThunk(
  'auth/checkUser',
  async (): Promise<TUser> => {
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      // Очищаем токены при отсутствии accessToken
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      throw new Error('Пользователь не авторизован');
    }

    const response = await getUserApi();
    if (response.success) {
      return (response as UserResponse).user;
    }

    // Очищаем токены при ошибке получения данных пользователя
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
    throw new Error('Ошибка получения данных пользователя');
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    const handlePending = (state: AuthState) => {
      state.isLoading = true;
      state.error = null;
    };

    const handleFulfilled = (
      state: AuthState,
      action: PayloadAction<TUser>
    ) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    };

    const handleRejected = (
      state: AuthState,
      action: { error: { message?: string } },
      defaultError: string
    ) => {
      state.isLoading = false;
      state.error = action.error.message || defaultError;
      state.isAuthenticated = false;
    };

    builder
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, handleFulfilled)
      .addCase(loginUser.rejected, (state, action) => {
        handleRejected(state, action, 'Ошибка авторизации');
      })
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, handleFulfilled)
      .addCase(registerUser.rejected, (state, action) => {
        handleRejected(state, action, 'Ошибка регистрации');
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkUserAuth.fulfilled, handleFulfilled)
      .addCase(checkUserAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        // Здесь больше нет побочных эффектов - они уже выполнены в thunk'е
      });
  }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
