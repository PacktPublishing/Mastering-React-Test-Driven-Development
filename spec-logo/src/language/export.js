export function toInstructions({ parsedTokens }) {
  const byInstructions = parsedTokens.reduce(
    (instructions, token) => {
      if (instructions[token.instructionId]) {
        return {
          ...instructions,
          [token.instructionId]: [
            ...instructions[token.instructionId],
            token
          ]
        };
      } else {
        return { ...instructions, [token.instructionId]: [token] };
      }
    },
    {}
  );

  return Object.keys(byInstructions).map(instruction => {
    return byInstructions[instruction]
      .map(token => token.text)
      .join('');
  });
}
