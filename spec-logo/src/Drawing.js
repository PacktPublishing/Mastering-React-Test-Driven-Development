import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Turtle } from './Turtle';
import { StaticLines } from './StaticLines';
import { AnimatedLine } from './AnimatedLine';

const isDrawLineCommand = command =>
  command.drawCommand === 'drawLine';
const isRotateCommand = command =>
  command.drawCommand === 'rotate';
const distance = ({ x1, y1, x2, y2 }) =>
  Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
const movementSpeed = 5;
const rotateSpeed = 1000 / 180;

const mapStateToProps = ({ script: { drawCommands } }) => ({
  drawCommands
});
const mapDispatchToProps = () => ({});
export const Drawing = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ drawCommands }) => {
  const [
    animatingCommandIndex,
    setAnimatingCommandIndex
  ] = useState(0);
  const [turtle, setTurtle] = useState({ x: 0, y: 0, angle: 0 });

  const lineCommands = drawCommands
    .slice(0, animatingCommandIndex)
    .filter(isDrawLineCommand);

  const commandToAnimate = drawCommands[animatingCommandIndex];
  const isDrawingLine =
    commandToAnimate && isDrawLineCommand(commandToAnimate);
  const isRotating =
    commandToAnimate && isRotateCommand(commandToAnimate);

  useEffect(() => {
    let start, duration, cancelToken;

    const handleDrawLineFrame = time => {
      if (start === undefined) start = time;
      if (time < start + duration) {
        const elapsed = time - start;
        const { x1, x2, y1, y2 } = commandToAnimate;
        setTurtle(turtle => ({
          ...turtle,
          x: x1 + (x2 - x1) * (elapsed / duration),
          y: y1 + (y2 - y1) * (elapsed / duration)
        }));
        cancelToken = requestAnimationFrame(handleDrawLineFrame);
      } else {
        setAnimatingCommandIndex(
          animatingCommandIndex => animatingCommandIndex + 1
        );
      }
    };

    const handleRotationFrame = time => {
      if (start === undefined) start = time;
      if (time < start + duration) {
        const elapsed = time - start;
        const { previousAngle, newAngle } = commandToAnimate;
        setTurtle(turtle => ({
          ...turtle,
          angle:
            previousAngle +
            (newAngle - previousAngle) * (elapsed / duration)
        }));
        cancelToken = requestAnimationFrame(handleRotationFrame);
      } else {
        setTurtle(turtle => ({
          ...turtle,
          angle: commandToAnimate.newAngle
        }));
        setAnimatingCommandIndex(
          animatingCommandIndex => animatingCommandIndex + 1
        );
      }
    };

    if (isDrawingLine) {
      duration = movementSpeed * distance(commandToAnimate);
      cancelToken = requestAnimationFrame(handleDrawLineFrame);
    } else if (isRotating) {
      duration =
        rotateSpeed *
        Math.abs(
          commandToAnimate.newAngle -
            commandToAnimate.previousAngle
        );
      cancelToken = requestAnimationFrame(handleRotationFrame);
    }

    return () => {
      if (cancelToken) {
        cancelAnimationFrame(cancelToken);
      }
    };
  }, [commandToAnimate, isDrawingLine, isRotating]);

  return (
    <div id="viewport">
      <svg
        viewBox="-300 -300 600 600"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg">
        <StaticLines lineCommands={lineCommands} />
        {isDrawingLine ? (
          <AnimatedLine
            commandToAnimate={commandToAnimate}
            turtle={turtle}
          />
        ) : null}
        <Turtle {...turtle} />
      </svg>
    </div>
  );
});
