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

  const expectToBeInputFieldOfTypeText = (field) => {
    expect(field).not.toBeNull();
    expect(field.tagName).toEqual('INPUT');
    expect(field.type).toEqual('text');
  };

  const firstNameField = () => form('customer').elements.firstName;

  it('renders a form', () => {
    render(<CustomerForm />);
    expect(form('customer')).not.toBeNull();
  });

  describe('first name field', () => {
    it('renders as a text box', () => {
      render(<CustomerForm />);
      expectToBeInputFieldOfTypeText(firstNameField());
    });

    it('includes the existing value', () => {
      render(<CustomerForm firstName="Ashley" />);
      expect(firstNameField().value).toEqual('Ashley');
    });

    it('renders a label', () => {
      render(<CustomerForm />);
      expect(labelFor('firstName')).not.toBeNull();
      expect(labelFor('firstName').textContent).toEqual('First name:');
    });

    it('assigns an id', () => {
      render(<CustomerForm />);
      expect(firstNameField().id).toEqual('firstName');
    });

    it('saves existing value when submitted', async () => {
      expect.hasAssertions();
      render(
        <CustomerForm
          firstName="Ashley"
          onSubmit={({ firstName }) => expect(firstName).toEqual('Ashley')}
        />
      );
      await ReactTestUtils.Simulate.submit(form('customer'));
    });

    it('saves new value when submitted', async () => {
      render(
        <CustomerForm
          onSubmit={({ firstName }) => expect(firstName).toEqual('Ashley')}
        />
      );
      await ReactTestUtils.Simulate.change(firstNameField(), {
        target: { value: 'Ashley' },
      });
      await ReactTestUtils.Simulate.submit(form('customer'));
    });
  });
});
