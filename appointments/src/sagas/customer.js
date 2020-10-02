import { put, call } from 'redux-saga/effects';
import { objectToQueryString } from '../objectToQueryString';

const fetch = (url, data) =>
  window.fetch(url, {
    body: JSON.stringify(data),
    method: data ? 'POST' : 'GET',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' }
  });

export function* addCustomer({ customer }) {
  yield put({ type: 'ADD_CUSTOMER_SUBMITTING' });
  const result = yield call(fetch, '/customers', customer);
  if (result.ok) {
    const customerWithId = yield call([result, 'json']);
    yield put({
      type: 'ADD_CUSTOMER_SUCCESSFUL',
      customer: customerWithId
    });
  } else if (result.status === 422) {
    const response = yield call([result, 'json']);
    yield put({
      type: 'ADD_CUSTOMER_VALIDATION_FAILED',
      validationErrors: response.errors
    });
  } else {
    yield put({ type: 'ADD_CUSTOMER_FAILED' });
  }
}

export function* searchCustomers({
  lastRowIds,
  searchTerm,
  limit
}) {
  let after;
  if (lastRowIds.length > 0)
    after = lastRowIds[lastRowIds.length - 1];

  const queryString = objectToQueryString({
    after,
    searchTerm,
    limit: limit === 10 ? '' : limit
  });

  const result = yield call(fetch, `/customers${queryString}`);
  const customers = yield call([result, 'json']);
  yield put({
    type: 'SEARCH_CUSTOMERS_SUCCESSFUL',
    customers
  });
}
