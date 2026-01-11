import '@testing-library/jest-dom';

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(() => null),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true
});

Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: jest.fn(() => null),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true
});

Object.defineProperty(document, 'cookie', {
  writable: true,
  value: ''
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

Object.defineProperty(window, 'requestAnimationFrame', {
  writable: true,
  value: jest.fn().mockImplementation(callback => {
    callback();
    return 0;
  })
});

Object.defineProperty(window, 'cancelAnimationFrame', {
  writable: true,
  value: jest.fn()
});

Object.defineProperty(window, 'getComputedStyle', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    getPropertyValue: jest.fn()
  }))
});

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn(),
}));

jest.mock('@api', () => ({
  getIngredientsApi: jest.fn(),
  getFeedsApi: jest.fn(),
  getOrdersApi: jest.fn(),
  orderBurgerApi: jest.fn(),
  getUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  registerUserApi: jest.fn(),
  logoutApi: jest.fn(),
  getOrderByNumberApi: jest.fn(),
}));

jest.mock('../../../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
  getCookie: jest.fn(() => null)
}));

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123')
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(() => ({})),
  useLocation: jest.fn(() => ({ pathname: '/' })),
}));

expect.extend({
  toBeValidReduxAction(received) {
    const hasType = received && typeof received === 'object' && 'type' in received;
    const hasPayload = !('payload' in received) || received.payload !== undefined;
    
    return {
      message: () => `expected ${JSON.stringify(received)} to be a valid Redux action`,
      pass: hasType && hasPayload
    };
  },
  
  toHaveReduxState(received, expectedState) {
    const hasKeys = Object.keys(expectedState).every(key => key in received);
    const valuesMatch = Object.entries(expectedState).every(([key, value]) => 
      JSON.stringify(received[key]) === JSON.stringify(value)
    );
    
    return {
      message: () => `expected state to match:\nExpected: ${JSON.stringify(expectedState)}\nReceived: ${JSON.stringify(received)}`,
      pass: hasKeys && valuesMatch
    };
  }
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidReduxAction(): R;
      toHaveReduxState(expectedState: Record<string, any>): R;
    }
  }
}

afterEach(() => {
  jest.clearAllMocks();

  (window.localStorage.getItem as jest.Mock).mockClear();
  (window.localStorage.setItem as jest.Mock).mockClear();
  (window.localStorage.removeItem as jest.Mock).mockClear();

  document.cookie = '';

  jest.restoreAllMocks();
});

beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});

  jest.setTimeout(10000);
});

afterAll(() => {
  jest.restoreAllMocks();
});