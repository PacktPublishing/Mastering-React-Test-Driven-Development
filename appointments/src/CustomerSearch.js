import React, { useEffect, useState, useCallback } from 'react';
import { objectToQueryString } from './objectToQueryString';

const ToggleButton = ({ id, onClick, toggled, children }) => {
  let className = 'toggle-button';
  if (toggled) {
    className += ' toggled';
  }
  return (
    <a id={id} onClick={onClick} className={className}>
      {children}
    </a>
  );
};

const SearchButtons = ({
  handleLimit,
  handleNext,
  handlePrevious,
  limit,
  hasNext,
  hasPrevious
}) => (
  <div className="button-bar">
    <ToggleButton
      id="limit-10"
      onClick={() => handleLimit(10)}
      toggled={limit === 10}>
      10
    </ToggleButton>
    <ToggleButton
      id="limit-20"
      onClick={() => handleLimit(20)}
      toggled={limit === 20}>
      20
    </ToggleButton>
    <ToggleButton
      id="limit-50"
      onClick={() => handleLimit(50)}
      toggled={limit === 50}>
      50
    </ToggleButton>
    <ToggleButton
      id="limit-100"
      onClick={() => handleLimit(100)}
      toggled={limit === 100}>
      100
    </ToggleButton>
    <button
      role="button"
      id="previous-page"
      onClick={handlePrevious}
      disabled={!hasPrevious}>
      Previous
    </button>
    <button
      role="button"
      id="next-page"
      onClick={handleNext}
      disabled={!hasNext}>
      Next
    </button>
  </div>
);

const CustomerRow = ({ customer, renderCustomerActions }) => (
  <tr>
    <td>{customer.firstName}</td>
    <td>{customer.lastName}</td>
    <td>{customer.phoneNumber}</td>
    <td>{renderCustomerActions(customer)}</td>
  </tr>
);

export const CustomerSearch = ({ renderCustomerActions }) => {
  const [customers, setCustomers] = useState([]);
  const [lastRowIds, setLastRowIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [limit, setLimit] = useState(10);

  const handleSearchTextChanged = ({ target: { value } }) =>
    setSearchTerm(value);

  const handleNext = useCallback(() => {
    const currentLastRowId = customers[customers.length - 1].id;
    setLastRowIds([...lastRowIds, currentLastRowId]);
  }, [customers, lastRowIds]);

  const handlePrevious = useCallback(
    () => setLastRowIds(lastRowIds.slice(0, -1)),
    [lastRowIds]
  );

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

  const hasNext = customers.length === limit;
  const hasPrevious = lastRowIds.length > 0;

  return (
    <React.Fragment>
      <input
        value={searchTerm}
        onChange={handleSearchTextChanged}
        placeholder="Enter filter text"
      />
      <SearchButtons
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        handleLimit={setLimit}
        limit={limit}
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
  renderCustomerActions: () => {}
};
