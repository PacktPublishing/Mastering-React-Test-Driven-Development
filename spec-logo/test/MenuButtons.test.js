import React from 'react';
import { act } from 'react-dom/test-utils';
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

  describe('skip animation button', () => {
    it('renders', () => {
      renderWithStore(<MenuButtons />);
      expect(button('Skip animation')).not.toBeNull();
    });

    it('is disabled if animations have already been skipped', () => {
      const store = renderWithStore(<MenuButtons />);
      store.dispatch({
        type: 'SKIP_ANIMATING'
      });
      expect(
        button('Skip animation').hasAttribute('disabled')
      ).toBeTruthy();
    });

    it('is enabled if animations have already been skipped', () => {
      const store = renderWithStore(<MenuButtons />);
      store.dispatch({
        type: 'START_ANIMATING'
      });
      expect(
        button('Skip animation').hasAttribute('disabled')
      ).toBeFalsy();
    });

    it('dispatches a SKIP_ANIMATING action when clicked', () => {
      const store = renderWithStore(<MenuButtons />);
      store.dispatch({
        type: 'START_ANIMATING'
      });
      click(button('Skip animation'));
      return expectRedux(store)
        .toDispatchAnAction()
        .matching({ type: 'SKIP_ANIMATING' });
    });
  });

  describe('sharing button', () => {
    let socketSpyFactory;
    let socketSpy;

    beforeEach(() => {
      socketSpyFactory = jest.spyOn(window, 'WebSocket');
      socketSpyFactory.mockImplementation(() => {
        socketSpy = {
          close: () => {},
          send: () => {}
        };
        return socketSpy;
      });
    });

    afterEach(() => {
      socketSpyFactory.mockReset();
    });

    it('renders Start sharing by default', () => {
      renderWithStore(<MenuButtons />);
      expect(button('Start sharing')).not.toBeNull();
    });

    it('renders Stop sharing if sharing has started', () => {
      const store = renderWithStore(<MenuButtons />);
      store.dispatch({ type: 'STARTED_SHARING' });
      expect(button('Stop sharing')).not.toBeNull();
    });

    it('renders Start sharing if sharing has stopped', () => {
      const store = renderWithStore(<MenuButtons />);
      store.dispatch({ type: 'STARTED_SHARING' });
      store.dispatch({ type: 'STOPPED_SHARING' });
      expect(button('Start sharing')).not.toBeNull();
    });

    it('dispatches an action of START_SHARING when start sharing is clicked', () => {
      const store = renderWithStore(<MenuButtons />);
      click(button('Start sharing'));
      return expectRedux(store)
        .toDispatchAnAction()
        .matching({ type: 'START_SHARING' });
    });

    const notifySocketOpened = async () => {
      await act(async () => {
        socketSpy.onopen();
      });
    };

    it('dispatches an action of STOP_SHARING when stop sharing is clicked', async () => {
      const store = renderWithStore(<MenuButtons />);
      store.dispatch({ type: 'STARTED_SHARING' });
      await notifySocketOpened();
      click(button('Stop sharing'));
      return expectRedux(store)
        .toDispatchAnAction()
        .matching({ type: 'STOP_SHARING' });
    });
  });

  describe('messages', () => {
    it('renders a message containing the url if sharing has started', () => {
      const store = renderWithStore(<MenuButtons />);
      store.dispatch({
        type: 'STARTED_SHARING',
        url: 'http://123'
      });
      expect(container.innerHTML).toContain(
        'You are now presenting your script. <a href="http://123">Here\'s the URL for sharing.</a></p>'
      );
    });

    it('renders a message when watching has started', () => {
      const store = renderWithStore(<MenuButtons />);
      store.dispatch({ type: 'STARTED_WATCHING' });
      expect(container.innerHTML).toContain(
        '<p>You are now watching the session</p>'
      );
    });
  });
});
