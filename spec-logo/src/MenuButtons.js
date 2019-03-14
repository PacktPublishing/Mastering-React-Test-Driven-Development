import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = ({ script }) => ({ script });
const mapDispatchToProps = {
  reset: () => ({ type: 'RESET' })
};

export const MenuButtons = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ script, reset }) => {
  const canReset = script.nextInstructionId !== 0;

  return (
    <React.Fragment>
      <button onClick={reset} disabled={!canReset}>
        Reset
      </button>
    </React.Fragment>
  );
});
