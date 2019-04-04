import React from 'react';
import { createShallowRenderer, type } from './shallowHelpers';
import { CustomerSearchRoute } from '../src/CustomerSearchRoute';
import { CustomerSearch } from '../src/CustomerSearch/CustomerSearch';

describe('CustomerSearchRoute', () => {
  let render, elementMatching;

  beforeEach(() => {
    ({ render, elementMatching } = createShallowRenderer());
  });

  it('parses searchTerm from query string', () => {
    const location = { search: '?searchTerm=abc' };
    render(<CustomerSearchRoute location={location} />);
    expect(
      elementMatching(type(CustomerSearch)).props.searchTerm
    ).toEqual('abc');
  });

  it('parses limit from query string', () => {
    const location = { search: '?limit=123' };
    render(<CustomerSearchRoute location={location} />);
    expect(
      elementMatching(type(CustomerSearch)).props.limit
    ).toEqual(123);
  });

  it('parses lastRowIds from query string', () => {
    const location = {
      search: '?lastRowIds=' + encodeURIComponent('1,2,3')
    };
    render(<CustomerSearchRoute location={location} />);
    expect(
      elementMatching(type(CustomerSearch)).props.lastRowIds
    ).toEqual(['1', '2', '3']);
  });

  it('removes empty lastRowIds from query string', () => {
    const location = { search: '?lastRowIds=' };
    render(<CustomerSearchRoute location={location} />);
    expect(
      elementMatching(type(CustomerSearch)).props.lastRowIds
    ).toEqual([]);
  });

  it('passes all other props through to CustomerSearch', () => {
    const props = { a: '123', b: '456' };
    render(<CustomerSearchRoute {...props} location={{}} />);
    expect(elementMatching(type(CustomerSearch)).props.a).toEqual(
      '123'
    );
    expect(elementMatching(type(CustomerSearch)).props.b).toEqual(
      '456'
    );
  });
});
