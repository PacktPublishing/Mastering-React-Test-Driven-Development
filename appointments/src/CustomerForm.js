import * as React from 'react';

export const CustomerForm = ({
  firstName,
  lastName,
  phoneNumber,
  onSubmit,
}) => {
  const [customer, setCustomer] = React.useState({
    firstName,
    lastName,
    phoneNumber,
  });

  const handleChange = ({ target }) => {
    setCustomer({ ...customer, [target.name]: target.value });
  };

  return (
    <form
      id="customer"
      onSubmit={(event) => {
        event.stopPropagation()
        onSubmit(customer);
      }}>
      <label htmlFor="firstName">First name:</label>
      <input
        type="text"
        id="firstName"
        name="firstName"
        value={firstName}
        onChange={handleChange}
      />
      <label htmlFor="lastName">Last name:</label>
      <input
        type="text"
        id="lastName"
        name="lastName"
        value={lastName}
        onChange={handleChange}
      />
      <label htmlFor="phoneNumber">Phone number:</label>
      <input
        type="text"
        id="phoneNumber"
        name="phoneNumber"
        value={phoneNumber}
        onChange={handleChange}
      />
      <input type="submit" value="Add"/>
    </form>
  );
};
