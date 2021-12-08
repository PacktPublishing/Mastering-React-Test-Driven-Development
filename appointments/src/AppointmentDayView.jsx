import React, {useState} from 'react'
import { Appointment } from './Appointment'


// Converts a Unix timestamp into a time of day

const appointmentTimeOfDay = startAt =>{
    const [h,m] = new Date(startAt).toTimeString().split(':')
    return `${h}:${m}`
}
export const AppointmentDayView = ({appointments}) =>{
   const [selectedAppointment, setSelectedAppointment] = useState(0)

    return (
    <div>
        <ol id="appointmentDayView">
            {appointments.map((app,index)=> 
            <li key={app.startAt}>
                <button type="button" onClick={()=>setSelectedAppointment(index)}>{appointmentTimeOfDay(app.startAt)}</button>
            </li>)}
        
        </ol>)
     {appointments.length !==0?
        <Appointment customer={appointments[selectedAppointment].customer}/>: 
        <p>There are no appointments scheduled for today</p>}
    </div>
    )

    }   

  

   

