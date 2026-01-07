import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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

const handleAuthSuccess = (response: any) => {
  const token = response.accessToken.startsWith('Bearer ')
    ? response.accessToken.split('Bearer ')[1]
    : response.accessToken;
  
  setCookie('accessToken', token, { expires: 1200 });
  localStorage.setItem('refreshToken', response.refreshToken);
  
  return response.user;
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    if (response.success) {
      return handleAuthSuccess(response);
    }
    throw new Error('Ошибка авторизации');
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    if (response.success) {
      return handleAuthSuccess(response);
    }
    throw new Error('Ошибка регистрации');
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const checkUserAuth = createAsyncThunk('auth/checkUser', async () => {
  const accessToken = getCookie('accessToken');
  if (!accessToken) {
    throw new Error('Пользователь не авторизован');
  }
  const response = await getUserApi();
  if (response.success) {
    return response.user;
  }
  throw new Error('Ошибка получения данных пользователя');
});

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

    const handleFulfilled = (state: AuthState, action: any) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    };

    const handleRejected = (state: AuthState, action: any, defaultError: string) => {
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
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      });
  }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;