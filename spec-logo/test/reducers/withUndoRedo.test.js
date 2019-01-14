import { withUndoRedo } from '../../src/reducers/withUndoRedo';

describe('withUndoRedo', () => {
  const undoAction = { type: 'UNDO' };
  const redoAction = { type: 'REDO' };
  const innerAction = { type: 'INNER' };
  const present = { a: 123, nextInstructionId: 0 };
  const future = { b: 234, nextInstructionId: 1 };
  const futureFuture = { c: 345, nextInstructionId: 3 };
  let decoratedReducerSpy;
  let reducer;

  beforeEach(() => {
    decoratedReducerSpy = jest.fn();
    reducer = withUndoRedo(decoratedReducerSpy);
  });

  describe('when initializing state', () => {
    it('calls the decorated reducer with undefined state and the action passed', () => {
      const action = { type: 'UNKNOWN' };
      reducer(undefined, action);
      expect(decoratedReducerSpy).toHaveBeenCalledWith(
        undefined,
        action
      );
    });

    it('returns a value of what the inner reducer returns', () => {
      decoratedReducerSpy.mockReturnValue({ a: 123 });
      expect(reducer(undefined)).toMatchObject({ a: 123 });
    });

    it('cannot undo', () => {
      expect(reducer(undefined)).toMatchObject({ canUndo: false });
    });

    it('cannot redo', () => {
      expect(reducer(undefined)).toMatchObject({ canRedo: false });
    });
  });

  describe('performing an action', () => {
    beforeEach(() => {
      decoratedReducerSpy.mockReturnValue(future);
    });

    it('can undo after a new present has been provided', () => {
      const result = reducer(
        { canUndo: false, present },
        innerAction
      );
      expect(result.canUndo).toBeTruthy();
    });

    it('forwards action to the inner reducer', () => {
      reducer(present, innerAction);
      expect(decoratedReducerSpy).toHaveBeenCalledWith(
        present,
        innerAction
      );
    });

    it('returns the result of the inner reducer', () => {
      const result = reducer(present, innerAction);
      expect(result).toMatchObject(future);
    });

    it('returns the previous state if nextInstructionId does not increment', () => {
      decoratedReducerSpy.mockReturnValue({
        nextInstructionId: 0
      });
      const result = reducer(present, innerAction);
      expect(result).toBe(present);
    });
  });

  describe('undo', () => {
    let newState;

    beforeEach(() => {
      decoratedReducerSpy.mockReturnValue(future);
      newState = reducer(present, innerAction);
    });

    it('sets present to the latest past entry', () => {
      const updated = reducer(newState, undoAction);
      expect(updated).toMatchObject(present);
    });

    it('can undo multipe levels', () => {
      decoratedReducerSpy.mockReturnValue(futureFuture);
      newState = reducer(newState, innerAction);

      const updated = reducer(
        reducer(newState, undoAction),
        undoAction
      );

      expect(updated).toMatchObject(present);
    });

    it('sets canRedo to true after undoing', () => {
      const updated = reducer(newState, undoAction);
      expect(updated.canRedo).toBeTruthy();
    });
  });

  describe('redo', () => {
    let newState;

    beforeEach(() => {
      decoratedReducerSpy.mockReturnValueOnce(future);
      decoratedReducerSpy.mockReturnValueOnce(futureFuture);
      newState = reducer(present, innerAction);
      newState = reducer(newState, innerAction);
      newState = reducer(newState, undoAction);
      newState = reducer(newState, undoAction);
    });

    it('sets the present to the latest future entry', () => {
      const updated = reducer(newState, redoAction);
      expect(updated).toMatchObject(future);
    });

    it('can redo multiple levels', () => {
      const updated = reducer(
        reducer(newState, redoAction),
        redoAction
      );
      expect(updated).toMatchObject(futureFuture);
    });

    it('returns to previous state when followed by an undo', () => {
      const updated = reducer(
        reducer(newState, redoAction),
        undoAction
      );
      expect(updated).toMatchObject(present);
    });
  });

  it('return undefined when attempting a do, undo, do, redo sequence', () => {
    decoratedReducerSpy.mockReturnValue(future);
    let newState = reducer(present, innerAction);
    newState = reducer(newState, undoAction);
    newState = reducer(newState, innerAction);
    newState = reducer(newState, redoAction);
    expect(newState).not.toBeDefined();
  });
});
