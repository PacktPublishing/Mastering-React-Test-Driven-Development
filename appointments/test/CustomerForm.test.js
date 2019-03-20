import React from 'react';
import 'whatwg-fetch';
import {
  fetchResponseOk,
  fetchResponseError,
  requestBodyOf
} from './spyHelpers';
import { createContainer, withEvent } from './domManipulators';
import { CustomerForm } from '../src/CustomerForm';

describe('CustomerForm', () => {
  let render,
    container,
    form,
    field,
    labelFor,
    element,
    change,
    submit;

  beforeEach(() => {
    ({
      render,
      container,
      form,
      field,
      labelFor,
      element,
      change,
      submit
    } = createContainer());
    jest
      .spyOn(window, 'fetch')
      .mockReturnValue(fetchResponseOk({}));
  });

  afterEach(() => {
    window.fetch.mockRestore();
  });

  it('renders a form', () => {
    render(<CustomerForm />);
    expect(form('customer')).not.toBeNull();
  });

  it('has a submit button', () => {
    render(<CustomerForm />);
    const submitButton = element('input[type="submit"]');
    expect(submitButton).not.toBeNull();
  });

  it('calls fetch with the right properties when submitting data', async () => {
    render(<CustomerForm />);

    await submit(form('customer'));
    expect(window.fetch).toHaveBeenCalledWith(
      '/customers',
      expect.objectContaining({
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' }
      })
    );
  });

  it('notifies onSave when form is submitted', async () => {
    const customer = { id: 123 };
    window.fetch.mockReturnValue(fetchResponseOk(customer));
    const saveSpy = jest.fn();

    render(<CustomerForm onSave={saveSpy} />);
    await submit(form('customer'));

    expect(saveSpy).toHaveBeenCalledWith(customer);
  });

  it('does not notify onSave if the POST request returns an error', async () => {
    window.fetch.mockReturnValue(fetchResponseError());
    const saveSpy = jest.fn();

    render(<CustomerForm onSave={saveSpy} />);
    await submit(form('customer'));

    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('prevents the default action when submitting the form', async () => {
    const preventDefaultSpy = jest.fn();

    render(<CustomerForm />);
    await submit(form('customer'), {
      preventDefault: preventDefaultSpy
    });

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('renders error message when fetch call fails', async () => {
    window.fetch.mockReturnValue(fetchResponseError());

    render(<CustomerForm />);
    await submit(form('customer'));

    expect(element('.error')).not.toBeNull();
    expect(element('.error').textContent).toMatch(
      'error occurred'
    );
  });

  it('clears error message when fetch call succeeds', async () => {
    window.fetch.mockReturnValueOnce(fetchResponseError());
    window.fetch.mockReturnValue(fetchResponseOk());

    render(<CustomerForm />);
    await submit(form('customer'));
    await submit(form('customer'));

    expect(element('.error')).toBeNull();
  });

  const expectToBeInputFieldOfTypeText = formElement => {
    expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual('INPUT');
    expect(formElement.type).toEqual('text');
  };

  const itRendersAsATextBox = fieldName =>
    it('renders as a text box', () => {
      render(<CustomerForm />);
      expectToBeInputFieldOfTypeText(field('customer', fieldName));
    });

  const itIncludesTheExistingValue = fieldName =>
    it('includes the existing value', () => {
      render(<CustomerForm {...{ [fieldName]: 'value' }} />);
      expect(field('customer', fieldName).value).toEqual('value');
    });

  const itRendersALabel = (fieldName, text) =>
    it('renders a label', () => {
      render(<CustomerForm />);
      expect(labelFor(fieldName)).not.toBeNull();
      expect(labelFor(fieldName).textContent).toEqual(text);
    });

  const itAssignsAnIdThatMatchesTheLabelId = fieldName =>
    it('assigns an id that matches the label id', () => {
      render(<CustomerForm />);
      expect(field('customer', fieldName).id).toEqual(fieldName);
    });

  const itSubmitsExistingValue = (fieldName, value) =>
    it('saves existing value when submitted', async () => {
      render(<CustomerForm {...{ [fieldName]: value }} />);

      await submit(form('customer'));

      expect(requestBodyOf(window.fetch)).toMatchObject({
        [fieldName]: value
      });
    });

  const itSubmitsNewValue = (fieldName, value) =>
    it('saves new value when submitted', async () => {
      render(
        <CustomerForm {...{ [fieldName]: 'existingValue' }} />
      );
      change(
        field('customer', fieldName),
        withEvent(fieldName, value)
      );
      await submit(form('customer'));

      expect(requestBodyOf(window.fetch)).toMatchObject({
        [fieldName]: value
      });
    });

  describe('first name field', () => {
    itRendersAsATextBox('firstName');
    itIncludesTheExistingValue('firstName');
    itRendersALabel('firstName', 'First name');
    itAssignsAnIdThatMatchesTheLabelId('firstName');
    itSubmitsExistingValue('firstName', 'value');
    itSubmitsNewValue('firstName', 'newValue');
  });

  describe('last name field', () => {
    itRendersAsATextBox('lastName');
    itIncludesTheExistingValue('lastName');
    itRendersALabel('lastName', 'Last name');
    itAssignsAnIdThatMatchesTheLabelId('lastName');
    itSubmitsExistingValue('lastName', 'value');
    itSubmitsNewValue('lastName', 'newValue');
  });

  describe('phone number field', () => {
    itRendersAsATextBox('phoneNumber');
    itIncludesTheExistingValue('phoneNumber');
    itRendersALabel('phoneNumber', 'Phone number');
    itAssignsAnIdThatMatchesTheLabelId('phoneNumber');
    itSubmitsExistingValue('phoneNumber', '12345');
    itSubmitsNewValue('phoneNumber', '67890');
  });
});
