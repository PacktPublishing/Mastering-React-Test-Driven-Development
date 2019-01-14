export const withUndoRedo = reducer => {
  let past = [],
    future = [];

  return (state, action) => {
    if (state === undefined)
      return {
        canUndo: false,
        canRedo: false,
        ...reducer(state, action)
      };

    switch (action.type) {
      case 'UNDO':
        const lastEntry = past[past.length - 1];
        past = past.slice(0, -1);
        future = [...future, state];
        return {
          ...lastEntry,
          canRedo: true
        };
      case 'REDO':
        const nextEntry = future[future.length - 1];
        past = [...past, state];
        future = future.slice(0, -1);
        return nextEntry;
      default:
        const newPresent = reducer(state, action);
        if (
          newPresent.nextInstructionId != state.nextInstructionId
        ) {
          past = [...past, state];
          future = [];
          return {
            ...newPresent,
            canUndo: true
          };
        }
        return state;
    }
  };
};
