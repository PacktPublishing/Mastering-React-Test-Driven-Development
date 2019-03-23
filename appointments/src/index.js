import React from 'react';
import ReactDOM from 'react-dom';
import { AppointmentForm } from './AppointmentForm';
import { sampleAvailableTimeSlots } from './sampleData';

ReactDOM.render(
  <AppointmentForm
    availableTimeSlots={sampleAvailableTimeSlots}
  />,
  document.getElementById('root')
);
