const defaultState = {
  customer: {}
};

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_CUSTOMER_FOR_APPOINTMENT':
      return { ...state, customer: action.customer };
    default:
      return state;
  }
};
