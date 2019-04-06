import React from 'react';
import ReactTestUtils, { act } from 'react-dom/test-utils';
import 'whatwg-fetch';
import { expectRedux } from 'expect-redux';
import {
  fetchResponseOk,
  fetchResponseError,
  requestBodyOf
} from './spyHelpers';
import {
  createContainerWithStore,
  withEvent
} from './domManipulators';
import { CustomerForm } from '../src/CustomerForm';

const validCustomer = {
  firstName: 'first',
  lastName: 'last',
  phoneNumber: '123456789'
};

describe('CustomerForm', () => {
  let renderWithStore,
    store,
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
      renderWithStore,
      store,
      container,
      form,
      field,
      labelFor,
      element,
      change,
      submit,
      blur
    } = createContainerWithStore());
    jest
      .spyOn(window, 'fetch')
      .mockReturnValue(fetchResponseOk({}));
  });

  afterEach(() => {
    window.fetch.mockRestore();
  });

  const submitButton = () => element('input[type="submit"]');

  it('renders a form', () => {
    renderWithStore(<CustomerForm {...validCustomer} />);
    expect(form('customer')).not.toBeNull();
  });

  describe('submit button', () => {
    it('has a submit button', () => {
      renderWithStore(<CustomerForm {...validCustomer} />);
      expect(submitButton()).not.toBeNull();
    });

    it('disables the submit button when submitting', async () => {
      renderWithStore(<CustomerForm {...validCustomer} />);
      store.dispatch({ type: 'ADD_CUSTOMER_SUBMITTING' });
      expect(submitButton().disabled).toBeTruthy();
    });

    it('initially does not disable submit button', () => {
      renderWithStore(<CustomerForm {...validCustomer} />);
      expect(submitButton().disabled).toBeFalsy();
    });
  });

  it('dispatches ADD_CUSTOMER_REQUEST when submitting data', async () => {
    renderWithStore(<CustomerForm {...validCustomer} />);
    await submit(form('customer'));
    return expectRedux(store)
      .toDispatchAnAction()
      .matching({
        type: 'ADD_CUSTOMER_REQUEST',
        customer: validCustomer
      });
  });

  it('prevents the default action when submitting the form', async () => {
    const preventDefaultSpy = jest.fn();

    renderWithStore(<CustomerForm {...validCustomer} />);
    await submit(form('customer'), {
      preventDefault: preventDefaultSpy
    });

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('renders error message when error prop is true', () => {
    renderWithStore(<CustomerForm {...validCustomer} />);
    store.dispatch({ type: 'ADD_CUSTOMER_FAILED' });
    expect(element('.error').textContent).toMatch(
      'error occurred'
    );
  });

  it('does not submit the form when there are validation errors', async () => {
    renderWithStore(<CustomerForm />);

    await submit(form('customer'));
    return expectRedux(store)
      .toNotDispatchAnAction(100)
      .ofType('ADD_CUSTOMER_REQUEST');
  });

  it('renders validation errors after submission fails', async () => {
    renderWithStore(<CustomerForm />);
    await submit(form('customer'));
    expect(window.fetch).not.toHaveBeenCalled();
    expect(element('.error')).not.toBeNull();
  });

  it('renders field validation errors from server', () => {
    const errors = {
      phoneNumber: 'Phone number already exists in the system'
    };
    renderWithStore(<CustomerForm {...validCustomer} />);
    store.dispatch({
      type: 'ADD_CUSTOMER_VALIDATION_FAILED',
      validationErrors: errors
    });
    expect(element('.error').textContent).toMatch(
      errors.phoneNumber
    );
  });

  describe('submitting indicator', () => {
    it('displays indicator when form is submitting', () => {
      renderWithStore(<CustomerForm {...validCustomer} />);
      store.dispatch({ type: 'ADD_CUSTOMER_SUBMITTING' });
      expect(element('.submittingIndicator')).not.toBeNull();
    });

    it('initially does not display the submitting indicator', () => {
      renderWithStore(<CustomerForm {...validCustomer} />);
      expect(element('.submittingIndicator')).toBeNull();
    });

    it('hides indicator when form has submitted', () => {
      renderWithStore(<CustomerForm {...validCustomer} />);
      store.dispatch({ type: 'ADD_CUSTOMER_SUCCESSFUL' });
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
      renderWithStore(<CustomerForm {...validCustomer} />);
      expectToBeInputFieldOfTypeText(field('customer', fieldName));
    });

  const itIncludesTheExistingValue = fieldName =>
    it('includes the existing value', () => {
      renderWithStore(
        <CustomerForm
          {...validCustomer}
          {...{ [fieldName]: 'value' }}
        />
      );
      expect(field('customer', fieldName).value).toEqual('value');
    });

  const itRendersALabel = (fieldName, text) =>
    it('renders a label', () => {
      renderWithStore(<CustomerForm {...validCustomer} />);
      expect(labelFor(fieldName)).not.toBeNull();
      expect(labelFor(fieldName).textContent).toEqual(text);
    });

  const itAssignsAnIdThatMatchesTheLabelId = fieldName =>
    it('assigns an id that matches the label id', () => {
      renderWithStore(<CustomerForm {...validCustomer} />);
      expect(field('customer', fieldName).id).toEqual(fieldName);
    });

  const itSubmitsExistingValue = (fieldName, value) =>
    it('saves existing value when submitted', async () => {
      renderWithStore(
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
      renderWithStore(
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
        renderWithStore(<CustomerForm {...validCustomer} />);

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
        renderWithStore(<CustomerForm {...validCustomer} />);

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
        renderWithStore(<CustomerForm {...validCustomer} />);

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
      renderWithStore(<CustomerForm {...validCustomer} />);

      blur(
        element("[name='phoneNumber']"),
        withEvent('phoneNumber', '0123456789+()- ')
      );

      expect(element('.error')).toBeNull();
    });
  });
});
