import { toInstructions } from '../../src/language/export';

describe('toInstructions', () => {
  it('joins two tokens in the same instruction', () => {
    const result = toInstructions({
      parsedTokens: [
        { instructionId: 0, text: 'a' },
        { instructionId: 0, text: 'b' }
      ]
    });
    expect(result).toEqual(['ab']);
  });

  it('works for multiple instructions', () => {
    const result = toInstructions({
      parsedTokens: [
        { instructionId: 0, text: 'a' },
        { instructionId: 1, text: 'b' }
      ]
    });
    expect(result).toEqual(['a', 'b']);
  });
});
