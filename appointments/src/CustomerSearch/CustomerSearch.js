import React, { useEffect, useState } from 'react';
import { objectToQueryString } from '../objectToQueryString';
import { SearchButtons } from './SearchButtons';

const CustomerRow = ({ customer, renderCustomerActions }) => (
  <tr>
    <td>{customer.firstName}</td>
    <td>{customer.lastName}</td>
    <td>{customer.phoneNumber}</td>
    <td>{renderCustomerActions(customer)}</td>
  </tr>
);

export const CustomerSearch = ({
  renderCustomerActions,
  lastRowIds,
  searchTerm,
  limit,
  history,
  location
}) => {
  const [customers, setCustomers] = useState([]);

  const handleSearchTextChanged = ({ target: { value } }) => {
    const params = { limit, searchTerm: value };
    history.push(location.pathname + objectToQueryString(params));
  };

  useEffect(() => {
    const fetchData = async () => {
      let after;
      if (lastRowIds.length > 0)
        after = lastRowIds[lastRowIds.length - 1];
      const queryString = objectToQueryString({
        after,
        searchTerm,
        limit: limit === 10 ? '' : limit
      });

      const result = await window.fetch(
        `/customers${queryString}`,
        {
          method: 'GET',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' }
        }
      );
      setCustomers(await result.json());
    };
    fetchData();
  }, [lastRowIds, searchTerm, limit]);

  return (
    <React.Fragment>
      <input
        value={searchTerm}
        onChange={handleSearchTextChanged}
        placeholder="Enter filter text"
      />
      <SearchButtons
        customers={customers}
        searchTerm={searchTerm}
        limit={limit}
        lastRowIds={lastRowIds}
        pathname={location.pathname}
      />
      <table>
        <thead>
          <tr>
            <th>First name</th>
            <th>Last name</th>
            <th>Phone number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <CustomerRow
              customer={customer}
              key={customer.id}
              renderCustomerActions={renderCustomerActions}
            />
          ))}
        </tbody>
      </table>
    </React.Fragment>
  );
};

CustomerSearch.defaultProps = {
  renderCustomerActions: () => {},
  searchTerm: '',
  lastRowIds: []
};
