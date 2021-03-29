import React, { useState } from 'react';

export const CustomerForm = ({
  firstName,
  onSubmit,
  lastName,
}) => {
  const [customer, setCustomer] = useState({
    firstName,
    lastName,
  });

  const handleChangeFirstName = ({ target }) =>
    setCustomer((customer) => ({
      ...customer,
      firstName: target.value,
    }));

  const handleChangeLastName = ({ target }) =>
    setCustomer((customer) => ({
      ...customer,
      lastName: target.value,
    }));
  return (
    <form id="customer" onSubmit={() => onSubmit(customer)}>
      <label htmlFor="firstName">First name</label>
      <input
        type="text"
        name="firstName"
        id="firstName"
        value={firstName}
        onChange={handleChangeFirstName}
      />
      <label htmlFor="lastName">Last name</label>
      <input
        type="text"
        name="lastName"
        id="lastName"
        value={lastName}
        onChange={handleChangeLastName}
      />
    </form>
  );
};
