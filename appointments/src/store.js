import {
  createStore,
  applyMiddleware,
  compose,
  combineReducers
} from 'redux';
import createSagaMiddleware from 'redux-saga';
import { takeLatest } from 'redux-saga/effects';
import { customerAdded, appointmentAdded } from './sagas/app';
import { addAppointment } from './sagas/appointment';
import { addCustomer, searchCustomers } from './sagas/customer';
import { reducer as appointmentReducer } from './reducers/appointment';
import { reducer as customerReducer } from './reducers/customer';

function* rootSaga() {
  yield takeLatest('ADD_CUSTOMER_REQUEST', addCustomer);
  yield takeLatest('ADD_CUSTOMER_SUCCESSFUL', customerAdded);
  yield takeLatest('ADD_APPOINTMENT_REQUEST', addAppointment);
  yield takeLatest('ADD_APPOINTMENT_SUCCESSFUL', appointmentAdded);
  yield takeLatest('SEARCH_CUSTOMERS_REQUEST', searchCustomers);
}

export const configureStore = (storeEnhancers = []) => {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    combineReducers({
      customer: customerReducer,
      appointment: appointmentReducer
    }),
    compose(
      ...[applyMiddleware(sagaMiddleware), ...storeEnhancers]
    )
  );
  sagaMiddleware.run(rootSaga);

  return store;
};
