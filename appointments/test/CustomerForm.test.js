import React from 'react';
import ReactTestUtils, { act } from 'react-dom/test-utils';
import 'whatwg-fetch';
import {
  fetchResponseOk,
  fetchResponseError,
  requestBodyOf
} from './spyHelpers';
import { createContainer, withEvent } from './domManipulators';
import { CustomerForm } from '../src/CustomerForm';

const validCustomer = {
  firstName: 'first',
  lastName: 'last',
  phoneNumber: '123456789'
};

describe('CustomerForm', () => {
  let render,
    container,
    form,
    field,
    labelFor,
    element,
    change,
    submit,
    blur;

  beforeEach(() => {
    ({
      render,
      container,
      form,
      field,
      labelFor,
      element,
      change,
      submit,
      blur
    } = createContainer());
    jest
      .spyOn(window, 'fetch')
      .mockReturnValue(fetchResponseOk({}));
  });

  afterEach(() => {
    window.fetch.mockRestore();
  });

  const submitButton = () => element('input[type="submit"]');

  it('renders a form', () => {
    render(<CustomerForm {...validCustomer} />);
    expect(form('customer')).not.toBeNull();
  });

  describe('submit button', () => {
    it('has a submit button', () => {
      render(<CustomerForm {...validCustomer} />);
      expect(submitButton()).not.toBeNull();
    });

    it('disables the submit button when submitting', async () => {
      render(<CustomerForm {...validCustomer} />);
      act(() => {
        ReactTestUtils.Simulate.submit(form('customer'));
      });
      await act(async () => {
        expect(submitButton().disabled).toBeTruthy();
      });
    });

    it('initially does not disable submit button', () => {
      render(<CustomerForm {...validCustomer} />);
      expect(submitButton().disabled).toBeFalsy();
    });
  });

  it('calls fetch with the right properties when submitting data', async () => {
    render(<CustomerForm {...validCustomer} />);
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

    render(<CustomerForm {...validCustomer} onSave={saveSpy} />);
    await submit(form('customer'));

    expect(saveSpy).toHaveBeenCalledWith(customer);
  });

  it('does not notify onSave if the POST request returns an error', async () => {
    window.fetch.mockReturnValue(fetchResponseError());
    const saveSpy = jest.fn();

    render(<CustomerForm {...validCustomer} onSave={saveSpy} />);
    await submit(form('customer'));

    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('prevents the default action when submitting the form', async () => {
    const preventDefaultSpy = jest.fn();

    render(<CustomerForm {...validCustomer} />);
    await submit(form('customer'), {
      preventDefault: preventDefaultSpy
    });

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('renders error message when fetch call fails', async () => {
    window.fetch.mockReturnValue(fetchResponseError());

    render(<CustomerForm {...validCustomer} />);
    await submit(form('customer'));

    expect(element('.error')).not.toBeNull();
    expect(element('.error').textContent).toMatch(
      'error occurred'
    );
  });

  it('clears error message when fetch call succeeds', async () => {
    window.fetch.mockReturnValueOnce(fetchResponseError());
    window.fetch.mockReturnValue(fetchResponseOk());

    render(<CustomerForm {...validCustomer} />);
    await submit(form('customer'));
    await submit(form('customer'));

    expect(element('.error')).toBeNull();
  });

  it('does not submit the form when there are validation errors', async () => {
    render(<CustomerForm />);

    await submit(form('customer'));
    expect(window.fetch).not.toHaveBeenCalled();
  });

  it('renders validation errors after submission fails', async () => {
    render(<CustomerForm />);
    await submit(form('customer'));
    expect(window.fetch).not.toHaveBeenCalled();
    expect(element('.error')).not.toBeNull();
  });

  it('renders field validation errors from server', async () => {
    const errors = {
      phoneNumber: 'Phone number already exists in the system'
    };
    window.fetch.mockReturnValue(
      fetchResponseError(422, { errors })
    );
    render(<CustomerForm {...validCustomer} />);
    await submit(form('customer'));
    expect(element('.error').textContent).toMatch(
      errors.phoneNumber
    );
  });

  describe('submitting indicator', () => {
    it('displays indicator when form is submitting', async () => {
      render(<CustomerForm {...validCustomer} />);
      act(() => {
        ReactTestUtils.Simulate.submit(form('customer'));
      });
      await act(async () => {
        expect(element('span.submittingIndicator')).not.toBeNull();
      });
    });

    it('initially does not display the submitting indicator', () => {
      render(<CustomerForm {...validCustomer} />);
      expect(element('.submittingIndicator')).toBeNull();
    });

    it('hides indicator when form has submitted', async () => {
      render(<CustomerForm {...validCustomer} />);
      await submit(form('customer'));
      expect(element('.submittingIndicator')).toBeNull();
    });
  });

  const expectToBeInputFieldOfTypeText = formElement => {
    expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual('INPUT');
    expect(formElement.type).toEqual('text');
  };

  const itRendersAsATextBox = fieldName =>
    it('renders as a text box', () => {
      render(<CustomerForm {...validCustomer} />);
      expectToBeInputFieldOfTypeText(field('customer', fieldName));
    });

  const itIncludesTheExistingValue = fieldName =>
    it('includes the existing value', () => {
      render(
        <CustomerForm
          {...validCustomer}
          {...{ [fieldName]: 'value' }}
        />
      );
      expect(field('customer', fieldName).value).toEqual('value');
    });

  const itRendersALabel = (fieldName, text) =>
    it('renders a label', () => {
      render(<CustomerForm {...validCustomer} />);
      expect(labelFor(fieldName)).not.toBeNull();
      expect(labelFor(fieldName).textContent).toEqual(text);
    });

  const itAssignsAnIdThatMatchesTheLabelId = fieldName =>
    it('assigns an id that matches the label id', () => {
      render(<CustomerForm {...validCustomer} />);
      expect(field('customer', fieldName).id).toEqual(fieldName);
    });

  const itSubmitsExistingValue = (fieldName, value) =>
    it('saves existing value when submitted', async () => {
      render(
        <CustomerForm
          {...validCustomer}
          {...{ [fieldName]: value }}
        />
      );

      await submit(form('customer'));

      expect(requestBodyOf(window.fetch)).toMatchObject({
        [fieldName]: value
      });
    });

  const itSubmitsNewValue = (fieldName, value) =>
    it('saves new value when submitted', async () => {
      render(
        <CustomerForm
          {...validCustomer}
          {...{ [fieldName]: 'existingValue' }}
        />
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

  describe('validation', () => {
    const itInvalidatesFieldWithValue = (
      fieldName,
      value,
      description
    ) => {
      it(`displays error after blur when ${fieldName} field is '${value}'`, () => {
        render(<CustomerForm {...validCustomer} />);

        blur(
          field('customer', fieldName),
          withEvent(fieldName, value)
        );

        expect(element('.error')).not.toBeNull();
        expect(element('.error').textContent).toMatch(description);
      });
    };

    const itClearsFieldError = (fieldName, fieldValue) => {
      it(`clears error when user corrects it`, async () => {
        render(<CustomerForm {...validCustomer} />);

        blur(
          field('customer', fieldName),
          withEvent(fieldName, '')
        );
        change(
          field('customer', fieldName),
          withEvent(fieldName, fieldValue)
        );

        expect(element('.error')).toBeNull();
      });
    };

    const itDoesNotInvalidateFieldOnKeypress = (
      fieldName,
      fieldValue
    ) => {
      it(`does not validate field on keypress`, async () => {
        render(<CustomerForm {...validCustomer} />);

        change(
          field('customer', fieldName),
          withEvent(fieldName, fieldValue)
        );

        expect(element('.error')).toBeNull();
      });
    };

    itInvalidatesFieldWithValue(
      'firstName',
      ' ',
      'First name is required'
    );
    itInvalidatesFieldWithValue(
      'lastName',
      ' ',
      'Last name is required'
    );
    itInvalidatesFieldWithValue(
      'phoneNumber',
      ' ',
      'Phone number is required'
    );
    itInvalidatesFieldWithValue(
      'phoneNumber',
      'invalid',
      'Only numbers, spaces and these symbols are allowed: ( ) + -'
    );

    itClearsFieldError('firstName', 'name');
    itClearsFieldError('lastName', 'name');
    itClearsFieldError('phoneNumber', '1234567890');

    itDoesNotInvalidateFieldOnKeypress('firstName', '');
    itDoesNotInvalidateFieldOnKeypress('lastName', '');
    itDoesNotInvalidateFieldOnKeypress('phoneNumber', '');

    it('accepts standard phone number characters when validating', () => {
      render(<CustomerForm {...validCustomer} />);

      blur(
        element("[name='phoneNumber']"),
        withEvent('phoneNumber', '0123456789+()- ')
      );

      expect(element('.error')).toBeNull();
    });
  });
});
