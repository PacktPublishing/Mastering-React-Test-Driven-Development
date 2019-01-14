import {
  parseCall,
  parseNextToken,
  parseNextListValue,
  finishParsingList
} from './parseCall';
import { parameterValue, isParameterReference } from './values';
import { functionWithName } from './functionTable';
import { performAll } from './perform';

const parseTo = (state, token) => {
  if (token.type === 'whitespace') return {};
  const { currentInstruction, allFunctions } = state;
  if (!currentInstruction.name) {
    return { name: token.text, collectingParameters: true };
  }
  if (
    currentInstruction.collectingParameters &&
    token.text.startsWith(':')
  ) {
    return {
      parameters: [
        ...currentInstruction.parameters,
        token.text.substring(1).toLowerCase()
      ]
    };
  }
  if (token.text === 'end') {
    return finishParsingList(currentInstruction);
  }
  return {
    ...parseNextListValue(state, token),
    collectingParameters: false,
    parsingListValue: true
  };
};

const mapObjectValues = (object, f) =>
  Object.keys(object).reduce(
    (mapped, key) => ({ ...mapped, [key]: f(object[key]) }),
    {}
  );

const insertParameterValues = (parameters, state) =>
  mapObjectValues(parameters, value => {
    if (isParameterReference(value))
      return parameterValue(value.substring(1)).get(state);
    return value;
  });

const performCall = (state, { innerInstructions }) => {
  const instructionsWithParameterValues = innerInstructions.map(
    instruction => ({
      ...instruction,
      collectedParameters: insertParameterValues(
        instruction.collectedParameters,
        state
      )
    })
  );
  return performAll(state, instructionsWithParameterValues);
};

const performTo = (state, instruction) => {
  const existingFunction = functionWithName(
    instruction.name,
    state.allFunctions
  );
  if (existingFunction && existingFunction.isWriteProtected) {
    throw {
      description: `Cannot override the built-in function '${instruction.name.toLowerCase()}'`
    };
  }
  const functionDefinition = {
    names: [instruction.name],
    isWriteProtected: false,
    initial: {
      collectedParameters: {},
      isComplete: instruction.parameters.length === 0,
      innerInstructions: parameterValue('statements').get(state)
    },
    parameters: instruction.parameters,
    parseToken: parseCall,
    perform: performCall
  };
  return {
    allFunctions: [...state.allFunctions, functionDefinition]
  };
};

export const to = {
  names: ['to'],
  isWriteProtected: true,
  initial: { parameters: [], currentListValue: [] },
  parameters: ['statements'],
  parseToken: parseTo,
  perform: performTo
};
