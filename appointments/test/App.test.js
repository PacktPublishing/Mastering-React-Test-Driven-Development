import React from 'react';
import {
  createShallowRenderer,
  type,
  click,
  childrenOf,
  className,
  id,
  prop
} from './shallowHelpers';
import { Route, Link, Switch } from 'react-router-dom';
import { App, MainScreen } from '../src/App';
import { AppointmentFormLoader } from '../src/AppointmentFormLoader';
import { AppointmentsDayViewLoader } from '../src/AppointmentsDayViewLoader';
import { CustomerForm } from '../src/CustomerForm';
import { CustomerSearchRoute } from '../src/CustomerSearchRoute';

describe('MainScreen', () => {
  let render, child, elementMatching;

  beforeEach(() => {
    ({ render, child, elementMatching } = createShallowRenderer());
  });

  it('renders a button bar as the first child', () => {
    render(<MainScreen />);
    expect(child(0).type).toEqual('div');
    expect(child(0).props.className).toEqual('button-bar');
  });

  it('renders an AppointmnentsDayViewLoader', () => {
    render(<MainScreen />);
    expect(
      elementMatching(type(AppointmentsDayViewLoader))
    ).toBeDefined();
  });

  it('renders a Link to /addCustomer', () => {
    render(<MainScreen />);
    const links = childrenOf(
      elementMatching(className('button-bar'))
    );
    expect(links[0].type).toEqual(Link);
    expect(links[0].props.to).toEqual('/addCustomer');
    expect(links[0].props.className).toEqual('button');
    expect(links[0].props.children).toEqual(
      'Add customer and appointment'
    );
  });

  it('renders a Link to /searchCustomers', () => {
    render(<MainScreen />);
    const links = childrenOf(
      elementMatching(className('button-bar'))
    );
    expect(links[1].type).toEqual(Link);
    expect(links[1].props.to).toEqual('/searchCustomers');
    expect(links[1].props.className).toEqual('button');
    expect(links[1].props.children).toEqual('Search customers');
  });
});

describe('App', () => {
  let render, elementMatching, child, log;
  let historySpy;

  beforeEach(() => {
    ({
      render,
      elementMatching,
      child,
      log
    } = createShallowRenderer());
    historySpy = jest.fn();
  });

  const switchElement = () => elementMatching(type(Switch));
  const childRoutes = () =>
    childrenOf(elementMatching(type(Switch)));

  const routeFor = path => childRoutes().find(prop('path', path));

  it('renders the MainScreen as the default route', () => {
    render(<App />);
    const routes = childRoutes();
    const lastRoute = routes[routes.length - 1];
    expect(lastRoute.props.component).toEqual(MainScreen);
  });

  it('renders CustomerForm at the /addCustomer endpoint', () => {
    render(<App />);
    expect(routeFor('/addCustomer').props.component).toEqual(
      CustomerForm
    );
  });

  it('renders AppointmentFormLoader at /addAppointment', () => {
    render(<App />);
    expect(
      routeFor('/addAppointment').props.render().type
    ).toEqual(AppointmentFormLoader);
  });

  it('renders CustomerSearchRoute at /searchCustomers', () => {
    render(<App />);
    expect(
      routeFor('/searchCustomers').props.render().type
    ).toEqual(CustomerSearchRoute);
  });

  const customer = { id: 123 };

  it('navigates to / when AppointmentFormLoader is saved', () => {
    render(<App history={{ push: historySpy }} />);
    const onSave = routeFor('/addAppointment').props.render().props
      .onSave;
    onSave();
    expect(historySpy).toHaveBeenCalledWith('/');
  });

  describe('search customers', () => {
    let dispatchSpy;

    beforeEach(() => {
      dispatchSpy = jest.fn();
    });

    const renderSearchActionsForCustomer = customer => {
      render(
        <App
          history={{ push: historySpy }}
          setCustomerForAppointment={dispatchSpy}
        />
      );
      const customerSearch = routeFor(
        '/searchCustomers'
      ).props.render();
      const searchActionsComponent =
        customerSearch.props.renderCustomerActions;
      return searchActionsComponent(customer);
    };

    it('passes a button to the CustomerSearch named Create appointment', () => {
      const button = childrenOf(
        renderSearchActionsForCustomer()
      )[0];
      expect(button).toBeDefined();
      expect(button.type).toEqual('button');
      expect(button.props.role).toEqual('button');
      expect(button.props.children).toEqual('Create appointment');
    });

    it('navigates to /addAppointment when clicking the Create appointment button', () => {
      const button = childrenOf(
        renderSearchActionsForCustomer(customer)
      )[0];
      click(button);
      expect(historySpy).toHaveBeenCalledWith('/addAppointment');
    });

    it('passes saved customer to AppointmentFormLoader when clicking the Create appointment button', () => {
      const button = childrenOf(
        renderSearchActionsForCustomer(customer)
      )[0];
      click(button);
      expect(dispatchSpy).toHaveBeenCalledWith(customer);
    });
  });
});
