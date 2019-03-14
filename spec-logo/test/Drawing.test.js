import React from 'react';
import ReactDOM from 'react-dom';
import { createContainerWithStore, type } from './domManipulators';
import * as TurtleModule from '../src/Turtle';
import { Drawing } from '../src/Drawing';

const horizontalLine = {
  drawCommand: 'drawLine',
  id: 123,
  x1: 100,
  y1: 100,
  x2: 200,
  y2: 100
};
const verticalLine = {
  drawCommand: 'drawLine',
  id: 234,
  x1: 200,
  y1: 100,
  x2: 200,
  y2: 200
};
const diagonalLine = {
  drawCommand: 'drawLine',
  id: 235,
  x1: 200,
  y1: 200,
  x2: 300,
  y2: 300
};
let rotate90 = { drawCommand: 'rotate', id: 456, angle: 90 };
const turtle = { x: 0, y: 0, angle: 0 };

describe('Drawing', () => {
  let container, renderWithStore, turtleSpy;
  let store;

  beforeEach(() => {
    ({ container, renderWithStore } = createContainerWithStore());
    turtleSpy = jest.spyOn(TurtleModule, 'Turtle');
    turtleSpy.mockReturnValue(<div id="turtle" />);
  });

  const svg = () => container.querySelector('svg');
  const line = () => container.querySelector('line');
  const allLines = () => container.querySelectorAll('line');
  const polygon = () => container.querySelector('polygon');

  it('renders an svg inside div#viewport', () => {
    renderWithStore(<Drawing />, {
      script: { drawCommands: [], turtle }
    });
    expect(
      container.querySelector('div#viewport > svg')
    ).not.toBeNull();
  });

  it('sets a viewbox of +/- 300 in either axis and preserves aspect ratio', () => {
    renderWithStore(<Drawing />, {
      script: { drawCommands: [], turtle }
    });
    expect(svg()).not.toBeNull();
    expect(svg().getAttribute('viewBox')).toEqual(
      '-300 -300 600 600'
    );
    expect(svg().getAttribute('preserveAspectRatio')).toEqual(
      'xMidYMid slice'
    );
  });

  it('renders a line with the line coordinates', () => {
    renderWithStore(<Drawing />, {
      script: { drawCommands: [horizontalLine], turtle }
    });
    expect(line()).not.toBeNull();
    expect(line().getAttribute('x1')).toEqual('100');
    expect(line().getAttribute('y1')).toEqual('100');
    expect(line().getAttribute('x2')).toEqual('200');
    expect(line().getAttribute('y2')).toEqual('100');
  });

  it('sets a stroke width of 2', () => {
    renderWithStore(<Drawing />, {
      script: { drawCommands: [horizontalLine], turtle }
    });
    expect(line().getAttribute('stroke-width')).toEqual('2');
  });

  it('sets a stroke color of black', () => {
    renderWithStore(<Drawing />, {
      script: { drawCommands: [horizontalLine], turtle }
    });
    expect(line().getAttribute('stroke')).toEqual('black');
  });

  it('draws every drawLine command', () => {
    renderWithStore(<Drawing />, {
      script: {
        drawCommands: [horizontalLine, verticalLine, diagonalLine],
        turtle
      }
    });
    expect(allLines().length).toEqual(3);
  });

  it('does not draw any commands for non-drawLine commands', () => {
    const unknown = { drawCommand: 'unknown' };
    renderWithStore(<Drawing />, {
      script: { drawCommands: [unknown], turtle }
    });
    expect(line()).toBeNull();
  });

  it('renders a Turtle within the svg', () => {
    renderWithStore(<Drawing />);
    expect(
      container.querySelector('svg > div#turtle')
    ).not.toBeNull();
  });

  it('passes the turtle x, y and angle as props to Turtle', () => {
    const turtle = { x: 10, y: 20, angle: 30 };
    renderWithStore(<Drawing />, {
      script: { drawCommands: [], turtle }
    });
    expect(turtleSpy).toHaveBeenCalledWith(
      { x: 10, y: 20, angle: 30 },
      {}
    );
  });
});
