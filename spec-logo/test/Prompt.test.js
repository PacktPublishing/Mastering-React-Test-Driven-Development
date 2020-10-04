import React from 'react';
import { act } from 'react-dom/test-utils';
import { expectRedux } from 'expect-redux';
import { createContainerWithStore } from './domManipulators';
import { Prompt } from '../src/Prompt';

describe('Prompt', () => {
  let container, renderWithStore, change, keyPress;

  beforeEach(() => {
    ({
      container,
      renderWithStore,
      change,
      keyPress
    } = createContainerWithStore());
  });

  const renderInTableWithStore = component =>
    renderWithStore(<table>{component}</table>);

  it('renders a tbody', () => {
    renderInTableWithStore(<Prompt />);
    expect(container.querySelector('tbody')).not.toBeNull();
  });

  it('renders a table cell with a prompt indicator as the first cell in each row', () => {
    renderInTableWithStore(<Prompt />);
    const td = container.querySelectorAll('tr')[0].childNodes[0];
    expect(td.textContent).toEqual('>');
    expect(td.className).toContain('promptIndicator');
  });

  const textArea = () =>
    container.querySelectorAll('tr')[0].childNodes[1]
      .childNodes[0];

  it('renders a table cell with an empty textarea', () => {
    renderInTableWithStore(<Prompt />);
    expect(textArea().tagName).toEqual('TEXTAREA');
    expect(textArea().value).toEqual('');
  });

  it('sets the textarea text to initially have a height of 20', () => {
    renderInTableWithStore(<Prompt />);
    expect(textArea().getAttribute('style')).toEqual(
      'height: 20px;'
    );
  });

  const enterInstruction = text => {
    keyPress(textArea(), { key: 'Enter' });
    change(textArea(), { target: { value: text } });
  };

  describe('user enters an instruction', () => {
    it('dispatches an action with the updated edit line when the user hits enter on the text field', () => {
      const line = 'repeat 4\n[ forward 10 right 90 ]\n';
      const store = renderInTableWithStore(<Prompt />);
      enterInstruction(line);
      return expectRedux(store)
        .toDispatchAnAction()
        .matching({ type: 'SUBMIT_EDIT_LINE', text: line });
    });

    it('blanks the edit field', () => {
      const store = renderInTableWithStore(<Prompt />);
      enterInstruction('forward 10\n');
      expect(textArea().value).toEqual('');
    });

    it('dispatches a START_ANIMATING event', () => {
      const store = renderInTableWithStore(<Prompt />);
      enterInstruction('forward 10\n');
      return expectRedux(store)
        .toDispatchAnAction()
        .matching({ type: 'START_ANIMATING' });
    });
  });

  describe('prompt focus', () => {
    it('sets focus when component first renders', () => {
      renderInTableWithStore(<Prompt />);
      expect(document.activeElement).toEqual(textArea());
    });

    const jsdomClearFocus = () => {
      const node = document.createElement('input');
      document.body.appendChild(node);
      node.focus();
      node.remove();
    };

    it('calls focus on the underlying DOM element if promptFocusRequest is true', async () => {
      const store = renderInTableWithStore(<Prompt />);
      jsdomClearFocus();
      act(() => {
        store.dispatch({ type: 'PROMPT_FOCUS_REQUEST' });
      });
      expect(document.activeElement).toEqual(textArea());
    });

    it('dispatches an action notifying that the prompt has focused', () => {
      const store = renderInTableWithStore(<Prompt />);
      store.dispatch({ type: 'PROMPT_FOCUS_REQUEST' });
      return expectRedux(store)
        .toDispatchAnAction()
        .matching({ type: 'PROMPT_HAS_FOCUSED' });
    });
  });
});
