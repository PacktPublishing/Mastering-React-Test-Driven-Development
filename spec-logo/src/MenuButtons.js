import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = ({ script }) => ({ script });
const mapDispatchToProps = {
  reset: () => ({ type: 'RESET' }),
  undo: () => ({ type: 'UNDO' }),
  redo: () => ({ type: 'REDO' })
};

export const MenuButtons = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  ({
    script: { canUndo, canRedo, nextInstructionId },
    reset,
    undo,
    redo
  }) => {
    const canReset = nextInstructionId !== 0;
    return (
      <React.Fragment>
        <button onClick={undo} disabled={!canUndo}>
          Undo
        </button>
        <button onClick={redo} disabled={!canRedo}>
          Redo
        </button>
        <button onClick={reset} disabled={!canReset}>
          Reset
        </button>
      </React.Fragment>
    );
  }
);
