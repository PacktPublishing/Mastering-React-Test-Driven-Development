import { put, call } from 'redux-saga/effects';

const fetch = (url, data) =>
  window.fetch(url, {
    body: JSON.stringify(data),
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' }
  });

export function* addAppointment({ appointment, customer }) {
  const result = yield call(fetch, '/appointments', {
    ...appointment,
    customer: customer.id
  });
  if (result.ok) {
    yield put({ type: 'ADD_APPOINTMENT_SUCCESSFUL' });
  } else {
    yield put({ type: 'ADD_APPOINTMENT_FAILED' });
  }
}
