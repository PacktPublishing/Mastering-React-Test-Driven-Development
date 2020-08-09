import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import { Appointment, AppointmentsDayView } from '../src/AppointmentsDayView';

describe('Appointment', () => {
    let container;
    const customer = {
        firstName: 'Ashley',
        lastName: 'Alexa',
        phoneNumber: '08012345678',
        stylist: 'Fox',
        service: 'cut',
        notes: 'I have a cupon',
    };


    const render = (component) => ReactDOM.render(component, container);

    beforeEach(() => {
        container = document.createElement('div');
    });

    it('renders the customer information', () => {
        render(<Appointment customer={customer} />);
        expect(container.textContent).toMatch(`${customer.firstName} ${customer.lastName}`);
        expect(container.textContent).toMatch(customer.phoneNumber);
        expect(container.textContent).toMatch(customer.stylist);
        expect(container.textContent).toMatch(customer.service);
        expect(container.textContent).toMatch(customer.notes);
    });

    it('renders header appointment time', () => {
        const today = new Date();
        const startsAt = today.setHours(12, 0);
        render(<Appointment startsAt={startsAt} customer={customer} />);
        expect(container.textContent).toMatch(
            'Today\'s appointment at 12:00'
        );
    })
});

describe('AppointmentsDayView', () => {
    let container;
    const today = new Date();
    const appointments = [
        {
            startsAt: today.setHours(12, 0),
            customer: { firstName: 'Ashley' },
        },
        {
            startsAt: today.setHours(13, 0),
            customer: { firstName: 'Jon' },
        },
    ]

    beforeEach(() => {
        container = document.createElement('div');
    });

    const render = (component) => ReactDOM.render(component, container);

    it('renders a div with the right id', () => {
        render(<AppointmentsDayView appointments={appointments} />);
        expect(container.querySelector('div#appointmentsDayView')).not.toBeNull();
    });

    it('renders multiple appointments in an ol element', () => {
        render(<AppointmentsDayView appointments={appointments} />);

        expect(container.querySelector('ol')).not.toBeNull();
        expect(container.querySelectorAll('li')).toHaveLength(2);
        expect(container.querySelectorAll('li')[0].textContent).toBe('12:00');
        expect(container.querySelectorAll('li')[1].textContent).toBe('13:00');
    });

    it('initially shows a message saying there are no appointments today', () => {
        render(<AppointmentsDayView appointments={[]} />);
        expect(container.textContent).toMatch(
            'There are no appointments scheduled for today.'
        );
    });

    it('selects the first appointment by default', () => {
        render(<AppointmentsDayView appointments={appointments} />);
        expect(container.textContent).toMatch('Ashley');
    });

    it('has a button element in each li', () => {
        render(<AppointmentsDayView appointments={appointments} />);
        expect(container.querySelectorAll('li > button')).toHaveLength(2);
        expect(container.querySelectorAll('li > button')[0].type).toEqual('button');
    });

    it('renders another appointment when selected', () => {
        render(<AppointmentsDayView appointments={appointments} />);
        const button = container.querySelectorAll('button')[1];
        ReactTestUtils.Simulate.click(button);
        expect(container.textContent).toMatch('Jon');
    });
})