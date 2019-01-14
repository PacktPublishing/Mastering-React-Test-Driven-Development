export const rotate = (state, angleValue) => {
  const { turtle, drawCommands } = state;
  let { nextDrawCommandId } = state;

  const angleChange = angleValue.get(state);
  const angle = angleChange + turtle.angle;
  return {
    drawCommands: [
      ...drawCommands,
      {
        drawCommand: 'rotate',
        id: nextDrawCommandId++,
        angle
      }
    ],
    turtle: { ...turtle, angle }
  };
};
