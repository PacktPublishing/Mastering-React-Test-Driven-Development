import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import { Appointment, AppointmentsDayView } from '../src/AppointmentsDayView';

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
        {
            startsAt: today.setHours(12, 0),
            customer: {firstName: 'Dan'}
        },
        {
            startsAt: today.setHours(13, 0),
            customer: {firstName: 'Allan'}
        }
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

    it('initially shows a message saying there are no appointments', () => {
        render(<AppointmentsDayView appointments={[]} />);
        expect(container.textContent)
            .toMatch("There are no appointments today");
    });

    it('selects the first apprtment by default', () => {
        render(<AppointmentsDayView appointments={appointments} />);
        expect(container.textContent)
            .toMatch("Dan");
    });

    it('has a button in each list item', () => {
        render(<AppointmentsDayView appointments={appointments} />);
        expect(container.querySelectorAll('li > button')).toHaveLength(2)
    });

    it('renders another appointment when selected', () => {
        render(<AppointmentsDayView appointments={appointments} />);
        const button = container.querySelectorAll('button')[1];
        ReactTestUtils.Simulate.click(button);
        expect(container.textContent).toMatch('Allan')
    });
});
