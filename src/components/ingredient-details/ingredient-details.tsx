import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { getIngredients, getIngredientsLoading } from '../../services/selectors';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

export const IngredientDetails: FC = () => {
const { id } = useParams<{ id: string }>();
const dispatch = useDispatch();
const ingredients = useSelector(getIngredients);
const isIngredientsLoading = useSelector(getIngredientsLoading);
const ingredientData = ingredients.find((ing) => ing._id === id);

useEffect(() => {
  const shouldFetchIngredients = ingredients.length === 0 && !isIngredientsLoading;
  
  if (shouldFetchIngredients) {
    dispatch(fetchIngredients());
  }
}, [dispatch, ingredients.length, isIngredientsLoading]);

  if (isIngredientsLoading || !ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
