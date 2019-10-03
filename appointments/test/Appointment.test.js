import React from 'react';
import ReactDOM from 'react-dom';
import { Appointment, AppointmentsDayView } from '../src/Appointment';

describe('Appointment', () => {

    let customer;
    let container;

    beforeEach(() => {
        container = document.createElement('div');
    });

    const render = component => ReactDOM.render(component, container);

    it('renders a customers fist name', () => {
        customer = { firstName: 'Dan' };
        render(<Appointment customer={customer} />);
        expect(container.textContent).toMatch('Dan');
    });

    it('renders another customers fist name', () => {
        customer = { firstName: 'Alan' };
        render(<Appointment customer={customer} />);
        expect(container.textContent).toMatch('Alan');
    });
});

describe('AppointmentsDayView', () => {

    let container;

    beforeEach(() => {
        container = document.createElement('div');
    });

    const render = component => ReactDOM.render(component, container);

    const today = new Date();
    const appointments = [
        { startsAt: today.setHours(12, 0) },
        { startsAt: today.setHours(13, 0) }
    ];

    it('renders a div with the correct id', () => {
        render(<AppointmentsDayView appointments={[]} />);
        expect(container.querySelector('div#appointmentsDayView'))
            .not
            .toBeNull();
    });

    it('renders multiple appointments in an ordered list', () => {
        render(<AppointmentsDayView appointments={appointments} />);
        expect(container.querySelector('ol')).not.toBeNull();
        expect(container.querySelector('ol').children).toHaveLength(2);
    });

    it('renders each appointment in a list element', () => {
        render(<AppointmentsDayView appointments={appointments} />);
        expect(container.querySelectorAll('li')).toHaveLength(2);
        expect(container.querySelectorAll('li')[0].textContent)
            .toEqual('12:00');
        expect(container.querySelectorAll('li')[1].textContent)
            .toEqual('13:00');
    });
});
