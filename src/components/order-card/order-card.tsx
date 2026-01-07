import { FC, memo, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { getIngredients, getIngredientsLoading } from '../../services/selectors';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const ingredients = useSelector(getIngredients);
  const isIngredientsLoading = useSelector(getIngredientsLoading);

  const shouldLoadIngredients = ingredients.length === 0 && !isIngredientsLoading;

  useEffect(() => {
    if (shouldLoadIngredients) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, shouldLoadIngredients]);
  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;

    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], item: string) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) return [...acc, ingredient];
        return acc;
      },
      []
    );

    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    const date = new Date(order.createdAt);
    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
