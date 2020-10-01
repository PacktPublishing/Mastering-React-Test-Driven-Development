import { reducer } from '../../src/reducers/customer';
import {
  itMaintainsExistingState,
  itSetsStatus
} from '../reducerGenerators';

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

    it('resets error to false', () => {
      expect(reducer({ error: true }, action)).toMatchObject({
        error: false
      });
    });
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
