import { parseStatement } from '../parser';
import { builtInFunctions } from '../language/functionTable';

export const defaultState = {
  pen: { paint: true, down: true },
  turtle: { x: 0, y: 0, angle: 0 },
  drawCommands: [],
  collectedParameters: {},
  parsedInstructions: [],
  parsedTokens: [],
  nextInstructionId: 0,
  nextDrawCommandId: 0,
  allFunctions: builtInFunctions,
  name: 'Unnamed script'
};

export const logoReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'SUBMIT_SCRIPT_NAME':
      return { ...state, name: action.text };
    case 'SUBMIT_EDIT_LINE':
      return parseStatement(action.text, {
        ...state,
        error: undefined
      });
    case 'RESET':
      return defaultState;
    default:
      return state;
  }
};
