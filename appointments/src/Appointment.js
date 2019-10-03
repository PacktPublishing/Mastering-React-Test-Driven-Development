import React from 'react';

export const Appointment = ({customer}) => (
    <div>{customer.firstName}</div>
);

const appointmentTimeOfDay = startsAt => {
    const [h, m] = new Date(startsAt).toTimeString().split(':');
    return `${h}:${m}`;
};

export const AppointmentsDayView = ({appointments}) => (
    <div id="appointmentsDayView">
        <ol>
          {appointments.map((appointment) => (
            <li key={appointment.startsAt}>
              {appointmentTimeOfDay(appointment.startsAt)}
            </li>
          ))}
        </ol>
    </div>
);
