  import { Appointments, buildTimeSlots, generateFakeAppointments } from '../src/appointments';

describe('buildTimeSlots', () => {
  it('returns (365 + 30) * 20 timeslots', () => {
    expect(buildTimeSlots().length).toEqual((365+30)*20);
  });

  it('daily time slots are half an hour apart', () => {
    const result = buildTimeSlots();
    const expected = result[0].startsAt + 30 * 60 * 1000;
    expect(result[1].startsAt).toEqual(expected);
  });

  it('moves forward one day after 10 hours', () => {
    const result = buildTimeSlots();
    const expected = result[0].startsAt + 24 * 60 * 60 * 1000;
    expect(result[20].startsAt).toEqual(expected);
  });

  it('sets a random stylist', () => {
    const stylists = [ 'Ashley', 'Jo', 'Pat', 'Sam' ];
    expect(buildTimeSlots()[0].stylists).toEqual(stylists);
  });
});

describe('generateFakeAppointments', () => {
  const customers = Array(10).fill(1).map(() => ({ id: 123 }));
  const timeSlots = Array(10).fill(1).map(() => ({ startsAt: 234, stylists: ['Ashley', 'Jo'] }));
  it('generates more than half of all the timeslots available', () => {
    const result = generateFakeAppointments(customers, timeSlots);
    expect(result.length).toBeLessThan(timeSlots.length);
    expect(result.length).toBeGreaterThan(0);
  });

  it('sets a customer id', () => {
    const result = generateFakeAppointments(customers, timeSlots);
    expect(result[0].customer).toEqual(123);
  });

  it('sets a startsAt time', () => {
    const result = generateFakeAppointments(customers, timeSlots);
    expect(result[0].startsAt).toEqual(234);
  });

  it('sets the stylist', () => {
    const result = generateFakeAppointments(customers, timeSlots);
    expect(['Ashley', 'Jo'].includes(result[0].stylist)).toBeTruthy();
  });

  it('picks a random service', () => {
    const services = [ 'Cut', 'Blow-dry', 'Extensions', 'Cut & color', 'Beard trim', 'Cut & beard trim', 'Extensions' ];
    const result = generateFakeAppointments(customers, timeSlots);
    expect(services.includes(result[0].service)).toBeTruthy();
  });
});

describe('appointments', () => {
  const customers = Array(10).fill(1).map(() => ({ id: 123 }));
  const timeSlots = [{startsAt: 123}, {startsAt: 234}];

  it('initially loads all the initialAppointments', () => {
    const appointments = new Appointments([{ startsAt: 123 }], []);
    const result = appointments.getAppointments(0, 124, []);
    expect(result.length).toEqual(1);
  });

  describe('add', () => {
    it('removes the time from available time slots', () => {
      const appointments = new Appointments([], timeSlots);
      const result = appointments.getTimeSlots();
      appointments.add({ startsAt: result[0].startsAt });
      expect(appointments.getTimeSlots().length).toEqual(1);
    });
  });

  describe('deleteAll', () => {
    const customers = [];

    it('deletes all appointments', () => {
      const appointments = new Appointments();
      appointments.add( { startsAt: 1 } );
      appointments.deleteAll();
      const result = appointments.getAppointments(0, 2, customers);
      expect(result.length).toBe(0);
    })
  });

  describe('getAppointments', () => {
    const customers = { 'customer': { id: 123 } };

    it('filters out anything before the from time', () => {
      const appointments = new Appointments();
      appointments.add({ startsAt : 1, customer: 'customer' });
      appointments.add({ startsAt : 2, customer: 'customer' });
      const result = appointments.getAppointments(2, 3, customers);
      expect(result.length).toBe(1);
      expect(result[0].startsAt).toBe(2);
    });

    it('filters out anything after the to time', () => {
      const appointments = new Appointments();
      appointments.add({ startsAt : 1, customer: 'customer' });
      appointments.add({ startsAt : 2, customer: 'customer' });
      const result = appointments.getAppointments(0, 1, customers);
      expect(result.length).toBe(1);
      expect(result[0].startsAt).toBe(1);
    });

    it('includes the customer record', () => {
      const appointments = new Appointments();
      appointments.add({ startsAt : 1, customer: 'customer' });
      const result = appointments.getAppointments(0, 3, customers);
      expect(result[0].customer).toEqual(customers['customer']);
    });

    it('sorts appointments by startsAt', () => {
      const appointments = new Appointments();
      appointments.add({ startsAt : 2, customer: 'customer' });
      appointments.add({ startsAt : 1, customer: 'customer' });
      const result = appointments.getAppointments(0, 2, customers);
      expect(result[0].startsAt).toEqual(1);
      expect(result[1].startsAt).toEqual(2);
    });
  });

  describe('errors', () => {
    let appointments;

    beforeEach(() => {
      appointments = new Appointments();
      appointments.add({ startsAt: 1, customer: 'customer' });
    });

    it('returns no errors for a unique object', () => {
      const appointment = { startsAt: 2, customer: 'customer' };
      expect(appointments.errors(appointment)).toEqual({});
    });

    it('returns error if the timeslot is already used', () => {
      const appointment = { startsAt: 1, customer: 'customer' };
      expect(appointments.errors(appointment)).toEqual({
        startsAt: 'Appointment start time has already been allocated'
      });
    });
  });

  describe('isValid', () => {
    let appointments;

    beforeEach(() => {
      appointments = new Appointments();
      appointments.add({ startsAt: 1, customer: 'customer' });
    });

    it('returns true for a unique object', () => {
      const appointment = { startsAt: 2, customer: 'customer' };
      expect(appointments.isValid(appointment)).toBeTruthy();
    });

    it('returns error if the timeslot is already used', () => {
      const appointment = { startsAt: 1, customer: 'customer' };
      expect(appointments.isValid(appointment)).toBeFalsy();
    });
  });
});
