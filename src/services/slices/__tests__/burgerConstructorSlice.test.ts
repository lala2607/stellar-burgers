import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  initialState
} from '../burgerConstructorSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

const BUN_ID_1 = 'bun-1';
const BUN_ID_2 = 'bun-2';
const MAIN_ID = 'main-1';
const SAUCE_ID = 'sauce-1';
const MAIN_INSTANCE_ID = '1';
const SAUCE_INSTANCE_ID = '2';

const INGREDIENT_NAME = 'Булка';
const INGREDIENT_TYPE_BUN = 'bun';
const INGREDIENT_TYPE_MAIN = 'main';
const INGREDIENT_TYPE_SAUCE = 'sauce';

const BUN_PRICE = 100;
const MAIN_PRICE = 50;
const SAUCE_PRICE = 30;

const mockBun: TIngredient = {
  _id: BUN_ID_1,
  name: INGREDIENT_NAME,
  type: INGREDIENT_TYPE_BUN,
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: BUN_PRICE,
  image: '',
  image_mobile: '',
  image_large: ''
};

const mockMain: TConstructorIngredient = {
  ...mockBun,
  _id: MAIN_ID,
  type: INGREDIENT_TYPE_MAIN,
  price: MAIN_PRICE,
  id: MAIN_INSTANCE_ID
};

const mockSauce: TConstructorIngredient = {
  ...mockBun,
  _id: SAUCE_ID,
  type: INGREDIENT_TYPE_SAUCE,
  price: SAUCE_PRICE,
  id: SAUCE_INSTANCE_ID
};

describe('burgerConstructorSlice', () => {
  it('addIngredient с булкой должен заменять булку', () => {
    const state1 = constructorReducer(initialState, addIngredient(mockBun));
    expect(state1.bun).toEqual(mockBun);

    const newBun = { ...mockBun, _id: BUN_ID_2 };
    const state2 = constructorReducer(state1, addIngredient(newBun));
    expect(state2.bun).toEqual(newBun);
  });

  it('addIngredient с не-булкой должен добавлять в массив', () => {
    const state = constructorReducer(initialState, addIngredient(mockMain));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(mockMain);
  });

  it('removeIngredient должен удалять по id', () => {
    const state1 = constructorReducer(initialState, addIngredient(mockMain));
    const state2 = constructorReducer(state1, addIngredient(mockSauce));
    expect(state2.ingredients).toHaveLength(2);

    const state3 = constructorReducer(state2, removeIngredient(MAIN_INSTANCE_ID));
    expect(state3.ingredients).toHaveLength(1);
    expect(state3.ingredients[0].id).toBe(SAUCE_INSTANCE_ID);
  });

  it('moveIngredient должен перемещать ингредиенты', () => {
    const state1 = constructorReducer(initialState, addIngredient(mockMain));
    const state2 = constructorReducer(state1, addIngredient(mockSauce));
    
    const state3 = constructorReducer(
      state2,
      moveIngredient({ dragIndex: 0, hoverIndex: 1 })
    );
    
    expect(state3.ingredients[0].id).toBe(SAUCE_INSTANCE_ID);
    expect(state3.ingredients[1].id).toBe(MAIN_INSTANCE_ID);
  });

  it('clearConstructor должен очищать всё', () => {
    let state = constructorReducer(initialState, addIngredient(mockBun));
    state = constructorReducer(state, addIngredient(mockMain));
    expect(state.bun).not.toBeNull();
    expect(state.ingredients).toHaveLength(1);

    state = constructorReducer(state, clearConstructor());
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });
});