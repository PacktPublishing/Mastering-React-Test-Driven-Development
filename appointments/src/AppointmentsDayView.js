import * as React from 'react';

export const Appointment = ({
  startsAt,
  customer,
  stylist,
  service,
  notes,
}) => (
  <div id="appointmentView">
    <h3>Today's appointment at {timeOfDay(startsAt)}</h3>
    <table>
      <tbody>
        <tr>
          <td className="header">Customer</td>
          <td>
            {customer.firstName} {customer.lastName}
          </td>
        </tr>
        <tr>
          <td className="header">Phone number</td>
          <td>{customer.phoneNumber}</td>
        </tr>
        <tr>
          <td className="header">Stylist</td>
          <td>{stylist}</td>
        </tr>
        <tr>
          <td className="header">Service</td>
          <td>{service}</td>
        </tr>
        <tr>
          <td className="header">Notes</td>
          <td>{notes}</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export const AppointmentsDayView = ({ appointments }) => {
  const [selectedAppointment, setSelectedAppointment] = React.useState(0);

  return (
    <div id="appointmentsDayView">
      <ol>
        {appointments.map((appointment, index) => (
          <li key={index}>
            <button type="button" onClick={() => setSelectedAppointment(index)}>
              {timeOfDay(appointment.startsAt)}
            </button>
          </li>
        ))}
      </ol>
      {appointments.length > 0 ? (
        <Appointment {...appointments[selectedAppointment]} />
      ) : (
        'No appointment today.'
      )}
    </div>
  );
};

const timeOfDay = (date) => {
  const [h, m] = new Date(date).toTimeString().split(':');
  return `${h}:${m}`;
};
