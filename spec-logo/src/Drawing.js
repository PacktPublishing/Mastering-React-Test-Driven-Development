import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Turtle } from './Turtle';
import { StaticLines } from './StaticLines';

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
        <StaticLines lineCommands={lineCommands} />
        <Turtle {...turtle} />
      </svg>
    </div>
  );
});
