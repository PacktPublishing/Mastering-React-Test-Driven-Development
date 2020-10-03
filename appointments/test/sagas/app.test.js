import { storeSpy, expectRedux } from 'expect-redux';
import { configureStore } from '../../src/store';
import * as HistoryExports from '../../src/history';

describe('app sagas', () => {
  let store, pushSpy;

  beforeEach(() => {
    pushSpy = jest.spyOn(HistoryExports.appHistory, 'push');
    store = configureStore([storeSpy]);
  });

  describe('appointmentAdded', () => {
    const dispatchRequest = () =>
      store.dispatch({
        type: 'ADD_APPOINTMENT_SUCCESSFUL'
      });

    it('pushes / to history', () => {
      dispatchRequest();
      expect(pushSpy).toHaveBeenCalledWith('/');
    });
  });

  describe('customerSelected', () => {
    const customer = { id: 123 };

    const dispatchRequest = customer =>
      store.dispatch({
        type: 'ADD_CUSTOMER_SUCCESSFUL',
        customer
      });

    it('pushes /addAppointment to history', () => {
      dispatchRequest();
      expect(pushSpy).toHaveBeenCalledWith('/addAppointment');
    });

    it('dispatches a SET_CUSTOMER_FOR_APPOINTMENT action', () => {
      dispatchRequest(customer);
      return expectRedux(store)
        .toDispatchAnAction()
        .matching({
          type: 'SET_CUSTOMER_FOR_APPOINTMENT',
          customer
        });
    });

    it('navigates to /addAppointment when clicking the Create appointment button', () => {
      dispatchRequest(customer);
      expect(pushSpy).toHaveBeenCalledWith('/addAppointment');
    });
  });
});
