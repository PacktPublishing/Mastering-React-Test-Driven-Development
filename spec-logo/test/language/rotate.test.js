import { rotate } from '../../src/language/rotate';

describe('rotate', () => {
  const initialState = {
    drawCommands: [{}],
    nextDrawCommandId: 1,
    turtle: { angle: 10 }
  };

  const angleValue = { get: () => 10 };

  it('sets the turtle to the updated angle', () => {
    const updated = rotate(
      { ...initialState, turtle: { angle: 10 } },
      angleValue
    );
    expect(updated.turtle.angle).toEqual(20);
  });

  it('maintains existing draw commands', () => {
    const existing = { a: 123 };
    const updated = rotate(
      { ...initialState, drawCommands: [existing] },
      angleValue
    );
    expect(updated.drawCommands[0]).toBe(existing);
  });

  it('appends a draw command for the rotation', () => {
    const updated = rotate(initialState, angleValue);
    expect(updated.drawCommands[1]).toBeDefined();
    expect(updated.drawCommands[1].drawCommand).toEqual('rotate');
    expect(updated.drawCommands[1].id).toEqual(1);
    expect(updated.drawCommands[1].newAngle).toEqual(20);
    expect(updated.drawCommands[1].previousAngle).toEqual(10);
  });
});
