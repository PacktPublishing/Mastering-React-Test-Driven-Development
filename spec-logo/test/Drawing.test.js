import React from 'react';
import ReactDOM from 'react-dom';
import { createContainerWithStore } from './domManipulators';
import {
  horizontalLine,
  verticalLine,
  diagonalLine
} from './sampleLines';
import * as TurtleModule from '../src/Turtle';
import * as StaticLinesModule from '../src/StaticLines';
import { Drawing } from '../src/Drawing';

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
    const turtle = { x: 10, y: 20, angle: 30 };
    renderWithStore(<Drawing />, {
      script: { drawCommands: [], turtle }
    });
    expect(turtleSpy).toHaveBeenCalledWith(
      { x: 10, y: 20, angle: 30 },
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

  it('sends only line commands to StaticLines', () => {
    const unknown = { drawCommand: 'unknown' };
    renderWithStore(<Drawing />, {
      script: {
        drawCommands: [horizontalLine, verticalLine, unknown]
      }
    });
    expect(StaticLinesModule.StaticLines).toHaveBeenLastCalledWith(
      { lineCommands: [horizontalLine, verticalLine] },
      expect.anything()
    );
  });
});
