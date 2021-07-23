import React from 'react';
import ReactDOM from 'react-dom';
import { AppointmentsDayView } from './AppointmentsDayView';
import { sampleAppointments } from './sampleData';
import { CustomerForm } from "./CustomerForm"
import { AppointmentForm } from "./AppointmentForm"

ReactDOM.render(
  // <AppointmentsDayView appointments={sampleAppointments} />,
  // <CustomerForm {...sampleAppointments[0].customer} onSubmit={() => {}}/>,
  <AppointmentForm onSubmit={() => {}}/>,
  document.getElementById('root')
);
