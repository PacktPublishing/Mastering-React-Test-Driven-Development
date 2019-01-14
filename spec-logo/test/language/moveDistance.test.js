import { moveDistance } from '../../src/language/moveDistance';

const value = v => ({ get: () => v });

const initialState = {
  drawCommands: [],
  turtle: { x: 0, y: 0, angle: 0 },
  pen: { down: true },
  nextDrawCommandId: 123
};

describe('moveDistance', () => {
  let result;

  function doMove(state, distance) {
    result = moveDistance(state, value(distance));
  }

  describe('when angle is 0', () => {
    it('increases turtle x', () => {
      doMove(initialState, 100);
      expect(result.turtle.x).toEqual(100);
    });

    it('adds a new draw command when moving forward', () => {
      doMove(initialState, 100);
      expect(result.drawCommands).toEqual([
        {
          drawCommand: 'drawLine',
          id: 123,
          x1: 0,
          y1: 0,
          x2: 100,
          y2: 0
        }
      ]);
    });

    it('maintains existing draw commands', () => {
      doMove({ ...initialState, drawCommands: [1, 2, 3] }, 100);
      expect(result.drawCommands.slice(0, 3)).toEqual([1, 2, 3]);
    });

    it('maintains existing turtle properties', () => {
      doMove(initialState, 100);
      expect(result.turtle.angle).toEqual(0);
    });

    it('descreases x when moving with a negative direction', () => {
      doMove(initialState, -100);
      expect(result.turtle.x).toEqual(-100);
    });
  });

  describe('when angle is 90', () => {
    it('increases turtle y', () => {
      doMove(
        { ...initialState, turtle: { x: 0, y: 0, angle: 90 } },
        100
      );
      expect(result.turtle.y).toEqual(100);
    });
  });

  const radians = angle => (Math.PI * angle) / 180;
  describe('when angle is 30', () => {
    it('uses cos to calculate x', () => {
      doMove(
        { ...initialState, turtle: { x: 0, y: 0, angle: 30 } },
        100
      );
      expect(result.turtle.x).toEqual(Math.cos(radians(30)) * 100);
    });

    it('uses sin to calculate y', () => {
      doMove(
        { ...initialState, turtle: { x: 0, y: 0, angle: 30 } },
        100
      );
      expect(result.turtle.y).toEqual(Math.sin(radians(30)) * 100);
    });
  });

  describe('penup', () => {
    it('does not draw line if pen is up', () => {
      doMove({ ...initialState, pen: { down: false } }, 10);
      expect(result.drawCommands).toEqual([]);
    });
  });

  describe('next draw command id', () => {
    it('adds the next id to the next command', () => {
      doMove({ ...initialState, nextDrawCommandId: 123 }, 100);
      expect(result.drawCommands[0].id).toEqual(123);
    });

    it('increases next id after command', () => {
      doMove({ ...initialState, nextDrawCommandId: 123 }, 100);
      expect(result.nextDrawCommandId).toEqual(124);
    });
  });
});
