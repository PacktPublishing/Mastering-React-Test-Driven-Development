import * as React from 'react';

export const CustomerForm = ({ firstName, onSubmit }) => {
  const [customer, setCustomer] = React.useState({ firstName });

  return (
    <form
      id="customer"
      onSubmit={() => {
        onSubmit(customer);
      }}>
      <label htmlFor="firstName">First name:</label>
      <input
        type="text"
        id="firstName"
        name="firstName"
        value={firstName}
        onChange={({ target }) => {
          setCustomer({ ...customer, firstName: target.value });
        }}
      />
    </form>
  );
};
