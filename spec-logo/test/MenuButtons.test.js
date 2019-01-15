import React from 'react';
import { expectRedux } from 'expect-redux';
import { createContainerWithStore } from './domManipulators';
import { MenuButtons } from '../src/MenuButtons';

describe('MenuButtons', () => {
  let container, renderWithStore, click;

  beforeEach(() => {
    ({
      container,
      renderWithStore,
      click
    } = createContainerWithStore());
  });

  const button = text =>
    Array.from(container.querySelectorAll('button')).find(
      b => b.textContent === text
    );

  describe('reset button', () => {
    it('renders', () => {
      renderWithStore(<MenuButtons />);
      expect(button('Reset')).not.toBeNull();
    });

    it('is disabled initially', () => {
      renderWithStore(<MenuButtons />);
      expect(
        button('Reset').hasAttribute('disabled')
      ).toBeTruthy();
    });

    it('is enabled once a state change occurs', () => {
      const store = renderWithStore(<MenuButtons />);
      store.dispatch({
        type: 'SUBMIT_EDIT_LINE',
        text: 'forward 10\n'
      });
      expect(button('Reset').hasAttribute('disabled')).toBeFalsy();
    });

    it('dispatches an action of RESET when clicked', () => {
      const store = renderWithStore(<MenuButtons />);
      store.dispatch({
        type: 'SUBMIT_EDIT_LINE',
        text: 'forward 10\n'
      });
      click(button('Reset'));
      return expectRedux(store)
        .toDispatchAnAction()
        .matching({ type: 'RESET' });
    });
  });
});
