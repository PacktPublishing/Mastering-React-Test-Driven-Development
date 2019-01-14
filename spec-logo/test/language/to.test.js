import { to } from '../../src/language/to';

describe('parseToken', () => {
  it('ignores whitespace', () => {
    const state = to.parseToken(
      { a: 123 },
      { type: 'whitespace' }
    );
    expect(state).toEqual({});
  });
});
