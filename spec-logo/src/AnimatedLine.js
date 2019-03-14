import React from 'react';

export const AnimatedLine = ({
  commandToAnimate: { x1, y1 },
  turtle: { x, y }
}) => (
  <line
    x1={x1}
    y1={y1}
    x2={x}
    y2={y}
    strokeWidth="2"
    stroke="black"
  />
);
