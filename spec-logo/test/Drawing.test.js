import React from 'react';
import { act } from 'react-dom/test-utils';
import ReactDOM from 'react-dom';
import { createContainerWithStore } from './domManipulators';
import {
  horizontalLine,
  verticalLine,
  diagonalLine
} from './sampleLines';
import * as TurtleModule from '../src/Turtle';
import * as StaticLinesModule from '../src/StaticLines';
import * as AnimatedLineModule from '../src/AnimatedLine';
import { Drawing } from '../src/Drawing';

const rotate90 = {
  drawCommand: 'rotate',
  id: 456,
  previousAngle: 0,
  newAngle: 90
};

describe('Drawing', () => {
  const cancelToken = 'cancelToken';
  let container, renderWithStore;

  beforeEach(() => {
    ({ container, renderWithStore } = createContainerWithStore());
    jest
      .spyOn(TurtleModule, 'Turtle')
      .mockReturnValue(<div id="turtle" />);
    jest
      .spyOn(window, 'requestAnimationFrame')
      .mockReturnValue(cancelToken);
    jest.spyOn(window, 'cancelAnimationFrame');
    jest
      .spyOn(AnimatedLineModule, 'AnimatedLine')
      .mockReturnValue(<div id="animatedLine" />);
    jest
      .spyOn(StaticLinesModule, 'StaticLines')
      .mockReturnValue(<div id="staticLines" />);
  });

  afterEach(() => {
    window.requestAnimationFrame.mockReset();
    window.cancelAnimationFrame.mockReset();
    AnimatedLineModule.AnimatedLine.mockReset();
  });

  const svg = () => container.querySelector('svg');
  const line = () => container.querySelector('line');
  const allLines = () => container.querySelectorAll('line');
  const polygon = () => container.querySelector('polygon');

  const triggerRequestAnimationFrame = time => {
    act(() => {
      const lastCall =
        window.requestAnimationFrame.mock.calls.length - 1;
      const frameFn =
        window.requestAnimationFrame.mock.calls[lastCall][0];
      frameFn(time);
    });
  };

  it('renders an svg inside div#viewport', () => {
    renderWithStore(<Drawing />, { script: { drawCommands: [] } });
    expect(
      container.querySelector('div#viewport > svg')
    ).not.toBeNull();
  });

  it('sets a viewbox of +/- 300 in either axis and preserves aspect ratio', () => {
    renderWithStore(<Drawing />, { script: { drawCommands: [] } });
    expect(svg()).not.toBeNull();
    expect(svg().getAttribute('viewBox')).toEqual(
      '-300 -300 600 600'
    );
    expect(svg().getAttribute('preserveAspectRatio')).toEqual(
      'xMidYMid slice'
    );
  });

  it('renders a Turtle within the svg', () => {
    renderWithStore(<Drawing />);
    expect(
      container.querySelector('svg > div#turtle')
    ).not.toBeNull();
  });

  it('passes the turtle x, y and angle as props to Turtle', () => {
    renderWithStore(<Drawing />);
    expect(TurtleModule.Turtle).toHaveBeenCalledWith(
      { x: 0, y: 0, angle: 0 },
      {}
    );
  });

  it('renders StaticLines within the svg', () => {
    const spy = jest.spyOn(StaticLinesModule, 'StaticLines');
    spy.mockReturnValue(<div id="staticLines" />);
    renderWithStore(<Drawing />);
    expect(
      container.querySelector('svg > div#staticLines')
    ).not.toBeNull();
  });

  it('does not render AnimatedLine when not moving', () => {
    renderWithStore(<Drawing />, { script: { drawCommands: [] } });
    expect(AnimatedLineModule.AnimatedLine).not.toHaveBeenCalled();
  });

  describe('movement animation', () => {
    beforeEach(() => {
      renderWithStore(<Drawing />, {
        script: { drawCommands: [horizontalLine] }
      });
    });

    it('invokes requestAnimationFrame when the timeout fires', () => {
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    it('renders an AnimatedLine with turtle at the start position when the animation has run for 0s', () => {
      triggerRequestAnimationFrame(0);
      expect(AnimatedLineModule.AnimatedLine).toHaveBeenCalledWith(
        {
          commandToAnimate: horizontalLine,
          turtle: { x: 100, y: 100, angle: 0 }
        },
        expect.anything()
      );
    });

    it('renders an AnimatedLine with turtle at a position based on a speed of 5px per ms', () => {
      triggerRequestAnimationFrame(0);
      triggerRequestAnimationFrame(250);
      expect(
        AnimatedLineModule.AnimatedLine
      ).toHaveBeenLastCalledWith(
        {
          commandToAnimate: horizontalLine,
          turtle: { x: 150, y: 100, angle: 0 }
        },
        expect.anything()
      );
    });

    it('calculates move distance with a non-zero animation start time', () => {
      const startTime = 12345;
      triggerRequestAnimationFrame(startTime);
      triggerRequestAnimationFrame(startTime + 250);
      expect(AnimatedLineModule.AnimatedLine).toHaveBeenLastCalledWith(
        {
          commandToAnimate: horizontalLine,
          turtle: { x: 150, y: 100, angle: 0 }
        },
        expect.anything()
      );
    });

    it('invokes requestAnimationFrame repeatedly until the duration is reached', () => {
      triggerRequestAnimationFrame(0);
      triggerRequestAnimationFrame(250);
      triggerRequestAnimationFrame(500);
      expect(
        window.requestAnimationFrame.mock.calls.length
      ).toEqual(3);
    });
  });

  describe('after animation', () => {
    it('animates the next command', async () => {
      renderWithStore(<Drawing />, {
        script: { drawCommands: [horizontalLine, verticalLine] }
      });
      triggerRequestAnimationFrame(0);
      triggerRequestAnimationFrame(500);
      triggerRequestAnimationFrame(0);
      triggerRequestAnimationFrame(250);
      expect(
        AnimatedLineModule.AnimatedLine
      ).toHaveBeenLastCalledWith(
        expect.objectContaining({
          commandToAnimate: verticalLine,
          turtle: {
            x: 200,
            y: 150,
            angle: 0
          }
        }),
        expect.anything()
      );
    });

    it('places line in StaticLines', () => {
      renderWithStore(<Drawing />, {
        script: { drawCommands: [horizontalLine, verticalLine] }
      });
      triggerRequestAnimationFrame(0);
      triggerRequestAnimationFrame(500);
      expect(
        StaticLinesModule.StaticLines
      ).toHaveBeenLastCalledWith(
        { lineCommands: [horizontalLine] },
        expect.anything()
      );
    });
  });

  it('calls cancelAnimationFrame on reset', () => {
    renderWithStore(<Drawing />, {
      script: { drawCommands: [horizontalLine] }
    });
    renderWithStore(<Drawing />, { script: { drawCommands: [] } });
    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(
      cancelToken
    );
  });

  it('does not call cancelAnimationFrame if no line animating', () => {
    jest.spyOn(window, 'cancelAnimationFrame');
    renderWithStore(<Drawing />, {
      script: { drawCommands: [] }
    });
    renderWithStore(<React.Fragment />);
    expect(window.cancelAnimationFrame).not.toHaveBeenCalled();
  });

  describe('rotation animation', () => {
    beforeEach(() => {
      renderWithStore(<Drawing />, {
        script: { drawCommands: [rotate90] }
      });
    });

    it('rotates the turtle', () => {
      triggerRequestAnimationFrame(0);
      triggerRequestAnimationFrame(500);
      expect(TurtleModule.Turtle).toHaveBeenLastCalledWith(
        { x: 0, y: 0, angle: 90 },
        expect.anything()
      );
    });

    it('rotates part-way at a speed of 1s per 180 degrees', () => {
      triggerRequestAnimationFrame(0);
      triggerRequestAnimationFrame(250);
      expect(TurtleModule.Turtle).toHaveBeenLastCalledWith(
        { x: 0, y: 0, angle: 45 },
        expect.anything()
      );
    });

    it('calculates rotation with a non-zero animation start time', () => {
      const startTime = 12345;
      triggerRequestAnimationFrame(startTime);
      triggerRequestAnimationFrame(startTime + 250);
      expect(TurtleModule.Turtle).toHaveBeenLastCalledWith(
        { x: 0, y: 0, angle: 45 },
        expect.anything()
      );
    });

    it('invokes requestAnimationFrame repeatedly until the duration is reached', () => {
      triggerRequestAnimationFrame(0);
      triggerRequestAnimationFrame(250);
      triggerRequestAnimationFrame(500);
      expect(
        window.requestAnimationFrame.mock.calls.length
      ).toEqual(3);
    });
  });

  it('animates the next command once rotation is complete', async () => {
    renderWithStore(<Drawing />, {
      script: { drawCommands: [rotate90, horizontalLine] }
    });
    triggerRequestAnimationFrame(0);
    triggerRequestAnimationFrame(500);
    triggerRequestAnimationFrame(0);
    triggerRequestAnimationFrame(250);
    expect(TurtleModule.Turtle).toHaveBeenLastCalledWith(
      { x: 150, y: 100, angle: 90 },
      expect.anything()
    );
  });

  describe('resetting', () => {
    it('resets Turtle position and angle to all-zeros', async () => {
      renderWithStore(<Drawing />, {
        script: { drawCommands: [horizontalLine, rotate90] }
      });
      triggerRequestAnimationFrame(0);
      triggerRequestAnimationFrame(500);
      triggerRequestAnimationFrame(0);
      triggerRequestAnimationFrame(500);
      renderWithStore(<Drawing />, {
        script: { drawCommands: [] }
      });
      expect(TurtleModule.Turtle).toHaveBeenLastCalledWith(
        { x: 0, y: 0, angle: 0 },
        expect.anything()
      );
    });
  });
});
