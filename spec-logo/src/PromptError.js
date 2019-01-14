import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = ({ script: { error } }) => ({ error });
const mapDispatchToProps = () => ({});

export const PromptError = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ error }) => {
  return (
    <tbody key="error">
      <tr>
        <td colSpan="2">{error && error.description}</td>
      </tr>
    </tbody>
  );
});
