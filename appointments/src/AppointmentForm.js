import * as React from 'react';

const dailySlots = (salonOpensAt, salonClosesAt) => {
  const nbSlots = (salonClosesAt - salonOpensAt) * 2;
  const startTime = new Date().setHours(salonOpensAt, 0, 0, 0);
  return Array.from(Array(nbSlots).keys()).map(
    (i) => startTime + i * 30 * 60 * 1000
  );
};

const toTimeValue = (slot) => new Date(slot).toTimeString().substring(0, 5);

const TableSlotTable = ({ salonOpensAt, salonClosesAt }) => {
  const slots = dailySlots(salonOpensAt, salonClosesAt);

  return (
    <table id="time-slots">
      <tbody>
        {slots.map((slot) => (
          <tr key={slot}>
            <th>{toTimeValue(slot)}</th>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const AppointmentForm = ({
  selectableServices,
  service,
  onSubmit,
  salonOpensAt,
  salonClosesAt,
}) => {
  const [appointment, setAppointment] = React.useState({ service });

  const handleChange = ({ target }) =>
    setAppointment({ ...appointment, service: target.value });

  return (
    <form id="appointment" onSubmit={() => onSubmit(appointment)}>
      <label htmlFor="service">Salon service</label>
      <select
        name="service"
        id="service"
        value={service}
        onChange={handleChange}>
        <option value="" />
        {selectableServices.map((s, index) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      <TableSlotTable {...{ salonOpensAt, salonClosesAt }} />
    </form>
  );
};

AppointmentForm.defaultProps = {
  selectableServices: ['Cut', 'Blow-dry', 'Cut & Color', 'Beard trim'],
  salonOpensAt: 9,
  salonClosesAt: 19,
};
