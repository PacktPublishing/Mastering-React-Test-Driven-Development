import React from 'react';
import { connect } from 'react-redux';
import { Turtle } from './Turtle';

const isDrawLineCommand = command =>
  command.drawCommand === 'drawLine';

const mapStateToProps = ({
  script: { drawCommands, turtle }
}) => ({ drawCommands, turtle });
const mapDispatchToProps = _ => ({});
export const Drawing = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ drawCommands, turtle }) => {
  const lineCommands = drawCommands.filter(isDrawLineCommand);

  return (
    <div id="viewport">
      <svg
        viewBox="-300 -300 600 600"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg">
        {lineCommands.map(({ id, x1, y1, x2, y2 }) => (
          <line
            key={id}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            strokeWidth="2"
            stroke="black"
          />
        ))}
        <Turtle {...turtle} />
      </svg>
    </div>
  );
});
