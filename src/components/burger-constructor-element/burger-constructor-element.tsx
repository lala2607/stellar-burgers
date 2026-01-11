import { FC, memo } from 'react';
import { useDispatch } from '../../services/store';
import {
  removeIngredient,
  moveIngredient
} from '../../services/slices/burgerConstructorSlice';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const actionConfig = {
      moveDown: {
        isEnabled: index < totalItems - 1,
        targetIndex: index + 1
      },
      moveUp: {
        isEnabled: index > 0,
        targetIndex: index - 1
      }
    };

    const createMoveHandler = (targetIndex: number) => () =>
      dispatch(moveIngredient({ dragIndex: index, hoverIndex: targetIndex }));

    const handleRemove = () => dispatch(removeIngredient(ingredient.id));

    const handlers = {
      handleMoveDown: actionConfig.moveDown.isEnabled
        ? createMoveHandler(actionConfig.moveDown.targetIndex)
        : () => {},
      handleMoveUp: actionConfig.moveUp.isEnabled
        ? createMoveHandler(actionConfig.moveUp.targetIndex)
        : () => {},
      handleClose: handleRemove
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        {...handlers}
      />
    );
  }
);
