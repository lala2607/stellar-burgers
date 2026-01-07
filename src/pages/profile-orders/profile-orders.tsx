import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getOrders } from '../../services/selectors';
import { fetchOrders } from '../../services/slices/ordersSlice';

export const ProfileOrders: FC = () => {
const [dispatch, orders] = [
  useDispatch(),
  useSelector(getOrders)
];

useEffect(() => {
  dispatch(fetchOrders());
}, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
