const defaultState = {
  customers: [],
  customer: {},
  status: undefined,
  validationErrors: {},
  error: false
};

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'ADD_CUSTOMER_SUBMITTING':
      return { ...state, status: 'SUBMITTING', error: false };
    case 'ADD_CUSTOMER_FAILED':
      return { ...state, status: 'FAILED', error: true };
    case 'ADD_CUSTOMER_VALIDATION_FAILED':
      return {
        ...state,
        status: 'VALIDATION_FAILED',
        validationErrors: action.validationErrors
      };
    case 'ADD_CUSTOMER_SUCCESSFUL':
      return {
        ...state,
        status: 'SUCCESSFUL',
        customer: action.customer
      };
    case 'SEARCH_CUSTOMERS_REQUEST':
      return {
        ...state,
        customers: []
      };
    case 'SEARCH_CUSTOMERS_SUCCESSFUL':
      return {
        ...state,
        customers: action.customers
      };
    default:
      return state;
  }
};
