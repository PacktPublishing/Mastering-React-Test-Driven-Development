import React from 'react';
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
import { AppointmentForm } from '../src/AppointmentForm';

describe('AppointmentForm', () => {
  const customer = { id: 123 };

  let renderWithStore,
    store,
    container,
    form,
    field,
    labelFor,
    element,
    elements,
    change,
    children,
    submit;

  beforeEach(() => {
    ({
      renderWithStore,
      store,
      container,
      form,
      field,
      labelFor,
      element,
      elements,
      change,
      children,
      submit
    } = createContainerWithStore());
    jest
      .spyOn(window, 'fetch')
      .mockReturnValue(fetchResponseOk({}));
  });

  afterEach(() => {
    window.fetch.mockRestore();
  });

  const findOption = (dropdownNode, textContent) => {
    const options = Array.from(dropdownNode.childNodes);
    return options.find(
      option => option.textContent === textContent
    );
  };

  const startsAtField = index =>
    elements(`input[name="startsAt"]`)[index];

  it('renders a form', () => {
    renderWithStore(<AppointmentForm />);
    expect(form('appointment')).not.toBeNull();
  });

  it('has a submit button', () => {
    renderWithStore(<AppointmentForm />);
    const submitButton = element('input[type="submit"]');
    expect(submitButton).not.toBeNull();
  });

  it('calls fetch with the right properties when submitting data', async () => {
    renderWithStore(<AppointmentForm />);
    await submit(form('appointment'));
    expect(window.fetch).toHaveBeenCalledWith(
      '/appointments',
      expect.objectContaining({
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' }
      })
    );
  });

  it('notifies onSave when form is submitted', async () => {
    const appointment = { id: 123 };
    window.fetch.mockReturnValue(fetchResponseOk({}));
    const saveSpy = jest.fn();

    renderWithStore(<AppointmentForm onSave={saveSpy} />);
    await submit(form('appointment'));
    expect(saveSpy).toHaveBeenCalled();
  });

  it('does not notify onSave if the POST request returns an error', async () => {
    window.fetch.mockReturnValue(fetchResponseError());
    const saveSpy = jest.fn();

    renderWithStore(<AppointmentForm onSave={saveSpy} />);
    await submit(form('appointment'));

    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('prevents the default action when submitting the form', async () => {
    const preventDefaultSpy = jest.fn();

    renderWithStore(<AppointmentForm />);
    await submit(form('appointment'), {
      preventDefault: preventDefaultSpy
    });

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('renders error message when fetch call fails', async () => {
    window.fetch.mockReturnValue(fetchResponseError());

    renderWithStore(<AppointmentForm />);
    await submit(form('appointment'));

    expect(element('.error')).not.toBeNull();
    expect(element('.error').textContent).toMatch(
      'error occurred'
    );
  });

  it('clears error message when fetch call succeeds', async () => {
    window.fetch.mockReturnValueOnce(fetchResponseError());
    window.fetch.mockReturnValue(fetchResponseOk());

    renderWithStore(<AppointmentForm />);
    await submit(form('appointment'));
    await submit(form('appointment'));

    expect(element('.error')).toBeNull();
  });

  it('passes the customer id to fetch when submitting', async () => {
    renderWithStore(<AppointmentForm />);
    store.dispatch({
      type: 'SET_CUSTOMER_FOR_APPOINTMENT',
      customer
    });
    renderWithStore(<AppointmentForm />);
    await submit(form('appointment'));
    expect(requestBodyOf(window.fetch)).toMatchObject({
      customer: customer.id
    });
  });

  const itRendersAsASelectBox = fieldName => {
    it('renders as a select box', () => {
      renderWithStore(<AppointmentForm />);
      expect(field('appointment', fieldName)).not.toBeNull();
      expect(field('appointment', fieldName).tagName).toEqual(
        'SELECT'
      );
    });
  };

  const itInitiallyHasABlankValueChosen = fieldName =>
    it('initially has a blank value chosen', () => {
      renderWithStore(<AppointmentForm />);
      const firstNode = field('appointment', fieldName)
        .childNodes[0];
      expect(firstNode.value).toEqual('');
      expect(firstNode.selected).toBeTruthy();
    });

  const itPreselectsExistingValue = (
    fieldName,
    props,
    existingValue
  ) => {
    it('pre-selects the existing value', () => {
      renderWithStore(
        <AppointmentForm
          {...props}
          {...{ [fieldName]: existingValue }}
        />
      );
      const option = findOption(
        field('appointment', fieldName),
        existingValue
      );
      expect(option.selected).toBeTruthy();
    });
  };

  const itRendersALabel = (fieldName, text) => {
    it('renders a label', () => {
      renderWithStore(<AppointmentForm />);
      expect(labelFor(fieldName)).not.toBeNull();
      expect(labelFor(fieldName).textContent).toEqual(text);
    });
  };

  const itAssignsAnIdThatMatchesTheLabelId = fieldName => {
    it('assigns an id that matches the label id', () => {
      renderWithStore(<AppointmentForm />);
      expect(field('appointment', fieldName).id).toEqual(
        fieldName
      );
    });
  };

  const itSubmitsExistingValue = (fieldName, props) => {
    it('saves existing value when submitted', async () => {
      renderWithStore(
        <AppointmentForm
          customer={customer}
          {...props}
          {...{ [fieldName]: 'value' }}
        />
      );
      await submit(form('appointment'));

      expect(requestBodyOf(window.fetch)).toMatchObject({
        [fieldName]: 'value'
      });
    });
  };

  const itSubmitsNewValue = (fieldName, props) => {
    it('saves new value when submitted', async () => {
      renderWithStore(
        <AppointmentForm
          customer={customer}
          {...props}
          {...{ [fieldName]: 'existingValue' }}
        />
      );
      change(
        field('appointment', fieldName),
        withEvent(fieldName, 'newValue')
      );
      await submit(form('appointment'));

      expect(requestBodyOf(window.fetch)).toMatchObject({
        [fieldName]: 'newValue'
      });
    });
  };

  describe('service field', () => {
    itRendersAsASelectBox('service');
    itInitiallyHasABlankValueChosen('service');
    itPreselectsExistingValue(
      'service',
      { selectableServices: ['Cut', 'Blow-dry'] },
      'Blow-dry'
    );
    itRendersALabel('service', 'Salon service');
    itAssignsAnIdThatMatchesTheLabelId('service');
    itSubmitsExistingValue('service', {
      serviceStylists: { value: [] }
    });
    itSubmitsNewValue('service', {
      serviceStylists: { newValue: [], existingValue: [] }
    });

    it('lists all salon services', () => {
      const selectableServices = ['Cut', 'Blow-dry'];

      renderWithStore(
        <AppointmentForm selectableServices={selectableServices} />
      );

      const renderedServices = children(
        field('appointment', 'service')
      ).map(node => node.textContent);
      expect(renderedServices).toEqual(
        expect.arrayContaining(selectableServices)
      );
    });
  });

  describe('stylist field', () => {
    itRendersAsASelectBox('stylist');
    itInitiallyHasABlankValueChosen('stylist');
    itPreselectsExistingValue(
      'stylist',
      { selectableStylists: ['Ashley', 'Jo'] },
      'Ashley'
    );
    itRendersALabel('stylist', 'Stylist');
    itAssignsAnIdThatMatchesTheLabelId('stylist');
    itSubmitsExistingValue('stylist');
    itSubmitsNewValue('stylist');

    it('lists only stylists that can perform the selected service', () => {
      const selectableServices = ['1', '2'];
      const selectableStylists = ['A', 'B', 'C'];
      const serviceStylists = {
        '1': ['A', 'B']
      };

      renderWithStore(
        <AppointmentForm
          selectableServices={selectableServices}
          selectableStylists={selectableStylists}
          serviceStylists={serviceStylists}
        />
      );

      change(
        field('appointment', 'service'),
        withEvent('service', '1')
      );

      const renderedServices = children(
        field('appointment', 'stylist')
      ).map(node => node.textContent);
      expect(renderedServices).toEqual(
        expect.arrayContaining(['A', 'B'])
      );
    });
  });

  const timeSlotTable = () => element('table#time-slots');

  describe('time slot table', () => {
    const today = new Date();
    const availableTimeSlots = [
      { startsAt: today.setHours(9, 0, 0, 0) },
      { startsAt: today.setHours(9, 30, 0, 0) }
    ];

    it('renders a table for time slots', () => {
      renderWithStore(<AppointmentForm />);
      expect(timeSlotTable()).not.toBeNull();
    });

    it('renders a time slot for every half an hour between open and close times', () => {
      renderWithStore(
        <AppointmentForm salonOpensAt={9} salonClosesAt={11} />
      );
      const timesOfDay = timeSlotTable().querySelectorAll(
        'tbody >* th'
      );
      expect(timesOfDay).toHaveLength(4);
      expect(timesOfDay[0].textContent).toEqual('09:00');
      expect(timesOfDay[1].textContent).toEqual('09:30');
      expect(timesOfDay[3].textContent).toEqual('10:30');
    });

    it('renders an empty cell at the start of the header row', () => {
      renderWithStore(<AppointmentForm />);
      const headerRow = timeSlotTable().querySelector(
        'thead > tr'
      );
      expect(headerRow.firstChild.textContent).toEqual('');
    });

    it('renders a week of available dates', () => {
      const today = new Date(2018, 11, 1);
      renderWithStore(<AppointmentForm today={today} />);
      const dates = timeSlotTable().querySelectorAll(
        'thead >* th:not(:first-child)'
      );
      expect(dates).toHaveLength(7);
      expect(dates[0].textContent).toEqual('Sat 01');
      expect(dates[1].textContent).toEqual('Sun 02');
      expect(dates[6].textContent).toEqual('Fri 07');
    });

    it('renders a radio button for each time slot', () => {
      renderWithStore(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
        />
      );
      const cells = timeSlotTable().querySelectorAll('td');
      expect(
        cells[0].querySelector('input[type="radio"]')
      ).not.toBeNull();
      expect(
        cells[7].querySelector('input[type="radio"]')
      ).not.toBeNull();
    });

    it('does not render radio buttons for unavailable time slots', () => {
      renderWithStore(<AppointmentForm availableTimeSlots={[]} />);
      const timesOfDay = timeSlotTable().querySelectorAll('input');
      expect(timesOfDay).toHaveLength(0);
    });

    it('sets radio button values to the startsAt value of the corresponding appointment', () => {
      renderWithStore(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
        />
      );
      expect(startsAtField(0).value).toEqual(
        availableTimeSlots[0].startsAt.toString()
      );
      expect(startsAtField(1).value).toEqual(
        availableTimeSlots[1].startsAt.toString()
      );
    });

    it('pre-selects the existing value', () => {
      renderWithStore(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
          startsAt={availableTimeSlots[0].startsAt}
        />
      );
      expect(startsAtField(0).checked).toEqual(true);
    });

    it('saves existing value when submitted', async () => {
      renderWithStore(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
          startsAt={availableTimeSlots[0].startsAt}
        />
      );
      await submit(form('appointment'));

      expect(requestBodyOf(window.fetch)).toMatchObject({
        startsAt: availableTimeSlots[0].startsAt
      });
    });

    it('saves new value when submitted', async () => {
      renderWithStore(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
          startsAt={availableTimeSlots[0].startsAt}
        />
      );
      change(
        startsAtField(1),
        withEvent(
          'startsAt',
          availableTimeSlots[1].startsAt.toString()
        )
      );
      await submit(form('appointment'));

      expect(requestBodyOf(window.fetch)).toMatchObject({
        startsAt: availableTimeSlots[1].startsAt
      });
    });

    it('filters appointments by selected stylist', () => {
      const availableTimeSlots = [
        {
          startsAt: today.setHours(9, 0, 0, 0),
          stylists: ['A', 'B']
        },
        {
          startsAt: today.setHours(9, 30, 0, 0),
          stylists: ['A']
        }
      ];

      renderWithStore(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
        />
      );

      change(
        field('appointment', 'stylist'),
        withEvent('stylist', 'B')
      );

      const cells = timeSlotTable().querySelectorAll('td');
      expect(
        cells[0].querySelector('input[type="radio"]')
      ).not.toBeNull();
      expect(
        cells[7].querySelector('input[type="radio"]')
      ).toBeNull();
    });
  });
});
