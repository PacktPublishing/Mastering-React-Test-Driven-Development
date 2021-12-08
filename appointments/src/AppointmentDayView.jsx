import React, {useState} from 'react'
import { Appointment } from './Appointment'


// Converts a Unix timestamp into a time of day

const appointmentTimeOfDay = startsAt =>{
    const [h,m] = new Date(startsAt).toTimeString().split(':')
    return `${h}:${m}`
}
export const AppointmentDayView = ({appointments}) =>{
   const [selectedAppointment, setSelectedAppointment] = useState(0)

    return (
    <div>
        <ol id="appointmentDayView">
            {appointments.map((app,index)=> 
            <li key={app.startsAt}>
                <button type="button" onClick={()=>setSelectedAppointment(index)}>{appointmentTimeOfDay(app.startsAt)}</button>
            </li>)}
        
        </ol>)
     {appointments.length !==0?
        <Appointment customer={appointments[selectedAppointment].customer}/>: 
        <p>There are no appointments scheduled for today</p>}
    </div>
    )

    }   

  

   

