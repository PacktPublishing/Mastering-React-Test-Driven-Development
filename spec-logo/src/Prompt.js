import React, { useState } from 'react';
import { connect } from 'react-redux';

const mapStateToProps = ({ script: { nextInstructionId } }) => ({
  nextInstructionId
});
const mapDispatchToProps = {
  submitEditLine: text => ({ type: 'SUBMIT_EDIT_LINE', text })
};

export const Prompt = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ nextInstructionId, submitEditLine }) => {
  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      setShouldSubmit(true);
    }
  };

  const handleChange = e => {
    setEditPrompt(e.target.value);
    if (shouldSubmit) {
      submitEditLine(e.target.value);
      setShouldSubmit(false);
    }
  };

  const handleScroll = e => setHeight(e.target.scrollHeight);

  const [editPrompt, setEditPrompt] = useState('');
  const [shouldSubmit, setShouldSubmit] = useState(false);

  const [currentInstructionId, setCurrentInstructionId] = useState(
    nextInstructionId
  );

  const [height, setHeight] = useState(20);

  if (currentInstructionId != nextInstructionId) {
    setCurrentInstructionId(nextInstructionId);
    setEditPrompt('');
    setHeight(20);
  }

  return (
    <tbody key="prompt">
      <tr>
        <td className="promptIndicator">&gt;</td>
        <td>
          <textarea
            onScroll={handleScroll}
            value={editPrompt}
            style={{ height: height }}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
          />
        </td>
      </tr>
    </tbody>
  );
});
