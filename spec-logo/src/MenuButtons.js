import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Dialog } from './Dialog';

const SharingUrl = ({ url }) => (
  <p>
    You are now presenting your script.{' '}
    <a href={url}>Here's the URL for sharing.</a>
  </p>
);

const mapStateToProps = ({ script, environment }) => ({
  script,
  environment
});
const mapDispatchToProps = {
  reset: () => ({ type: 'RESET' }),
  undo: () => ({ type: 'UNDO' }),
  redo: () => ({ type: 'REDO' }),
  skipAnimating: () => ({ type: 'SKIP_ANIMATING' }),
  startSharing: () => ({ type: 'START_SHARING' }),
  startSharing: button => ({
    type: 'START_SHARING',
    reset: button === 'reset'
  }),
  stopSharing: () => ({ type: 'STOP_SHARING' })
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
    skipAnimating,
    startSharing,
    stopSharing
  }) => {
    const canReset = nextInstructionId !== 0;

    const [isSharingDialogOpen, setIsSharingDialogOpen] = useState(
      false
    );

    const openSharingDialog = () => setIsSharingDialogOpen(true);

    return (
      <React.Fragment>
        {environment.isSharing ? (
          <SharingUrl url={environment.url} />
        ) : null}
        {environment.isWatching ? (
          <p>You are now watching the session</p>
        ) : null}
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
        {environment.isSharing ? (
          <button id="stopSharing" onClick={stopSharing}>
            Stop sharing
          </button>
        ) : (
          <button id="startSharing" onClick={openSharingDialog}>
            Start sharing
          </button>
        )}
        {isSharingDialogOpen ? (
          <Dialog
            onClose={() => setIsSharingDialogOpen(false)}
            onChoose={startSharing}
            message="Do you want to share your previous commands, or would you like to reset to a blank script?"
            buttons={[
              { id: 'keep', text: 'Share previous' },
              { id: 'reset', text: 'Reset' }
            ]}
          />
        ) : null}
      </React.Fragment>
    );
  }
);
