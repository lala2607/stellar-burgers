import ingredientsReducer, {
  fetchIngredients,
  clearIngredientsError,
  setIngredientsLoading,
  initialState
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';
import * as burgerApi from '@api';

jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

const TEST_ERROR_MESSAGE = 'Ошибка';
const DEFAULT_ERROR_MESSAGE = 'Ошибка загрузки ингредиентов';

const INGREDIENT_ID = '1';
const INGREDIENT_NAME = 'Булка';
const INGREDIENT_TYPE = 'bun';
const INGREDIENT_PRICE = 100;

const API_MOCK_PATH = '@api';

const mockIngredients: TIngredient[] = [
  {
    _id: INGREDIENT_ID,
    name: INGREDIENT_NAME,
    type: INGREDIENT_TYPE,
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: INGREDIENT_PRICE,
    image: '',
    image_mobile: '',
    image_large: ''
  }
];

describe('ingredientsSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('начальное состояние должно быть корректным', () => {
    expect(ingredientsReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('clearIngredientsError должен очищать ошибку', () => {
    const state = ingredientsReducer(
      { ...initialState, error: TEST_ERROR_MESSAGE },
      clearIngredientsError()
    );
    expect(state.error).toBeNull();
  });

  it('setIngredientsLoading должен менять состояние загрузки', () => {
    const state1 = ingredientsReducer(initialState, setIngredientsLoading(true));
    expect(state1.isLoading).toBe(true);

    const state2 = ingredientsReducer(state1, setIngredientsLoading(false));
    expect(state2.isLoading).toBe(false);
  });

  describe('fetchIngredients', () => {
    it('pending должен устанавливать загрузку', () => {
      const state = ingredientsReducer(initialState, { type: fetchIngredients.pending.type });
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled должен сохранять ингредиенты', () => {
      const state = ingredientsReducer(
        initialState,
        {
          type: fetchIngredients.fulfilled.type,
          payload: mockIngredients
        }
      );
      expect(state.isLoading).toBe(false);
      expect(state.items).toEqual(mockIngredients);
    });

    it('rejected должен сохранять ошибку', () => {
      const state = ingredientsReducer(
        initialState,
        {
          type: fetchIngredients.rejected.type,
          error: { message: TEST_ERROR_MESSAGE }
        }
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(TEST_ERROR_MESSAGE);
      expect(state.items).toEqual([]);
    });

    it('rejected без message должен использовать дефолтную ошибку', () => {
      const state = ingredientsReducer(
        initialState,
        {
          type: fetchIngredients.rejected.type,
          error: {}
        }
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(DEFAULT_ERROR_MESSAGE);
    });
  });
});