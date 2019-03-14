import React, { useState } from 'react';
import { connect } from 'react-redux';

const ifEnterKey = (e, func) => {
  if (e.key === 'Enter') {
    func();
  }
};

const mapStateToProps = ({ script: { name } }) => ({ name });
const mapDispatchToProps = {
  submitScriptName: text => ({ type: 'SUBMIT_SCRIPT_NAME', text }),
  promptFocusRequest: () => ({ type: 'PROMPT_FOCUS_REQUEST' })
};

export const ScriptName = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ name, submitScriptName, promptFocusRequest }) => {
  const [updatedScriptName, setScriptName] = useState(name);
  const [editingScriptName, setEditingScriptName] = useState(
    false
  );

  const toggleEditingScriptName = () =>
    setEditingScriptName(!editingScriptName);

  const completeEditingScriptName = () => {
    if (editingScriptName) {
      toggleEditingScriptName();
      submitScriptName(updatedScriptName);
      promptFocusRequest();
    }
  };

  const beginEditingScriptName = () => {
    toggleEditingScriptName();
  };

  return (
    <input
      id="name"
      className={editingScriptName ? 'isEditing' : null}
      value={updatedScriptName}
      onFocus={beginEditingScriptName}
      onChange={e => setScriptName(e.target.value)}
      onKeyPress={e => ifEnterKey(e, completeEditingScriptName)}
      onBlur={completeEditingScriptName}
    />
  );
});
