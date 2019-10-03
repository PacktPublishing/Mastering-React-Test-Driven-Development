const today = new Date();
const at = hours => today.setHours(hours, 0);
export const sampleAppointments = [
    { startsAt: at(10), customer: { firstName: 'Dan' } },
    { startsAt: at(11), customer: { firstName: 'Alan' } },
    { startsAt: at(12), customer: { firstName: 'Roy' } },
    { startsAt: at(13), customer: { firstName: 'Rebecca' } },
    { startsAt: at(14), customer: { firstName: 'Alexis' } },
    { startsAt: at(15), customer: { firstName: 'Simon' } },
    { startsAt: at(16), customer: { firstName: 'Cariad' } },
    { startsAt: at(17), customer: { firstName: 'James' } },
    { startsAt: at(18), customer: { firstName: 'Matt' } }
];
