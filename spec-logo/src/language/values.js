const constantValue = value => ({ get: _ => value });

export const parameterValue = parameter => ({
  get: state => {
    return state.collectedParameters[parameter.toLowerCase()];
  }
});

export const integerParameterValue = parameter => ({
  get: state => {
    const argumentValue = parameterValue(parameter).get(state);
    const integerArgument = parseInt(argumentValue);
    if (Number.isNaN(integerArgument)) {
      throw { description: 'Argument is not an integer' };
    }
    return integerArgument;
  }
});

export const negate = value => ({
  get: state => -value.get(state)
});

export const isParameterReference = v =>
  typeof v === 'string' && v.startsWith(':');
