import { put, call } from 'redux-saga/effects';
import { fetchQuery, graphql } from 'relay-runtime';
import { getEnvironment } from '../relayEnvironment';

const defaultState = {
  customer: {},
  appointments: [],
  status: undefined
};

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'QUERY_CUSTOMER_SUBMITTING':
      return { ...state, status: 'SUBMITTING' };
    case 'QUERY_CUSTOMER_FAILED':
      return { ...state, status: 'FAILED' };
    case 'QUERY_CUSTOMER_SUCCESSFUL':
      return {
        ...state,
        customer: action.customer,
        appointments: action.appointments,
        status: 'SUCCESSFUL'
      };
    default:
      return state;
  }
};

export const query = graphql`
  query queryCustomerQuery($id: ID!) {
    customer(id: $id) {
      id
      firstName
      lastName
      phoneNumber
      appointments {
        startsAt
        stylist
        service
        notes
      }
    }
  }
`;

const convertStartsAt = appointment => ({
  ...appointment,
  startsAt: Number(appointment.startsAt)
});

export function* queryCustomer({ id }) {
  yield put({ type: 'QUERY_CUSTOMER_SUBMITTING' });
  try {
    const { customer } = yield call(
      fetchQuery,
      getEnvironment(),
      query,
      { id }
    );
    yield put({
      type: 'QUERY_CUSTOMER_SUCCESSFUL',
      customer,
      appointments: customer.appointments.map(convertStartsAt)
    });
  } catch (e) {
    yield put({ type: 'QUERY_CUSTOMER_FAILED' });
  }
}
