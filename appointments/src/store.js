import {
  createStore,
  applyMiddleware,
  compose,
  combineReducers
} from 'redux';
import createSagaMiddleware from 'redux-saga';
import { takeLatest } from 'redux-saga/effects';
import {
  selectCustomerAndNavigate,
  appointmentAdded
} from './sagas/app';
import { addAppointment } from './sagas/appointment';
import { addCustomer, searchCustomers } from './sagas/customer';
import { reducer as appointmentReducer } from './reducers/appointment';
import { reducer as customerReducer } from './reducers/customer';
import {
  queryCustomer,
  reducer as queryCustomerReducer
} from './sagas/queryCustomer';

function* rootSaga() {
  yield takeLatest('ADD_CUSTOMER_REQUEST', addCustomer);
  yield takeLatest(
    'ADD_CUSTOMER_SUCCESSFUL',
    selectCustomerAndNavigate
  );
  yield takeLatest('ADD_APPOINTMENT_REQUEST', addAppointment);
  yield takeLatest('ADD_APPOINTMENT_SUCCESSFUL', appointmentAdded);
  yield takeLatest('SEARCH_CUSTOMERS_REQUEST', searchCustomers);
  yield takeLatest('CUSTOMER_SELECTED', selectCustomerAndNavigate);
  yield takeLatest('QUERY_CUSTOMER_REQUEST', queryCustomer);
}

export const configureStore = (storeEnhancers = []) => {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    combineReducers({
      customer: customerReducer,
      appointment: appointmentReducer,
      queryCustomer: queryCustomerReducer
    }),
    compose(
      ...[applyMiddleware(sagaMiddleware), ...storeEnhancers]
    )
  );
  sagaMiddleware.run(rootSaga);

  return store;
};
