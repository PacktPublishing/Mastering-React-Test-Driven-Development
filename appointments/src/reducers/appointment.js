const defaultState = {
  appointment: {},
  customer: {},
  error: false
};

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'ADD_APPOINTMENT_REQUEST':
      return { ...state, error: false };
    case 'ADD_APPOINTMENT_FAILED':
      return { ...state, error: true };
    case 'SET_CUSTOMER_FOR_APPOINTMENT':
      return { ...state, customer: action.customer };
    default:
      return state;
  }
};
