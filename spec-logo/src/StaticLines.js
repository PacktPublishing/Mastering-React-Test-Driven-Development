import React from 'react';

export const StaticLines = ({ lineCommands }) =>
  lineCommands.map(({ id, x1, y1, x2, y2 }) => (
    <line
      key={id}
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      strokeWidth="2"
      stroke="black"
    />
  ));
