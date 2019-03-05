import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { createContainer } from './domManipulators';
import { AppointmentForm } from '../src/AppointmentForm';

describe('AppointmentForm', () => {
  let render, container;

  beforeEach(() => {
    ({ render, container } = createContainer());
  });

  const form = id => container.querySelector(`form[id="${id}"]`);
  const field = name => form('appointment').elements[name];
  const labelFor = formElement =>
    container.querySelector(`label[for="${formElement}"]`);
  const startsAtField = index =>
    container.querySelectorAll(`input[name="startsAt"]`)[index];

  const findOption = (dropdownNode, textContent) => {
    const options = Array.from(dropdownNode.childNodes);
    return options.find(
      option => option.textContent === textContent
    );
  };

  it('renders a form', () => {
    render(<AppointmentForm />);
    expect(form('appointment')).not.toBeNull();
  });

  it('has a submit button', () => {
    render(<AppointmentForm />);
    const submitButton = container.querySelector(
      'input[type="submit"]'
    );
    expect(submitButton).not.toBeNull();
  });

  const itRendersAsASelectBox = fieldName => {
    it('renders as a select box', () => {
      render(<AppointmentForm />);
      expect(field(fieldName)).not.toBeNull();
      expect(field(fieldName).tagName).toEqual('SELECT');
    });
  };

  const itInitiallyHasABlankValueChosen = fieldName =>
    it('initially has a blank value chosen', () => {
      render(<AppointmentForm />);
      const firstNode = field(fieldName).childNodes[0];
      expect(firstNode.value).toEqual('');
      expect(firstNode.selected).toBeTruthy();
    });

  const itPreselectsExistingValue = (
    fieldName,
    props,
    existingValue
  ) => {
    it('pre-selects the existing value', () => {
      render(
        <AppointmentForm
          {...props}
          {...{ [fieldName]: existingValue }}
        />
      );
      const option = findOption(field(fieldName), existingValue);
      expect(option.selected).toBeTruthy();
    });
  };

  const itRendersALabel = (fieldName, text) => {
    it('renders a label', () => {
      render(<AppointmentForm />);
      expect(labelFor(fieldName)).not.toBeNull();
      expect(labelFor(fieldName).textContent).toEqual(text);
    });
  };

  const itAssignsAnIdThatMatchesTheLabelId = fieldName => {
    it('assigns an id that matches the label id', () => {
      render(<AppointmentForm />);
      expect(field(fieldName).id).toEqual(fieldName);
    });
  };

  const itSubmitsExistingValue = (fieldName, props) => {
    it('saves existing value when submitted', async () => {
      expect.hasAssertions();
      render(
        <AppointmentForm
          {...props}
          {...{ [fieldName]: 'value' }}
          onSubmit={props =>
            expect(props[fieldName]).toEqual('value')
          }
        />
      );
      await ReactTestUtils.Simulate.submit(form('appointment'));
    });
  };

  const itSubmitsNewValue = (fieldName, props) => {
    it('saves new value when submitted', async () => {
      expect.hasAssertions();
      render(
        <AppointmentForm
          {...props}
          {...{ [fieldName]: 'existingValue' }}
          onSubmit={props =>
            expect(props[fieldName]).toEqual('newValue')
          }
        />
      );
      await ReactTestUtils.Simulate.change(field(fieldName), {
        target: { value: 'newValue', name: fieldName }
      });
      await ReactTestUtils.Simulate.submit(form('appointment'));
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

      render(
        <AppointmentForm selectableServices={selectableServices} />
      );

      const optionNodes = Array.from(field('service').childNodes);
      const renderedServices = optionNodes.map(
        node => node.textContent
      );
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

      render(
        <AppointmentForm
          selectableServices={selectableServices}
          selectableStylists={selectableStylists}
          serviceStylists={serviceStylists}
        />
      );

      ReactTestUtils.Simulate.change(field('service'), {
        target: { value: '1', name: 'service' }
      });

      const optionNodes = Array.from(field('stylist').childNodes);
      const renderedServices = optionNodes.map(
        node => node.textContent
      );
      expect(renderedServices).toEqual(
        expect.arrayContaining(['A', 'B'])
      );
    });
  });

  const timeSlotTable = () =>
    container.querySelector('table#time-slots');

  describe('time slot table', () => {
    const today = new Date();
    const availableTimeSlots = [
      { startsAt: today.setHours(9, 0, 0, 0) },
      { startsAt: today.setHours(9, 30, 0, 0) }
    ];

    it('renders a table for time slots', () => {
      render(<AppointmentForm />);
      expect(timeSlotTable()).not.toBeNull();
    });

    it('renders a time slot for every half an hour between open and close times', () => {
      render(
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
      render(<AppointmentForm />);
      const headerRow = timeSlotTable().querySelector(
        'thead > tr'
      );
      expect(headerRow.firstChild.textContent).toEqual('');
    });

    it('renders a week of available dates', () => {
      const today = new Date(2018, 11, 1);
      render(<AppointmentForm today={today} />);
      const dates = timeSlotTable().querySelectorAll(
        'thead >* th:not(:first-child)'
      );
      expect(dates).toHaveLength(7);
      expect(dates[0].textContent).toEqual('Sat 01');
      expect(dates[1].textContent).toEqual('Sun 02');
      expect(dates[6].textContent).toEqual('Fri 07');
    });

    it('renders a radio button for each time slot', () => {
      render(
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
      render(<AppointmentForm availableTimeSlots={[]} />);
      const timesOfDay = timeSlotTable().querySelectorAll('input');
      expect(timesOfDay).toHaveLength(0);
    });

    it('sets radio button values to the startsAt value of the corresponding appointment', () => {
      render(
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
      render(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
          startsAt={availableTimeSlots[0].startsAt}
        />
      );
      expect(startsAtField(0).checked).toEqual(true);
    });

    it('saves existing value when submitted', async () => {
      expect.hasAssertions();
      render(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
          startsAt={availableTimeSlots[0].startsAt}
          onSubmit={({ startsAt }) =>
            expect(startsAt).toEqual(
              availableTimeSlots[0].startsAt
            )
          }
        />
      );
      ReactTestUtils.Simulate.submit(form('appointment'));
    });

    it('saves new value when submitted', () => {
      expect.hasAssertions();
      render(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
          startsAt={availableTimeSlots[0].startsAt}
          onSubmit={({ startsAt }) =>
            expect(startsAt).toEqual(
              availableTimeSlots[1].startsAt
            )
          }
        />
      );
      ReactTestUtils.Simulate.change(startsAtField(1), {
        target: {
          value: availableTimeSlots[1].startsAt.toString(),
          name: 'startsAt'
        }
      });
      ReactTestUtils.Simulate.submit(form('appointment'));
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

      render(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
        />
      );

      ReactTestUtils.Simulate.change(field('stylist'), {
        target: { value: 'B', name: 'stylist' }
      });

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
