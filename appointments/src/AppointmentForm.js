import * as React from 'react';

export const AppointmentForm = ({ selectableServices, service, onSubmit }) => {
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
    </form>
  );
};

AppointmentForm.defaultProps = {
  selectableServices: ['Cut', 'Blow-dry', 'Cut & Color', 'Beard trim'],
};
