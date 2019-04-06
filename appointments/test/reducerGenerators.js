export const itMaintainsExistingState = (reducer, action) => {
  it('maintains existing state', () => {
    const existing = { a: 123 };
    expect(reducer(existing, action)).toMatchObject(existing);
  });
};

export const itSetsStatus = (reducer, action, value) => {
  it(`sets status to ${value}`, () => {
    expect(reducer(undefined, action)).toMatchObject({
      status: value
    });
  });
};
