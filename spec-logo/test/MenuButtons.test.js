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

  describe('undo button', () => {
    it('renders', () => {
      renderWithStore(<MenuButtons />);
      expect(button('Undo')).not.toBeNull();
    });

    it('is disabled if there is no history', () => {
      renderWithStore(<MenuButtons />);
      expect(button('Undo').hasAttribute('disabled')).toBeTruthy();
    });

    it('is enabled if an action occurs', () => {
      const store = renderWithStore(<MenuButtons />);
      store.dispatch({
        type: 'SUBMIT_EDIT_LINE',
        text: 'forward 10\n'
      });
      expect(button('Undo').hasAttribute('disabled')).toBeFalsy();
    });

    it('dispatches an action of UNDO when clicked', () => {
      const store = renderWithStore(<MenuButtons />);
      store.dispatch({
        type: 'SUBMIT_EDIT_LINE',
        text: 'forward 10\n'
      });
      click(button('Undo'));
      return expectRedux(store)
        .toDispatchAnAction()
        .matching({ type: 'UNDO' });
    });
  });

  describe('redo button', () => {
    it('renders', () => {
      renderWithStore(<MenuButtons />);
      expect(button('Redo')).not.toBeNull();
    });

    it('is disabled if undo has not occurred yet', () => {
      const store = renderWithStore(<MenuButtons />);
      store.dispatch({
        type: 'SUBMIT_EDIT_LINE',
        text: 'forward 10\n'
      });
      expect(button('Redo').hasAttribute('disabled')).toBeTruthy();
    });

    it('is enabled if an undo occurred', () => {
      const store = renderWithStore(<MenuButtons />);
      store.dispatch({
        type: 'SUBMIT_EDIT_LINE',
        text: 'forward 10\n'
      });
      store.dispatch({ type: 'UNDO' });
      expect(button('Redo').hasAttribute('disabled')).toBeFalsy();
    });

    it('dispatches an action of REDO when clicked', () => {
      const store = renderWithStore(<MenuButtons />);
      store.dispatch({
        type: 'SUBMIT_EDIT_LINE',
        text: 'forward 10\n'
      });
      click(button('Undo'));
      click(button('Redo'));
      return expectRedux(store)
        .toDispatchAnAction()
        .matching({ type: 'REDO' });
    });
  });
});
