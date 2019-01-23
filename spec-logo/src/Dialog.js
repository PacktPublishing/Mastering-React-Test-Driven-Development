import React from 'react';

export const Dialog = ({
  message,
  buttons,
  onChoose,
  onClose
}) => {
  return (
    <div className="dialog">
      <p>{message}</p>
      <div className="dialogButtons">
        {buttons.map(({ id, text }) => (
          <button
            onClick={() => {
              onChoose(id);
              onClose();
            }}
            id={id}
            key={id}>
            {text}
          </button>
        ))}
      </div>
    </div>
  );
};
