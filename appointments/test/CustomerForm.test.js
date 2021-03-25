import React, { createElement } from 'react';
import { createContainer } from './domManipulators';
import { CustomerForm } from '../src/CustomerForm';
import ReactTestUtils from 'react-dom/test-utils';

describe('CustomerForm', () => {
  let render, container;

  const form = (id) => container.querySelector(`form[id="${id}"]`);

  const expectToBeInputFieldOfTypeText = (formElement) => {
    expect(formElement).toBeDefined();
    expect(formElement.tagName).toEqual('INPUT');
    expect(formElement.type).toEqual('text');
  };
  const field = (name) => form('customer').elements[name];

  const labelFor = (formElement) =>
    container.querySelector(`label[for=${formElement}]`);

  const itRendersAsATextBox = (fieldName) => {
    it('renders a text box', () => {
      render(<CustomerForm />);
      expectToBeInputFieldOfTypeText(field(fieldName));
    });
  };

  const itIncludesTheExistingValue = (fieldName) => {
    it('includes the existing value', () => {
      render(<CustomerForm {...{ [fieldName]: 'value' }} />);
      expect(field(fieldName).value).toEqual('value');
    });
  };

  const itRendersALabel = (fieldName, labelText) => {
    it('renders a label', () => {
      render(<CustomerForm />);
      expect(labelFor(fieldName)).not.toBeNull();
      expect(labelFor(fieldName).textContent).toEqual(labelText);
    });
  };

  const itAssignsAnIdThatMatchesTheLabelId = (fieldName) => {
    it('assigns an id that matches the label id', () => {
      render(<CustomerForm />);
      expect(field(fieldName).id).toEqual(fieldName);
    });
  };

  const itSubmitsExistingValue = (fieldName, value) => {
    it('saves existing value when submitted', async () => {
      expect.hasAssertions();
      render(
        <CustomerForm
          firstName={value}
          onSubmit={(props) =>
            expect(props[fieldName]).toEqual(value)
          }
        />
      );
      await ReactTestUtils.Simulate.submit(form('customer'));
    });
  };

  const itSubmitsNewValue = (fieldName, value) => {
    it('saves new value when submitted', async () => {
      expect.hasAssertions();
      render(
        <CustomerForm
          {...{ [fieldName]: 'existingValue' }}
          onSubmit={(props) =>
            expect(props[fieldName]).toEqual(value)
          }
        />
      );
      await ReactTestUtils.Simulate.change(field(fieldName), {
        target: { value },
      });
      await ReactTestUtils.Simulate.submit(form('customer'));
    });
  };

  beforeEach(() => {
    ({ render, container } = createContainer());
  });

  it('renders a form', () => {
    render(<CustomerForm />);
    expect(form('customer')).not.toBeNull();
  });

  describe('first name field', () => {
    itRendersAsATextBox('firstName');

    itIncludesTheExistingValue('firstName');

    itRendersALabel('firstName', 'First name');

    itAssignsAnIdThatMatchesTheLabelId('firstName');

    itSubmitsExistingValue('firstName', 'firstName');

    itSubmitsNewValue('firstName', 'anotherFirstName');
  });
});
