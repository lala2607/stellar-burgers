import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { checkUserAuth } from '../../services/slices/authSlice';
import { ConstructorPage, Feed, Login, Register, ForgotPassword, ResetPassword, Profile, ProfileOrders, NotFound404 } from '@pages';
import { AppHeader, Modal, OrderInfo, IngredientDetails, ProtectedRoute } from '@components';
import '../../index.css';
import styles from './app.module.css';

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname, state } = useLocation();
  const background = state?.background;

  const closeModal = () => navigate(-1);

  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  useEffect(() => {
    const shouldHideOverflow = !!background;
    document.body.style.overflow = shouldHideOverflow ? 'hidden' : 'unset';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [background]);

  const renderProtectedRoute = (element: JSX.Element, onlyUnAuth = false) => (
    <ProtectedRoute onlyUnAuth={onlyUnAuth}>
      {element}
    </ProtectedRoute>
  );

  const renderModalRoute = (path: string, element: JSX.Element, title = '') => (
    <Route
      path={path}
      element={
        <Modal title={title} onClose={closeModal}>
          {element}
        </Modal>
      }
    />
  );

  return (
    <div className={styles.app}>
      <AppHeader />
      
      <Routes location={background || { pathname, state }}>
        <Route index element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        
        <Route
          path='/login'
          element={renderProtectedRoute(<Login />, true)}
        />
        <Route
          path='/register'
          element={renderProtectedRoute(<Register />, true)}
        />
        <Route
          path='/forgot-password'
          element={renderProtectedRoute(<ForgotPassword />, true)}
        />
        <Route
          path='/reset-password'
          element={renderProtectedRoute(<ResetPassword />, true)}
        />
        <Route
          path='/profile'
          element={renderProtectedRoute(<Profile />)}
        />
        <Route
          path='/profile/orders'
          element={renderProtectedRoute(<ProfileOrders />)}
        />
        
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          {renderModalRoute('/feed/:number', <OrderInfo />)}
          {renderModalRoute(
            '/ingredients/:id', 
            <IngredientDetails />, 
            'Детали ингредиента'
          )}
          <Route
            path='/profile/orders/:number'
            element={
              renderProtectedRoute(
                <Modal title='' onClose={closeModal}>
                  <OrderInfo />
                </Modal>
              )
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;