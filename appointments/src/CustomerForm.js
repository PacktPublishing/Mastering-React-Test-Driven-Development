import React, { useState } from 'react';

const Error = () => (
  <div className="error">An error occurred during save.</div>
);

export const CustomerForm = ({
  firstName,
  lastName,
  phoneNumber,
  onSave
}) => {
  const [error, setError] = useState(false);

  const [customer, setCustomer] = useState({
    firstName,
    lastName,
    phoneNumber
  });

  const handleChange = ({ target }) =>
    setCustomer(customer => ({
      ...customer,
      [target.name]: target.value
    }));

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await window.fetch('/customers', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer)
    });
    if (result.ok) {
      setError(false);
      const customerWithId = await result.json();
      onSave(customerWithId);
    } else {
      setError(true);
    }
  };

  return (
    <form id="customer" onSubmit={handleSubmit}>
      {error ? <Error /> : null}
      <label htmlFor="firstName">First name</label>
      <input
        type="text"
        name="firstName"
        id="firstName"
        value={firstName}
        onChange={handleChange}
      />

      <label htmlFor="lastName">Last name</label>
      <input
        type="text"
        name="lastName"
        id="lastName"
        value={lastName}
        onChange={handleChange}
      />

      <label htmlFor="phoneNumber">Phone number</label>
      <input
        type="text"
        name="phoneNumber"
        id="phoneNumber"
        value={phoneNumber}
        onChange={handleChange}
      />

      <input type="submit" value="Add" />
    </form>
  );
};

CustomerForm.defaultProps = {
  onSave: () => {}
};
