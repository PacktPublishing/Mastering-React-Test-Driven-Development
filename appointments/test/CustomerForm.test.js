import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';

import { createContainer } from './DomManipulators';
import { CustomerForm } from '../src/CustomerForm';

describe('CustomerForm', () => {
  let render, container;

  beforeEach(() => {
    ({ render, container } = createContainer());
  });

  const form = (id) => container.querySelector(`form[id="${id}"]`);

  const labelFor = (id) => container.querySelector(`label[for="${id}"]`);

  const field = (name) => form('customer').elements[name];

  const expectToBeInputFieldOfTypeText = (field) => {
    expect(field).not.toBeNull();
    expect(field.tagName).toEqual('INPUT');
    expect(field.type).toEqual('text');
  };

  const itRendersAsATextBox = (name) => {
    it('renders as a text box', () => {
      render(<CustomerForm />);
      expectToBeInputFieldOfTypeText(field(name));
    });
  };

  const itIncludesTheExistingValue = (name) => {
    it('includes the existing value', () => {
      render(<CustomerForm {...{ [name]: 'valueX' }} />);
      expect(field(name).value).toEqual('valueX');
    });
  };

  const itRendersALabel = (name, label) => {
    it('renders a label', () => {
      render(<CustomerForm />);
      expect(labelFor(name)).not.toBeNull();
      expect(labelFor(name).textContent).toEqual(label);
    });
  };

  const itAssignsAnId = (name) => {
    it('assigns an id', () => {
      render(<CustomerForm />);
      expect(field(name).id).toEqual(name);
    });
  };

  const itSavesExistingValueWhenSubmitted = (name) => {
    it('saves existing value when submitted', async () => {
      expect.hasAssertions();
      render(
        <CustomerForm
          {...{ [name]: 'valueX' }}
          onSubmit={(customer) => expect(customer[name]).toEqual('valueX')}
        />
      );
      await ReactTestUtils.Simulate.submit(form('customer'));
    });
  };

  const itSavesNewValueWhenSubmitted = (name) => {
    it('saves new value when submitted', async () => {
      render(
        <CustomerForm
          onSubmit={(customer) => expect(customer[name]).toEqual('valueX')}
        />
      );
      await ReactTestUtils.Simulate.change(field(name), {
        target: { value: 'valueX', name },
      });
      await ReactTestUtils.Simulate.submit(form('customer'));
    });
  };

  it('renders a form', () => {
    render(<CustomerForm />);
    expect(form('customer')).not.toBeNull();
  });

  describe('first name field', () => {
    itRendersAsATextBox('firstName');
    itIncludesTheExistingValue('firstName');
    itRendersALabel('firstName', 'First name:');
    itAssignsAnId('firstName');
    itSavesExistingValueWhenSubmitted('firstName');
    itSavesNewValueWhenSubmitted('firstName');
  });

  describe('last name field', () => {
    itRendersAsATextBox('lastName');
    itIncludesTheExistingValue('lastName');
    itRendersALabel('lastName', 'Last name:');
    itAssignsAnId('lastName');
    itSavesExistingValueWhenSubmitted('lastName');
    itSavesNewValueWhenSubmitted('lastName');
  });

  describe('phone number field', () => {
    itRendersAsATextBox('phoneNumber');
    itIncludesTheExistingValue('phoneNumber');
    itRendersALabel('phoneNumber', 'Phone number:');
    itAssignsAnId('phoneNumber');
    itSavesExistingValueWhenSubmitted('phoneNumber');
    itSavesNewValueWhenSubmitted('phoneNumber');
  });
});
