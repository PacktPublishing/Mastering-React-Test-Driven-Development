import React from 'react';
import { connect } from 'react-redux';
import { initialState } from './parser';

const mapStateToProps = ({ script }) => ({ script });
const mapDispatchToProps = {
  reset: () => ({ type: 'RESET' })
};

export const MenuButtons = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ script, reset }) => {
  const canReset = script !== initialState;

  return (
    <React.Fragment>
      <button onClick={reset} disabled={!canReset}>
        Reset
      </button>
    </React.Fragment>
  );
});
