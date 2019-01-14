import { parseStatement, initialState } from '../parser';
import { builtInFunctions } from '../language/functionTable';
import { dispatch } from 'redux';

export const scriptReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SUBMIT_SCRIPT_NAME':
      return { ...state, name: action.text };
    case 'SUBMIT_EDIT_LINE':
      return parseStatement(action.text, {
        ...state,
        error: undefined
      });
    case 'RESET':
      return initialState;
    default:
      return state;
  }
  return state;
};
