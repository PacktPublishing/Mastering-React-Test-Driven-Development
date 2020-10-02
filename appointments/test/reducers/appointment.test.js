import { reducer } from '../../src/reducers/appointment';
import { itMaintainsExistingState } from '../reducerGenerators';

describe('reducer', () => {
  it('returns a default state for an undefined existing state', () => {
    expect(reducer(undefined, {})).toEqual({
      appointment: {},
      customer: {},
      error: false
    });
  });

  describe('ADD_APPOINTMENT_REQUEST action', () => {
    const action = { type: 'ADD_APPOINTMENT_REQUEST' };

    itMaintainsExistingState(reducer, action);

    it('resets error to false', () => {
      expect(reducer({ error: true }, action)).toMatchObject({
        error: false
      });
    });
  });

  describe('ADD_APPOINTMENT_FAILED action', () => {
    const action = { type: 'ADD_APPOINTMENT_FAILED' };

    itMaintainsExistingState(reducer, action);

    it('resets error to true', () => {
      expect(reducer({ error: false }, action)).toMatchObject({
        error: true
      });
    });
  });

  describe('SET_CUSTOMER_FOR_APPOINTMENT action', () => {
    const customer = { id: 123 };
    const action = {
      type: 'SET_CUSTOMER_FOR_APPOINTMENT',
      customer
    };

    itMaintainsExistingState(reducer, action);

    it('sets the customer', () => {
      expect(reducer(undefined, action)).toMatchObject({
        customer
      });
    });
  });
});
