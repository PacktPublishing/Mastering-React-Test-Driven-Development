import React from 'react';
import { createContainerWithStore } from './domManipulators';
import { expectRedux } from 'expect-redux';
import { ScriptName } from '../src/ScriptName';

describe('ScriptName', () => {
  let container, renderWithStore, blur, change, focus, keyPress;

  beforeEach(() => {
    ({
      container,
      renderWithStore,
      blur,
      change,
      focus,
      keyPress
    } = createContainerWithStore());
  });

  const inputField = () => container.querySelector('input');

  it('renders an input box with the script name from the store', () => {
    renderWithStore(<ScriptName />);
    expect(inputField().value).toEqual('Unnamed script');
  });

  it('has a class name of isEditing when the input field has focus', () => {
    renderWithStore(<ScriptName />);
    focus(inputField());
    expect(inputField().className).toContain('isEditing');
  });

  it('does not initially have a class name of isEditing', () => {
    renderWithStore(<ScriptName />);
    expect(inputField().className).not.toContain('isEditing');
  });

  describe('when the user hits Enter', () => {
    let store;

    beforeEach(() => {
      store = renderWithStore(<ScriptName />);
      focus(inputField());
      change(inputField(), { target: { value: 'new name' } });
      keyPress(inputField(), { key: 'Enter' });
    });

    it('submits the new name when the user hits Enter', () => {
      return expectRedux(store)
        .toDispatchAnAction()
        .matching({
          type: 'SUBMIT_SCRIPT_NAME',
          text: 'new name'
        });
    });

    it('removes the isEditing class name', () => {
      expect(inputField().className).not.toContain('isEditing');
    });

    it('does not resubmit when losing focus after change', () => {
      blur(inputField());
      expect(inputField().className).not.toContain('isEditing');
    });

    it('dispatches a prompt focus request', () => {
      return expectRedux(store)
        .toDispatchAnAction()
        .matching({ type: 'PROMPT_FOCUS_REQUEST' });
    });
  });

  describe('when the user moves focus somewhere else', () => {
    let store;
    beforeEach(() => {
      store = renderWithStore(<ScriptName />);
      focus(inputField());
      change(inputField(), { target: { value: 'new name' } });
      blur(inputField());
    });

    it('submits the new name when the field loses focus', () => {
      return expectRedux(store)
        .toDispatchAnAction()
        .matching({
          type: 'SUBMIT_SCRIPT_NAME',
          text: 'new name'
        });
    });
  });
});
