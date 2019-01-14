import React from 'react';
import ReactDOM from 'react-dom';
import {
  createContainer,
  createContainerWithStore
} from './domManipulators';
import { Turtle, Drawing } from '../src/Drawing';

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

describe('Turtle', () => {
  let container, render;

  beforeEach(() => {
    ({ container, render } = createContainer());
  });

  const polygon = () => container.querySelector('polygon');
  const mountSvg = component => render(<svg>{component}</svg>);

  it('draws a polygon at the x,y co-ordinate', () => {
    mountSvg(<Turtle x={10} y={10} angle={10} />);
    expect(polygon()).not.toBeNull();
    expect(polygon().getAttribute('points')).toEqual(
      '5,15, 10,3, 15,15'
    );
  });

  it('sets a stroke width of 2', () => {
    mountSvg(<Turtle x={10} y={10} angle={10} />);
    expect(polygon().getAttribute('stroke-width')).toEqual('2');
  });

  it('sets a stroke color of black', () => {
    mountSvg(<Turtle x={10} y={10} angle={10} />);
    expect(polygon().getAttribute('stroke')).toEqual('black');
  });

  it('sets a fill of green', () => {
    mountSvg(<Turtle x={10} y={10} angle={10} />);
    expect(polygon().getAttribute('fill')).toEqual('green');
  });

  it('sets a transform with the angle', () => {
    mountSvg(<Turtle x={10} y={20} angle={30} />);
    expect(polygon().getAttribute('transform')).toEqual(
      'rotate(120, 10, 20)'
    );
  });
});

describe('Drawing', () => {
  let container, renderWithStore;

  beforeEach(() => {
    ({ container, renderWithStore } = createContainerWithStore());
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

  it('renders a Turtle at the current turtle position', async () => {
    const turtle = { x: 10, y: 20, angle: 30 };
    renderWithStore(<Drawing />, {
      script: { drawCommands: [], turtle }
    });

    expect(polygon()).not.toBeNull();
    expect(polygon().getAttribute('points')).toEqual(
      '5,25, 10,13, 15,25'
    );
    expect(polygon().getAttribute('transform')).toEqual(
      'rotate(120, 10, 20)'
    );
  });
});
