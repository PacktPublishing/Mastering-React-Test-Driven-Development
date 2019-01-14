export const comment = {
  names: [';'],
  initial: {},
  isWriteProtected: true,
  parameters: [],
  parseToken: (state, token) => {
    if (token.type === 'whitespace' && token.text === '\n') {
      return { isComplete: true };
    } else {
      return { isComplete: false };
    }
  },
  perform: state => state
};
