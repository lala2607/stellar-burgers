import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from '../../services/store';
import { addIngredient } from '../../services/slices/burgerConstructorSlice';
import { BurgerIngredientUI } from '@ui';
import { TConstructorIngredient } from '@utils-types';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const isBunIngredient = ingredient.type === 'bun';

    const handleAdd = () => {
      if (isBunIngredient) {
        dispatch(addIngredient(ingredient));
      } else {
        const ingredientWithUniqueId: TConstructorIngredient = {
          ...ingredient,
          id: uuidv4()
        };
        dispatch(addIngredient(ingredientWithUniqueId));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);