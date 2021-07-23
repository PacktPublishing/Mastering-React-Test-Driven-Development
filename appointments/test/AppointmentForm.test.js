import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';

import { createContainer } from './DomManipulators';
import { AppointmentForm } from '../src/AppointmentForm';

describe('AppointmentForm', () => {
  let render, container;

  beforeEach(() => {
    ({ render, container } = createContainer());
  });

  const form = (id) => container.querySelector(`form[id="${id}"]`);

  it('renders a form', () => {
    render(<AppointmentForm />);
    expect(form('appointment')).not.toBeNull();
  });

  describe('service field', () => {
    const labelFor = (id) => container.querySelector(`label[for="${id}"]`);

    const field = (name) => form('appointment').elements[name];

    const findOption = (dropdown, textContent) =>
      Array.from(dropdown.childNodes).find(
        (option) => option.textContent === textContent
      );

    it('renders a select box', () => {
      render(<AppointmentForm />);
      expect(field('service')).not.toBeNull();
    });

    it('initially renders an empty value', () => {
      render(<AppointmentForm />);
      expect(field('service').childNodes[0].selected).toBeTruthy();
      expect(field('service').childNodes[0].value).toEqual('');
    });

    it('lists all salon services', () => {
      const selectableServices = ['ServiceA', 'ServiceB'];
      render(<AppointmentForm selectableServices={selectableServices} />);
      expect(
        Array.from(field('service').childNodes)
          .slice(1)
          .map((option) => option.textContent)
      ).toEqual(selectableServices);
    });

    it('preselects the existing value', () => {
      const selectableServices = ['ServiceA', 'ServiceB'];
      render(
        <AppointmentForm
          selectableServices={selectableServices}
          service="ServiceA"
        />
      );
      expect(findOption(field('service'), 'ServiceA').selected).toBeTruthy();
    });

    it('renders a label', () => {
      render(<AppointmentForm />);
      expect(labelFor('service')).not.toBeNull();
      expect(labelFor('service').textContent).toEqual('Salon service');
    });

    it('assigns an id', () => {
      render(<AppointmentForm />);
      expect(field('service').id).toEqual('service');
    });

    it('saves existing value when submitted', async () => {
      expect.hasAssertions();
      const selectableServices = ['ServiceA', 'ServiceB'];
      render(
        <AppointmentForm
          service="ServiceA"
          selectableServices={selectableServices}
          onSubmit={({ service }) => expect(service).toEqual('ServiceA')}
        />
      );
      await ReactTestUtils.Simulate.submit(form('appointment'));
    });

    it('saves new value when submitted', async () => {
      const selectableServices = ['ServiceA', 'ServiceB'];
      render(
        <AppointmentForm
          selectableServices={selectableServices}
          onSubmit={({ service }) => expect(service).toEqual('ServiceA')}
        />
      );
      await ReactTestUtils.Simulate.change(field('service'), {
        target: { value: 'ServiceA' },
      });
      await ReactTestUtils.Simulate.submit(form('appointment'));
    });
  });

  describe('time slot table', () => {
    const appointmentTable = () => container.querySelector('table#time-slots');

    it('renders a table', () => {
      render(<AppointmentForm />);
      expect(appointmentTable()).not.toBeNull();
    });

    it('renders a slot for every half an hour between open and close time', () => {
      render(<AppointmentForm salonOpensAt={9} salonClosesAt={11} />);
      const timeSlotTHs = Array.from(
        appointmentTable().querySelectorAll('tbody th')
      ).map((th) => th.textContent);
      expect(timeSlotTHs).toEqual(['09:00', '09:30', '10:00', '10:30']);
    });
  });
});
