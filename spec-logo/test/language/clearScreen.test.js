import { clearScreen } from '../../src/language/clearScreen';

const initialState = {
  drawCommands: [],
  turtle: { x: 0, y: 0, angle: 0 },
  pen: { down: true }
};

describe('clearScreen', () => {
  let result;

  describe('perform', () => {
    it('removes all draw commands', () => {
      const newState = clearScreen.perform({
        drawCommands: [1, 2, 3]
      });
      expect(newState.drawCommands).toEqual([]);
    });

    it('moves turtle back to initial position', () => {
      const newState = clearScreen.perform({
        turtle: { x: 123, y: 234, angle: 345 }
      });
      expect(newState.turtle).toEqual({ x: 0, y: 0, angle: 0 });
    });

    it('maintains other properties', () => {
      const newState = clearScreen.perform({ a: 123 });
      expect(newState.a).toEqual(123);
    });
  });
});
