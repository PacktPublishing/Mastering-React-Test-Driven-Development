import { storeSpy, expectRedux } from 'expect-redux';
import 'whatwg-fetch';
import {
  fetchResponseOk,
  fetchResponseError
} from '../spyHelpers';
import { configureStore } from '../../src/store';

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

describe('searchCustomers', () => {
  let store;

  const customers = [{ id: '123' }, { id: '234' }];

  beforeEach(() => {
    jest
      .spyOn(window, 'fetch')
      .mockReturnValue(fetchResponseOk(customers));
    store = configureStore([storeSpy]);
  });

  const defaultParams = {
    lastRowIds: [],
    searchTerm: '',
    limit: 10
  };

  const dispatchRequest = ({ lastRowIds, searchTerm, limit }) =>
    store.dispatch({
      type: 'SEARCH_CUSTOMERS_REQUEST',
      lastRowIds,
      searchTerm,
      limit
    });

  describe('calling GET /customers', () => {
    it('customers with the default search items', () => {
      dispatchRequest(defaultParams);

      expect(window.fetch).toHaveBeenCalledWith('/customers', {
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'GET'
      });
    });

    it('sends the after query param as the last item in lastRowIds', () => {
      dispatchRequest({
        ...defaultParams,
        lastRowIds: [123, 234, 345]
      });

      expect(window.fetch).toHaveBeenCalledWith(
        '/customers?after=345',
        expect.anything()
      );
    });

    it('sends the search term query param', () => {
      dispatchRequest({
        ...defaultParams,
        searchTerm: 'name'
      });

      expect(window.fetch).toHaveBeenCalledWith(
        '/customers?searchTerm=name',
        expect.anything()
      );
    });

    it('sends the limit query param', () => {
      dispatchRequest({
        ...defaultParams,
        limit: 40
      });

      expect(window.fetch).toHaveBeenCalledWith(
        '/customers?limit=40',
        expect.anything()
      );
    });
  });

  it('dispatches SEARCH_CUSTOMERS_SUCCESSFUL', () => {
    dispatchRequest(defaultParams);

    return expectRedux(store)
      .toDispatchAnAction()
      .matching({
        type: 'SEARCH_CUSTOMERS_SUCCESSFUL',
        customers
      });
  });
});
