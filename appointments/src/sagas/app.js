import { put } from 'redux-saga/effects';
import { appHistory } from '../history';

export function* appointmentAdded() {
  appHistory.push('/');
}

export function* selectCustomerAndNavigate({ customer }) {
  yield put({ type: 'SET_CUSTOMER_FOR_APPOINTMENT', customer });
  appHistory.push('/addAppointment');
}
