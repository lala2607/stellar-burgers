import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getFeeds, getFeedsLoading } from '../../services/selectors';
import { fetchFeeds } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
const dispatch = useDispatch();
const feeds = useSelector(getFeeds);
const isLoading = useSelector(getFeedsLoading);

const loadFeedsData = () => dispatch(fetchFeeds());

const handleGetFeeds = loadFeedsData;

useEffect(() => {
  loadFeedsData();
}, [dispatch]);

  if (isLoading || !feeds) {
    return <Preloader />;
  }

  return <FeedUI orders={feeds.orders} handleGetFeeds={handleGetFeeds} />;
};
