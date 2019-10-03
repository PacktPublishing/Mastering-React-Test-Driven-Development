import React from 'react';
import ReactDOM from 'react-dom';
import { Appointment } from '../src/Appointment';

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
