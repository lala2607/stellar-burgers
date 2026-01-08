import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser, clearError } from '../../services/slices/authSlice';
import {
  getAuthError,
  getAuthLoading,
  getIsAuthenticated
} from '../../services/selectors';
import { LoginUI } from '@ui-pages';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const useAuthActions = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    return { dispatch, navigate, location };
  };

  const useAuthInfo = () => {
    const error = useSelector(getAuthError);
    const isLoading = useSelector(getAuthLoading);
    const isAuthenticated = useSelector(getIsAuthenticated);

    return { error, isLoading, isAuthenticated };
  };

  const { dispatch, navigate, location } = useAuthActions();
  const { error, isLoading, isAuthenticated } = useAuthInfo();

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
