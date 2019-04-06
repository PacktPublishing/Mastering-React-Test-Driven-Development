import React, { useEffect } from 'react';
import { connect } from 'react-redux';

const toTimeString = startsAt =>
  new Date(startsAt).toString().substring(0, 21);

const AppointmentRow = ({ appointment }) => (
  <tr>
    <td>{toTimeString(appointment.startsAt)}</td>
    <td>{appointment.stylist}</td>
    <td>{appointment.service}</td>
    <td>{appointment.notes}</td>
  </tr>
);

const mapStateToProps = ({
  queryCustomer: { customer, appointments, status }
}) => ({ customer, appointments, status });
const mapDispatchToProps = {
  queryCustomer: id => ({ type: 'QUERY_CUSTOMER_REQUEST', id })
};

export const CustomerHistory = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ id, queryCustomer, customer, appointments, status }) => {
  useEffect(() => {
    queryCustomer(id);
  }, [id, queryCustomer]);

  if (status === 'SUBMITTING')
    return <div id="loading">Loading</div>;

  if (status === 'FAILED')
    return (
      <div id="error">
        Sorry, an error occurred while pulling data from the
        server.
      </div>
    );

  const { firstName, lastName, phoneNumber } = customer;
  return (
    <div id="customer">
      <h2>
        {firstName} {lastName}
      </h2>
      <p>{phoneNumber}</p>
      <h3>Booked appointments</h3>
      <table>
        <thead>
          <tr>
            <th>When</th>
            <th>Stylist</th>
            <th>Service</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment, i) => (
            <AppointmentRow appointment={appointment} key={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
});
