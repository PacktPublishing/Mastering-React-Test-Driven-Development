import React from 'react';
import { createContainer } from './domManipulators';
import { Dialog } from '../src/Dialog';

describe('Dialog', () => {
  let container, render, click;
  let onChooseSpy;
  let onCloseSpy;

  beforeEach(() => {
    ({ container, render, click } = createContainer());
    onChooseSpy = jest.fn();
    onCloseSpy = jest.fn();
  });

  const renderDialog = props =>
    render(
      <Dialog
        message={'Hello'}
        buttons={[]}
        onChoose={onChooseSpy}
        onClose={onCloseSpy}
        {...props}
      />
    );

  it('renders a div with className dialog', () => {
    renderDialog();
    expect(container.querySelector('div.dialog')).not.toBeNull();
  });

  it('renders message in a paragraph element', () => {
    renderDialog({ message: 'This is a message' });
    expect(container.querySelector('p')).not.toBeNull();
    expect(container.querySelector('p').textContent).toEqual(
      'This is a message'
    );
  });

  it('renders a div with className dialogButtons inside dialog', () => {
    renderDialog();
    expect(
      container.querySelector('div.dialog > div.dialogButtons')
    ).not.toBeNull();
  });

  it('renders button properties', () => {
    renderDialog({ buttons: [{ id: 'yes', text: 'Yes' }] });
    expect(container.querySelector('button').id).toEqual('yes');
    expect(container.querySelector('button').textContent).toEqual(
      'Yes'
    );
  });

  it('renders all buttons inside the dialogButtons div', () => {
    renderDialog({
      buttons: [
        { id: 'yes', text: 'Yes' },
        { id: 'no', text: 'No' }
      ]
    });
    const buttons = Array.from(
      container.querySelectorAll('div.dialogButtons > button')
    );
    expect(buttons.length).toEqual(2);
    expect(buttons.map(button => button.id)).toEqual([
      'yes',
      'no'
    ]);
  });

  it('calls onChoose with the button id when it is clicked', () => {
    renderDialog({
      buttons: [
        { id: 'yes', text: 'Yes' },
        { id: 'no', text: 'No' }
      ]
    });
    click(container.querySelector('button#yes'));
    expect(onChooseSpy).toHaveBeenCalledWith('yes');
  });

  it('calls onClose when a butotn is clicked', () => {
    renderDialog({
      buttons: [
        { id: 'yes', text: 'Yes' },
        { id: 'no', text: 'No' }
      ]
    });
    click(container.querySelector('button#yes'));
    expect(onCloseSpy).toHaveBeenCalled();
  });
});
