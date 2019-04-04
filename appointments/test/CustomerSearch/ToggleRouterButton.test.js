import React from 'react';
import { Link } from 'react-router-dom';
import { createShallowRenderer } from '../shallowHelpers';
import { ToggleRouterButton } from '../../src/CustomerSearch/ToggleRouterButton';

describe('ToggleRouterButton', () => {
  const pathname = '/path';
  const queryParams = { a: '123', b: '234' };
  let render, elementMatching, root;

  beforeEach(() => {
    ({ render, elementMatching, root } = createShallowRenderer());
  });

  it('renders a Link', () => {
    render(
      <ToggleRouterButton
        pathname={pathname}
        queryParams={queryParams}
      />
    );
    expect(root().type).toEqual(Link);
    expect(root().props.className).toContain('button');
    expect(root().props.to).toEqual({
      pathname: '/path',
      search: '?a=123&b=234'
    });
  });

  it('renders children', () => {
    render(
      <ToggleRouterButton queryParams={queryParams}>
        child text
      </ToggleRouterButton>
    );
    expect(root().props.children).toEqual('child text');
  });

  it('adds toggled class if toggled prop is true', () => {
    render(
      <ToggleRouterButton
        queryParams={queryParams}
        toggled={true}
      />
    );
    expect(root().props.className).toContain('toggled');
  });
});
