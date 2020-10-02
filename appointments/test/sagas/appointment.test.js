import { storeSpy, expectRedux } from 'expect-redux';
import 'whatwg-fetch';
import {
  fetchResponseOk,
  fetchResponseError
} from '../spyHelpers';
import { configureStore } from '../../src/store';

describe('addAppointment', () => {
  const appointment = { from: '123', to: '234' };
  const customer = { id: 123 };
  let store;

  beforeEach(() => {
    jest
      .spyOn(window, 'fetch')
      .mockReturnValue(fetchResponseOk(customer));
    store = configureStore([storeSpy]);
  });

  const dispatchRequest = (appointment, customer) =>
    store.dispatch({
      type: 'ADD_APPOINTMENT_REQUEST',
      appointment,
      customer
    });

  it('submits request to the fetch api', async () => {
    dispatchRequest(appointment, customer);

    expect(window.fetch).toHaveBeenCalledWith('/appointments', {
      body: JSON.stringify({
        ...appointment,
        customer: customer.id
      }),
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' }
    });
  });

  it('dispatches ADD_APPOINTMENT_SUCCESSFUL on success', () => {
    dispatchRequest(appointment, customer);

    return expectRedux(store)
      .toDispatchAnAction()
      .matching({ type: 'ADD_APPOINTMENT_SUCCESSFUL' });
  });

  it('dispatches ADD_APPOINTMENT_FAILED on non-specific error', () => {
    window.fetch.mockReturnValue(fetchResponseError());
    dispatchRequest(appointment, customer);

    return expectRedux(store)
      .toDispatchAnAction()
      .matching({ type: 'ADD_APPOINTMENT_FAILED' });
  });
});
