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

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 100,
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
      { ...initialState, error: 'Ошибка' },
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
          error: { message: 'Ошибка' }
        }
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка');
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
      expect(state.error).toBe('Ошибка загрузки ингредиентов');
    });
  });
});