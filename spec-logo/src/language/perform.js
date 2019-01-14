export const perform = (state, instruction) => {
  const { collectedParameters } = state;
  const stateWithParams = {
    ...state,
    collectedParameters: {
      ...collectedParameters,
      ...instruction.collectedParameters
    }
  };
  return {
    ...state,
    ...instruction.functionDefinition.perform(
      stateWithParams,
      instruction
    )
  };
};

export const performAll = (state, instructions) =>
  instructions.reduce(perform, state);
