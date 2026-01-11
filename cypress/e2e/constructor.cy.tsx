const BURGER_CONSTRUCTOR_SELECTOR = '[class*="burger_constructor"]';
const MODAL_SELECTOR = '[class*="modal"]';
const MODAL_OVERLAY_SELECTOR = '[class*="overlay"]';
const MODAL_BUTTON_SELECTOR = '[class*="modal"] button[class*="button"]';
const LI_SELECTOR = 'li';
const BUTTON_SELECTOR = 'button';
const BODY_SELECTOR = 'body';

const ADD_BUTTON_TEXT = 'Добавить';
const ORDER_BUTTON_TEXT = 'Оформить заказ';
const BIO_PATTY_TEXT = 'Биокотлета из марсианской Магнолии';
const KRAITOR_BUN_TEXT = 'Краторная булка N-200i';
const ASSEMBLE_BURGER_TEXT = 'Соберите бургер';
const TOP_BUN_TEXT = '(верх)';
const CHOOSE_BUNS_TEXT = 'Выберите булки';
const CHOOSE_FILLING_TEXT = 'Выберите начинку';
const ORDER_NUMBER_TEXT = '12345';
const CALORIES_TEXT = 'Калории, ккал';
const PROTEINS_TEXT = 'Белки, г';
const FATS_TEXT = 'Жиры, г';
const CARBOHYDRATES_TEXT = 'Углеводы, г';

const INGREDIENTS_API = '**/api/ingredients';
const USER_AUTH_API = '**/auth/user';
const USER_API = '**/api/auth/user';
const ORDERS_API = '**/api/orders';
const NORMA_ORDERS_API = 'https://norma.education-services.ru/api/orders';

const BASE_URL = 'http://localhost:4000/';
const LOGIN_URL = '/login';
const INGREDIENTS_URL = '/ingredients/';

const INGREDIENTS_FIXTURE = 'ingredients.json';
const USER_FIXTURE = 'user.json';
const ORDER_FIXTURE = 'order.json';

const GET_INGREDIENTS_ALIAS = 'getIngredients';
const GET_USER_ALIAS = 'getUser';
const GET_USER_API_ALIAS = 'getUserApi';
const CREATE_ORDER_ALIAS = 'createOrder';
const CREATE_ORDER_NORMA_ALIAS = 'createOrderNorma';

const REFRESH_TOKEN_KEY = 'refreshToken';
const ACCESS_TOKEN_KEY = 'accessToken';

describe('Burger Constructor', () => {
  beforeEach(() => {
    cy.intercept('GET', INGREDIENTS_API, { fixture: INGREDIENTS_FIXTURE }).as(
      GET_INGREDIENTS_ALIAS
    );
    cy.visit('/');
    cy.wait('@' + GET_INGREDIENTS_ALIAS);
    cy.contains(ASSEMBLE_BURGER_TEXT, { timeout: 10000 }).should('be.visible');
  });

  describe('Adding ingredients to constructor', () => {
    it('should add ingredient from list to constructor', () => {
      cy.contains(BIO_PATTY_TEXT)
        .closest(LI_SELECTOR)
        .find(BUTTON_SELECTOR)
        .contains(ADD_BUTTON_TEXT)
        .click({ force: true });

      cy.contains(BIO_PATTY_TEXT, { timeout: 10000 }).should('exist');
    });

    it('should add bun to constructor', () => {
      cy.contains(KRAITOR_BUN_TEXT)
        .closest(LI_SELECTOR)
        .find(BUTTON_SELECTOR)
        .contains(ADD_BUTTON_TEXT)
        .click({ force: true });

      cy.contains(KRAITOR_BUN_TEXT, { timeout: 10000 }).should('exist');
    });
  });

  describe('Ingredient details modal', () => {
    it('should open modal with ingredient details on click', () => {
      cy.contains(BIO_PATTY_TEXT).click({ force: true });

      cy.url({ timeout: 10000 }).should('include', INGREDIENTS_URL);
      cy.contains(BIO_PATTY_TEXT, { timeout: 10000 }).should('exist');
      cy.contains(CALORIES_TEXT, { timeout: 10000 }).should('exist');
      cy.contains(PROTEINS_TEXT, { timeout: 10000 }).should('exist');
      cy.contains(FATS_TEXT, { timeout: 10000 }).should('exist');
      cy.contains(CARBOHYDRATES_TEXT, { timeout: 10000 }).should('exist');
    });

    it('should display correct ingredient data in modal', () => {
      cy.contains(BIO_PATTY_TEXT).click({ force: true });

      cy.url({ timeout: 10000 }).should('include', INGREDIENTS_URL);
      cy.contains(BIO_PATTY_TEXT, { timeout: 10000 }).should('exist');
      cy.contains('424', { timeout: 10000 }).should('exist');
      cy.contains('420', { timeout: 10000 }).should('exist');
      cy.contains('142', { timeout: 10000 }).should('exist');
      cy.contains('242', { timeout: 10000 }).should('exist');
    });

    it('should close modal on close button click', () => {
      cy.contains(BIO_PATTY_TEXT).click({ force: true });

      cy.url({ timeout: 10000 }).should('include', INGREDIENTS_URL);
      cy.get(BODY_SELECTOR).then(($body) => {
        const modal = $body.find(MODAL_SELECTOR);
        if (modal.length > 0) {
          cy.get(MODAL_BUTTON_SELECTOR).first().click();
        }
      });
      cy.go('back');
      cy.url({ timeout: 5000 }).should('eq', BASE_URL);
    });

    it('should close modal on overlay click', () => {
      cy.contains(BIO_PATTY_TEXT).click({ force: true });

      cy.url({ timeout: 10000 }).should('include', INGREDIENTS_URL);
      cy.get(BODY_SELECTOR).click(0, 0, { force: true });
      cy.go('back');
      cy.url({ timeout: 5000 }).should('eq', BASE_URL);
    });
  });

  describe('Order creation process', () => {
    beforeEach(() => {
      cy.intercept('GET', INGREDIENTS_API, { fixture: INGREDIENTS_FIXTURE }).as(GET_INGREDIENTS_ALIAS);
      cy.intercept('GET', USER_AUTH_API, { fixture: USER_FIXTURE }).as(GET_USER_ALIAS);
      cy.intercept('GET', USER_API, { fixture: USER_FIXTURE }).as(GET_USER_API_ALIAS);
      cy.intercept('POST', ORDERS_API, { fixture: ORDER_FIXTURE }).as(CREATE_ORDER_ALIAS);
      cy.intercept('POST', NORMA_ORDERS_API, { fixture: ORDER_FIXTURE }).as(CREATE_ORDER_NORMA_ALIAS);

      cy.window().then((win) => {
        win.localStorage.setItem(REFRESH_TOKEN_KEY, 'fake-refresh-token');
        win.document.cookie = ACCESS_TOKEN_KEY + '=fake-access-token; path=/';
      });

      cy.visit('/');
      cy.wait('@' + GET_INGREDIENTS_ALIAS);
      cy.contains(ASSEMBLE_BURGER_TEXT, { timeout: 10000 }).should('be.visible');

      cy.wait(2000);
    });

    afterEach(() => {
      cy.window().then((win) => {
        win.localStorage.removeItem(REFRESH_TOKEN_KEY);
        win.document.cookie = ACCESS_TOKEN_KEY + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      });
    });

    it('should create order with ingredients and display order number', () => {
      cy.contains(KRAITOR_BUN_TEXT)
        .closest(LI_SELECTOR)
        .find(BUTTON_SELECTOR)
        .contains(ADD_BUTTON_TEXT)
        .click({ force: true });

      cy.contains(KRAITOR_BUN_TEXT, { timeout: 5000 }).should('exist');
      cy.contains(TOP_BUN_TEXT, { timeout: 5000 }).should('exist');

      cy.contains(BIO_PATTY_TEXT)
        .closest(LI_SELECTOR)
        .find(BUTTON_SELECTOR)
        .contains(ADD_BUTTON_TEXT)
        .click({ force: true });

      cy.contains(BIO_PATTY_TEXT, { timeout: 5000 }).should('exist');

      cy.wait(1000);

      cy.get(BUTTON_SELECTOR).contains(ORDER_BUTTON_TEXT).should('exist').then(($btn) => {
        expect($btn).to.not.have.attr('disabled');
        cy.wrap($btn).click({ force: true });
      });

      cy.url({ timeout: 5000 }).should('not.include', LOGIN_URL);

      cy.contains(ORDER_NUMBER_TEXT, { timeout: 20000 }).should('exist');
    });

    it('should clear constructor after successful order', () => {
      cy.contains(KRAITOR_BUN_TEXT)
        .closest(LI_SELECTOR)
        .find(BUTTON_SELECTOR)
        .contains(ADD_BUTTON_TEXT)
        .click({ force: true });

      cy.contains(KRAITOR_BUN_TEXT, { timeout: 5000 }).should('exist');
      cy.contains(TOP_BUN_TEXT, { timeout: 5000 }).should('exist');

      cy.contains(BIO_PATTY_TEXT)
        .closest(LI_SELECTOR)
        .find(BUTTON_SELECTOR)
        .contains(ADD_BUTTON_TEXT)
        .click({ force: true });

      cy.contains(BIO_PATTY_TEXT, { timeout: 5000 }).should('exist');

      cy.wait(1000);

      cy.get(BUTTON_SELECTOR).contains(ORDER_BUTTON_TEXT).should('exist').then(($btn) => {
        expect($btn).to.not.have.attr('disabled');
        cy.wrap($btn).click({ force: true });
      });

      cy.url({ timeout: 5000 }).should('not.include', LOGIN_URL);

      cy.contains(ORDER_NUMBER_TEXT, { timeout: 20000 }).should('exist');

      cy.get(BODY_SELECTOR).then(($body) => {
        const modal = $body.find(MODAL_SELECTOR);
        if (modal.length > 0) {
          cy.get(MODAL_BUTTON_SELECTOR).first().click({ force: true });
        }
      });

      cy.contains(CHOOSE_BUNS_TEXT, { timeout: 5000 }).should('exist');
      cy.contains(CHOOSE_FILLING_TEXT, { timeout: 5000 }).should('exist');
    });

    it('should redirect to login if not authenticated', () => {
      cy.window().then((win) => {
        win.localStorage.removeItem(REFRESH_TOKEN_KEY);
        win.document.cookie = ACCESS_TOKEN_KEY + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      });

      cy.reload();
      cy.wait('@' + GET_INGREDIENTS_ALIAS);
      cy.contains(ASSEMBLE_BURGER_TEXT, { timeout: 10000 }).should('be.visible');

      cy.contains(KRAITOR_BUN_TEXT)
        .closest(LI_SELECTOR)
        .find(BUTTON_SELECTOR)
        .contains(ADD_BUTTON_TEXT)
        .click({ force: true });

      cy.contains(KRAITOR_BUN_TEXT, { timeout: 5000 }).should('exist');

      cy.get(BUTTON_SELECTOR).contains(ORDER_BUTTON_TEXT).should('exist').click({ force: true });

      cy.url({ timeout: 5000 }).should('include', LOGIN_URL);
    });
  });
});