import { FC, useMemo } from 'react';
import { useSelector } from '../../services/store';
import { getFeeds } from '../../services/selectors';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
const feeds = useSelector(getFeeds);
const orders = feeds?.orders || [];

const { readyOrders, pendingOrders, feed } = useMemo(() => {
  if (!feeds) {
    return {
      readyOrders: [],
      pendingOrders: [],
      feed: { total: 0, totalToday: 0 }
    };
  }

  const { total, totalToday } = feeds;
  
  return {
    readyOrders: getOrders(orders, 'done'),
    pendingOrders: getOrders(orders, 'pending'),
    feed: { total, totalToday }
  };
}, [feeds, orders]);

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
