import React, { useState } from 'react';

const appointmentTimeOfDay = startsAt => {
    const [h, m] = new Date(startsAt).toTimeString().split(':');
    return `${h}:${m}`;
}

export const Appointment = ({ customer }) => <div>{customer.firstName}</div>;

const AppointmentsDayViewComponent = ({ appointments, selected, handleClickAppointment }) => (
    <div id="appointmentsDayView">
        <ol>
            {appointments.map((appointment, i) => (
                <li key={appointment.startsAt}>
                    <button type="button" onClick={() => handleClickAppointment(i)}>
                        {appointmentTimeOfDay(appointment.startsAt)}
                    </button>
                </li>
            ))}
        </ol>
        {appointments.length === 0 ? (
            <p>There are no appointments scheduled for today.</p>
        ) : (
            <Appointment {...appointments[selected]} />
        )}

    </div>
);

export const AppointmentsDayView = (props) => {
    const [selectedAppointment, setSelectedAppointment] = useState(0);

    const handleClickAppointment = (index) => {
        setSelectedAppointment(index);
    }

    return <AppointmentsDayViewComponent
                {...props}
                selected={selectedAppointment}
                handleClickAppointment={handleClickAppointment}
           />
}