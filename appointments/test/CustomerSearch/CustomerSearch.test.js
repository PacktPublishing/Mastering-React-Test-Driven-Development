import React from 'react';
import 'whatwg-fetch';
import { MemoryRouter } from 'react-router-dom';
import { fetchResponseOk } from '../spyHelpers';
import { createContainer, withEvent } from '../domManipulators';
import * as SearchButtonsExports from '../../src/CustomerSearch/SearchButtons';
import { CustomerSearch } from '../../src/CustomerSearch/CustomerSearch';

const oneCustomer = [
  { id: 1, firstName: 'A', lastName: 'B', phoneNumber: '1' }
];

const twoCustomers = [
  { id: 1, firstName: 'A', lastName: 'B', phoneNumber: '1' },
  { id: 2, firstName: 'C', lastName: 'D', phoneNumber: '2' }
];

const tenCustomers = Array.from('0123456789', id => ({ id }));

const anotherTenCustomers = Array.from('ABCDEFGHIJ', id => ({
  id
}));

const lessThanTenCustomers = Array.from('0123456', id => ({
  id: id
}));

const twentyCustomers = Array.from('0123456789ABCDEFGHIJ', id => ({
  id: id
}));

describe('CustomerSearch', () => {
  let renderAndWait, element, elements, clickAndWait, change;
  let historySpy, actionSpy;

  beforeEach(() => {
    ({
      renderAndWait,
      element,
      elements,
      clickAndWait,
      change
    } = createContainer());
    jest
      .spyOn(window, 'fetch')
      .mockReturnValue(fetchResponseOk([]));
    historySpy = jest.fn();
    actionSpy = jest.fn();
    jest
      .spyOn(SearchButtonsExports, 'SearchButtons')
      .mockReturnValue(null);
  });

  const renderCustomerSearch = props =>
    renderAndWait(
      <CustomerSearch
        {...props}
        history={{ push: historySpy }}
        renderCustomerActions={actionSpy}
        location={{ pathname: '/path' }}
      />
    );

  it('renders a table with four headings', async () => {
    await renderCustomerSearch();
    const headings = elements('table th');
    expect(headings.map(h => h.textContent)).toEqual([
      'First name',
      'Last name',
      'Phone number',
      'Actions'
    ]);
  });

  it('fetches all customer data when component mounts', async () => {
    await renderCustomerSearch();
    expect(window.fetch).toHaveBeenCalledWith('/customers', {
      method: 'GET',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' }
    });
  });

  it('renders all customer data in a table row', async () => {
    window.fetch.mockReturnValue(fetchResponseOk(oneCustomer));
    await renderCustomerSearch();
    const columns = elements('table > tbody > tr > td');
    expect(columns[0].textContent).toEqual('A');
    expect(columns[1].textContent).toEqual('B');
    expect(columns[2].textContent).toEqual('1');
  });

  it('renders multiple customer rows', async () => {
    window.fetch.mockReturnValue(fetchResponseOk(twoCustomers));
    await renderCustomerSearch();
    const rows = elements('table tbody tr');
    expect(rows[1].childNodes[0].textContent).toEqual('C');
  });

  it('has a search input field with a placeholder', async () => {
    await renderCustomerSearch();
    expect(element('input')).not.toBeNull();
    expect(element('input').getAttribute('placeholder')).toEqual(
      'Enter filter text'
    );
  });

  it('changes location when search term is changed', async () => {
    await renderCustomerSearch();
    change(element('input'), withEvent('input', 'name'));
    expect(historySpy).toHaveBeenCalledWith(
      '/path?searchTerm=name'
    );
  });

  it('displays provided action buttons for each customer', async () => {
    actionSpy.mockReturnValue('actions');
    window.fetch.mockReturnValue(fetchResponseOk(oneCustomer));
    await renderCustomerSearch();
    const rows = elements('table tbody td');
    expect(rows[rows.length - 1].textContent).toEqual('actions');
  });

  it('passes customer to the renderCustomerActions prop', async () => {
    actionSpy.mockReturnValue('actions');
    window.fetch.mockReturnValue(fetchResponseOk(oneCustomer));
    await renderCustomerSearch();
    expect(actionSpy).toHaveBeenCalledWith(oneCustomer[0]);
  });

  it('renders SearchButtons with props', async () => {
    window.fetch.mockReturnValue(fetchResponseOk(tenCustomers));

    await renderCustomerSearch({
      searchTerm: 'term',
      limit: 20,
      lastRowIds: ['123'],
      pathname: '/path'
    });

    expect(
      SearchButtonsExports.SearchButtons
    ).toHaveBeenCalledWith(
      {
        customers: tenCustomers,
        searchTerm: 'term',
        limit: 20,
        lastRowIds: ['123'],
        pathname: '/path'
      },
      expect.anything()
    );
  });
});
