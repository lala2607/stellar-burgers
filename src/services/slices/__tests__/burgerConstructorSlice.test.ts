import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  initialState
} from '../burgerConstructorSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

const mockBun: TIngredient = {
  _id: 'bun-1',
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
};

const mockMain: TConstructorIngredient = {
  ...mockBun,
  _id: 'main-1',
  type: 'main',
  price: 50,
  id: '1'
};

const mockSauce: TConstructorIngredient = {
  ...mockBun,
  _id: 'sauce-1',
  type: 'sauce',
  price: 30,
  id: '2'
};

describe('burgerConstructorSlice', () => {
  it('addIngredient с булкой должен заменять булку', () => {
    const state1 = constructorReducer(initialState, addIngredient(mockBun));
    expect(state1.bun).toEqual(mockBun);

    const newBun = { ...mockBun, _id: 'bun-2' };
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

    const state3 = constructorReducer(state2, removeIngredient('1'));
    expect(state3.ingredients).toHaveLength(1);
    expect(state3.ingredients[0].id).toBe('2');
  });

  it('moveIngredient должен перемещать ингредиенты', () => {
    const state1 = constructorReducer(initialState, addIngredient(mockMain));
    const state2 = constructorReducer(state1, addIngredient(mockSauce));
    
    const state3 = constructorReducer(
      state2,
      moveIngredient({ dragIndex: 0, hoverIndex: 1 })
    );
    
    expect(state3.ingredients[0].id).toBe('2');
    expect(state3.ingredients[1].id).toBe('1');
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