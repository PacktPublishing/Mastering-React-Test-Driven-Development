import React from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from './domManipulators';
import { Turtle } from '../src/Turtle';

describe('Turtle', () => {
  let container, render;

  beforeEach(() => {
    ({ container, render } = createContainer());
  });

  const polygon = () => container.querySelector('polygon');
  const renderSvg = component => render(<svg>{component}</svg>);

  it('draws a polygon at the x,y co-ordinate', () => {
    renderSvg(<Turtle x={10} y={10} angle={10} />);
    expect(polygon()).not.toBeNull();
    expect(polygon().getAttribute('points')).toEqual(
      '5,15, 10,3, 15,15'
    );
  });

  it('sets a stroke width of 2', () => {
    renderSvg(<Turtle x={10} y={10} angle={10} />);
    expect(polygon().getAttribute('stroke-width')).toEqual('2');
  });

  it('sets a stroke color of black', () => {
    renderSvg(<Turtle x={10} y={10} angle={10} />);
    expect(polygon().getAttribute('stroke')).toEqual('black');
  });

  it('sets a fill of green', () => {
    renderSvg(<Turtle x={10} y={10} angle={10} />);
    expect(polygon().getAttribute('fill')).toEqual('green');
  });

  it('sets a transform with the angle', () => {
    renderSvg(<Turtle x={10} y={20} angle={30} />);
    expect(polygon().getAttribute('transform')).toEqual(
      'rotate(120, 10, 20)'
    );
  });
});
