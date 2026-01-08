import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

export interface ConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
}

export const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: (
      state,
      action: PayloadAction<TIngredient | TConstructorIngredient>
    ) => {
      const ingredient = action.payload;
      if (ingredient.type === 'bun') {
        state.bun = ingredient;
      } else {
        state.ingredients.push(ingredient as TConstructorIngredient);
      }
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      const ingredientId = action.payload;
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== ingredientId
      );
    },

    moveIngredient: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      const { dragIndex, hoverIndex } = action.payload;
      const updatedIngredients = [...state.ingredients];
      const [draggedItem] = updatedIngredients.splice(dragIndex, 1);
      updatedIngredients.splice(hoverIndex, 0, draggedItem);
      state.ingredients = updatedIngredients;
    },

    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;

export default constructorSlice.reducer;
