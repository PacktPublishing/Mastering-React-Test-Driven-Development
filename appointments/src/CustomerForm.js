import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  required,
  match,
  list,
  hasError,
  validateMany,
  anyErrors
} from './formValidation';

const Error = () => (
  <div className="error">An error occurred during save.</div>
);

const mapStateToProps = ({
  customer: { validationErrors, error, status }
}) => ({
  serverValidationErrors: validationErrors,
  error,
  status
});
const mapDispatchToProps = {
  addCustomerRequest: customer => ({
    type: 'ADD_CUSTOMER_REQUEST',
    customer
  })
};

export const CustomerForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  ({
    firstName,
    lastName,
    phoneNumber,
    addCustomerRequest,
    error,
    serverValidationErrors,
    status
  }) => {
    const submitting = status === 'SUBMITTING';
    const [validationErrors, setValidationErrors] = useState({});

    const [customer, setCustomer] = useState({
      firstName,
      lastName,
      phoneNumber
    });

    const validateSingleField = (fieldName, fieldValue) => {
      const result = validateMany(validators, {
        [fieldName]: fieldValue
      });
      setValidationErrors({ ...validationErrors, ...result });
    };

    const handleChange = ({ target }) => {
      setCustomer(customer => ({
        ...customer,
        [target.name]: target.value
      }));
      if (hasError(validationErrors, target.name)) {
        validateSingleField(target.name, target.value);
      }
    };

    const validators = {
      firstName: required('First name is required'),
      lastName: required('Last name is required'),
      phoneNumber: list(
        required('Phone number is required'),
        match(
          /^[0-9+()\- ]*$/,
          'Only numbers, spaces and these symbols are allowed: ( ) + -'
        )
      )
    };

    const handleBlur = ({ target }) =>
      validateSingleField(target.name, target.value);

    const renderError = fieldName => {
      const allValidationErrors = {
        ...validationErrors,
        ...serverValidationErrors
      };
      if (hasError(allValidationErrors, fieldName)) {
        return (
          <span className="error">
            {allValidationErrors[fieldName]}
          </span>
        );
      }
    };

    const handleSubmit = e => {
      e.preventDefault();
      const validationResult = validateMany(validators, customer);
      if (!anyErrors(validationResult)) {
        addCustomerRequest(customer);
      } else {
        setValidationErrors(validationResult);
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
          onBlur={handleBlur}
        />
        {renderError('firstName')}

        <label htmlFor="lastName">Last name</label>
        <input
          type="text"
          name="lastName"
          id="lastName"
          value={lastName}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {renderError('lastName')}

        <label htmlFor="phoneNumber">Phone number</label>
        <input
          type="text"
          name="phoneNumber"
          id="phoneNumber"
          value={phoneNumber}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {renderError('phoneNumber')}

        <input type="submit" value="Add" disabled={submitting} />
        {submitting ? (
          <span className="submittingIndicator" />
        ) : null}
      </form>
    );
  }
);
