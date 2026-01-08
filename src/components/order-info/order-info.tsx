import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import {
  getOrder,
  getOrderLoading,
  getIngredients,
  getIngredientsLoading
} from '../../services/selectors';
import { fetchOrderByNumber } from '../../services/slices/orderSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();
  const orderData = useSelector(getOrder);
  const isLoading = useSelector(getOrderLoading);
  const ingredients = useSelector(getIngredients);
  const isIngredientsLoading = useSelector(getIngredientsLoading);

  useEffect(() => {
    if (number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number]);

  useEffect(() => {
    if (!ingredients.length && !isIngredientsLoading) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length, isIngredientsLoading]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length || isLoading || isIngredientsLoading)
      return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients, isLoading, isIngredientsLoading]);

  if (isLoading || isIngredientsLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
