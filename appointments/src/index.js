import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppointmentDayView } from './AppointmentDayView';
import { sampleAppointments } from './sampleData';


ReactDOM.render(
    <AppointmentDayView appointments={sampleAppointments}/>,
  document.getElementById('root')
);