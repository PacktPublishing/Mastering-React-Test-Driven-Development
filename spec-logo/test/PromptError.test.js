import React from 'react';
import { expectRedux } from 'expect-redux';
import { createContainerWithStore } from './domManipulators';
import { PromptError } from '../src/PromptError';

describe('PromptError', () => {
  let container, renderWithStore;

  beforeEach(() => {
    ({ container, renderWithStore } = createContainerWithStore());
  });

  const renderInTableWithStore = (component, initialState = {}) =>
    renderWithStore(<table>{component}</table>, initialState);

  it('renders a tbody', () => {
    renderInTableWithStore(<PromptError />);
    expect(container.querySelector('tbody')).not.toBeNull();
  });

  it('renders a single td with a colspan of 2', () => {
    renderInTableWithStore(<PromptError />);
    expect(container.querySelectorAll('td').length).toEqual(1);
    expect(
      container.querySelector('td').getAttribute('colSpan')
    ).toEqual('2');
  });

  it('has no error text in the table cell', () => {
    renderInTableWithStore(<PromptError />);
    expect(container.querySelector('td').textContent).toEqual('');
  });

  describe('with error present', () => {
    const initialStoreState = {
      script: { error: { description: 'error message' } }
    };

    it('displays the error from state in a table cell', () => {
      renderInTableWithStore(<PromptError />, initialStoreState);
      expect(container.querySelector('td').textContent).toEqual(
        'error message'
      );
    });
  });
});
