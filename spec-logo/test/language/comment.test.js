import { comment } from '../../src/language/comment';

describe('parse', () => {
  it('parses single word comment', () => {
    expect(
      comment.parseToken(
        {},
        { type: 'word', token: 'comment', lineNumber: 1 }
      )
    ).toEqual({ isComplete: false });
  });

  it('parses multiple word comments until a new line appears', () => {
    let state = {};
    state = comment.parseToken(state, {
      type: 'word',
      text: 'another',
      lineNumber: 1
    });
    state = comment.parseToken(state, {
      type: 'whitespace',
      text: ' ',
      lineNumber: 1
    });
    state = comment.parseToken(state, {
      type: 'word',
      text: 'comment',
      lineNumber: 1
    });
    state = comment.parseToken(state, {
      type: 'whitespace',
      text: '\n',
      lineNumber: 1
    });
    expect(state).toEqual({ isComplete: true });
  });
});

describe('perform', () => {
  it('does nothing except return the same state', () => {
    const state = { a: 123 };
    expect(comment.perform(state)).toEqual(state);
  });
});
