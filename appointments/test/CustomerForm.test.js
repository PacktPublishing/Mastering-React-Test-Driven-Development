import React from 'react';
import ReactTestUtils, { act } from 'react-dom/test-utils';
import { createContainer } from './domManipulators';
import { CustomerForm } from '../src/CustomerForm';

describe('CustomerForm', () => {
  const originalFetch = window.fetch;
  let render, container;
  let fetchSpy;

  beforeEach(() => {
    ({ render, container } = createContainer());
    fetchSpy = spy();
    window.fetch = fetchSpy.fn;
    fetchSpy.stubReturnValue(fetchResponseOk({}));
  });

  afterEach(() => {
    window.fetch = originalFetch;
  });

  const spy = () => {
    let returnValue;
    let receivedArguments;
    return {
      fn: (...args) => {
        receivedArguments = args;
        return returnValue;
      },
      receivedArguments: () => receivedArguments,
      receivedArgument: n => receivedArguments[n],
      stubReturnValue: value => (returnValue = value)
    };
  };

  const fetchResponseOk = body =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(body)
    });

  const fetchResponseError = () => Promise.resolve({ ok: false });

  expect.extend({
    toHaveBeenCalled(received) {
      if (received.receivedArguments() === undefined) {
        return {
          pass: false,
          message: () => 'Spy was not called.'
        };
      }
      return { pass: true, message: () => 'Spy was called.' };
    }
  });

  const form = id => container.querySelector(`form[id="${id}"]`);
  const field = name => form('customer').elements[name];
  const labelFor = formElement =>
    container.querySelector(`label[for="${formElement}"]`);

  it('renders a form', () => {
    render(<CustomerForm />);
    expect(form('customer')).not.toBeNull();
  });

  it('has a submit button', () => {
    render(<CustomerForm />);
    const submitButton = container.querySelector(
      'input[type="submit"]'
    );
    expect(submitButton).not.toBeNull();
  });

  it('calls fetch with the right properties when submitting data', async () => {
    render(<CustomerForm />);
    ReactTestUtils.Simulate.submit(form('customer'));
    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy.receivedArgument(0)).toEqual('/customers');

    const fetchOpts = fetchSpy.receivedArgument(1);
    expect(fetchOpts.method).toEqual('POST');
    expect(fetchOpts.credentials).toEqual('same-origin');
    expect(fetchOpts.headers).toEqual({
      'Content-Type': 'application/json'
    });
  });

  it('notifies onSave when form is submitted', async () => {
    const customer = { id: 123 };
    fetchSpy.stubReturnValue(fetchResponseOk(customer));
    const saveSpy = spy();

    render(<CustomerForm onSave={saveSpy.fn} />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'));
    });

    expect(saveSpy).toHaveBeenCalled();
    expect(saveSpy.receivedArgument(0)).toEqual(customer);
  });

  it('does not notify onSave if the POST request returns an error', async () => {
    fetchSpy.stubReturnValue(fetchResponseError());
    const saveSpy = spy();

    render(<CustomerForm onSave={saveSpy.fn} />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'));
    });

    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('prevents the default action when submitting the form', async () => {
    const preventDefaultSpy = spy();

    render(<CustomerForm />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'), {
        preventDefault: preventDefaultSpy.fn
      });
    });

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('renders error message when fetch call fails', async () => {
    fetchSpy.stubReturnValue(Promise.resolve({ ok: false }));

    render(<CustomerForm />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'));
    });

    const errorElement = container.querySelector('.error');
    expect(errorElement).not.toBeNull();
    expect(errorElement.textContent).toMatch('error occurred');
  });

  const expectToBeInputFieldOfTypeText = formElement => {
    expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual('INPUT');
    expect(formElement.type).toEqual('text');
  };

  const itRendersAsATextBox = fieldName =>
    it('renders as a text box', () => {
      render(<CustomerForm />);
      expectToBeInputFieldOfTypeText(field(fieldName));
    });

  const itIncludesTheExistingValue = fieldName =>
    it('includes the existing value', () => {
      render(<CustomerForm {...{ [fieldName]: 'value' }} />);
      expect(field(fieldName).value).toEqual('value');
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
      expect(field(fieldName).id).toEqual(fieldName);
    });

  const itSubmitsExistingValue = (fieldName, value) =>
    it('saves existing value when submitted', async () => {
      render(<CustomerForm {...{ [fieldName]: value }} />);

      ReactTestUtils.Simulate.submit(form('customer'));

      const fetchOpts = fetchSpy.receivedArgument(1);
      expect(JSON.parse(fetchOpts.body)[fieldName]).toEqual(value);
    });

  const itSubmitsNewValue = (fieldName, value) =>
    it('saves new value when submitted', async () => {
      render(
        <CustomerForm {...{ [fieldName]: 'existingValue' }} />
      );
      ReactTestUtils.Simulate.change(field(fieldName), {
        target: { value, name: fieldName }
      });
      ReactTestUtils.Simulate.submit(form('customer'));

      const fetchOpts = fetchSpy.receivedArgument(1);
      expect(JSON.parse(fetchOpts.body)[fieldName]).toEqual(value);
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
