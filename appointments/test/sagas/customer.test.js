import { storeSpy, expectRedux } from 'expect-redux';
import 'whatwg-fetch';
import {
  fetchResponseOk,
  fetchResponseError
} from '../spyHelpers';
import {
  itMaintainsExistingState,
  itSetsStatus
} from '../reducerGenerators';
import { configureStore } from '../../src/store';
import { reducer } from '../../src/sagas/customer';

describe('addCustomer', () => {
  const customer = { id: 123 };
  let store;

  beforeEach(() => {
    jest
      .spyOn(window, 'fetch')
      .mockReturnValue(fetchResponseOk(customer));
    store = configureStore([storeSpy]);
  });

  const dispatchRequest = customer =>
    store.dispatch({
      type: 'ADD_CUSTOMER_REQUEST',
      customer
    });

  it('sets current status to submitting', () => {
    dispatchRequest();

    return expectRedux(store)
      .toDispatchAnAction()
      .matching({ type: 'ADD_CUSTOMER_SUBMITTING' });
  });

  it('submits request to the fetch api', async () => {
    const inputCustomer = { firstName: 'Ashley' };
    dispatchRequest(inputCustomer);

    expect(window.fetch).toHaveBeenCalledWith('/customers', {
      body: JSON.stringify(inputCustomer),
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' }
    });
  });

  it('dispatches ADD_CUSTOMER_SUCCESSFUL on success', () => {
    dispatchRequest();

    return expectRedux(store)
      .toDispatchAnAction()
      .matching({ type: 'ADD_CUSTOMER_SUCCESSFUL', customer });
  });

  it('dispatches ADD_CUSTOMER_FAILED on non-specific error', () => {
    window.fetch.mockReturnValue(fetchResponseError());
    dispatchRequest();

    return expectRedux(store)
      .toDispatchAnAction()
      .matching({ type: 'ADD_CUSTOMER_FAILED' });
  });

  it('dispatches ADD_CUSTOMER_VALIDATION_FAILED if validation errors were returned', () => {
    const errors = { field: 'field', description: 'error text' };
    window.fetch.mockReturnValue(
      fetchResponseError(422, { errors })
    );

    dispatchRequest();

    return expectRedux(store)
      .toDispatchAnAction()
      .matching({
        type: 'ADD_CUSTOMER_VALIDATION_FAILED',
        validationErrors: errors
      });
  });
});

describe('reducer', () => {
  it('returns a default state for an undefined existing state', () => {
    expect(reducer(undefined, {})).toEqual({
      customer: {},
      status: undefined,
      validationErrors: {},
      error: false
    });
  });

  describe('ADD_CUSTOMER_SUBMITTING action', () => {
    const action = { type: 'ADD_CUSTOMER_SUBMITTING' };

    itMaintainsExistingState(reducer, action);
    itSetsStatus(reducer, action, 'SUBMITTING');
  });

  describe('ADD_CUSTOMER_FAILED action', () => {
    const action = { type: 'ADD_CUSTOMER_FAILED' };

    itMaintainsExistingState(reducer, action);
    itSetsStatus(reducer, action, 'FAILED');

    it('sets error to true', () => {
      expect(reducer(undefined, action)).toMatchObject({
        error: true
      });
    });
  });

  describe('ADD_CUSTOMER_VALIDATION_FAILED action', () => {
    const validationErrors = { field: 'error text' };
    const action = {
      type: 'ADD_CUSTOMER_VALIDATION_FAILED',
      validationErrors
    };

    itMaintainsExistingState(reducer, action);
    itSetsStatus(reducer, action, 'VALIDATION_FAILED');

    it('sets validation errors to provided errors', () => {
      expect(reducer(undefined, action)).toMatchObject({
        validationErrors
      });
    });
  });

  describe('ADD_CUSTOMER_SUCCESSFUL action', () => {
    const customer = { id: 123 };
    const action = { type: 'ADD_CUSTOMER_SUCCESSFUL', customer };

    itMaintainsExistingState(reducer, action);
    itSetsStatus(reducer, action, 'SUCCESSFUL');

    it('sets customer to provided customer', () => {
      expect(reducer(undefined, action)).toMatchObject({
        customer
      });
    });
  });
});
