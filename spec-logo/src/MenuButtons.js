import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = ({ script, environment }) => ({
  script,
  environment
});
const mapDispatchToProps = {
  reset: () => ({ type: 'RESET' }),
  undo: () => ({ type: 'UNDO' }),
  redo: () => ({ type: 'REDO' }),
  skipAnimating: () => ({ type: 'SKIP_ANIMATING' })
};

export const MenuButtons = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  ({
    script: { canUndo, canRedo, nextInstructionId },
    environment,
    reset,
    undo,
    redo,
    skipAnimating
  }) => {
    const canReset = nextInstructionId !== 0;
    return (
      <React.Fragment>
        <button
          onClick={skipAnimating}
          disabled={!environment.shouldAnimate}>
          Skip animation
        </button>
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
