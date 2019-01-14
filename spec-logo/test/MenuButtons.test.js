import React from 'react';
import { createContainer } from './domManipulators';
import { MenuButtons } from '../src/MenuButtons';

describe('MenuButtons', () => {
  let container, render;

  beforeEach(() => {
    ({ container, render } = createContainer());
  });

  it('renders nothing', () => {
    render(<MenuButtons />);
    expect(container.childNodes.length).toEqual(0);
  });
});
