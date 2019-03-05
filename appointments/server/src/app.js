import express from 'express';
import expressGraphql from 'express-graphql';
import { buildSchema } from 'graphql';
import { GraphQLError } from 'graphql';
import { Appointments } from './appointments';
import { Customers } from './customers';
import morgan from 'morgan';
import schemaText from '../../src/schema.graphql';

const schema = buildSchema(schemaText);

export function buildApp(customerData, appointmentData, timeSlots) {
  const app = express();

  const customers = new Customers(customerData);
  const appointments = new Appointments(appointmentData, timeSlots);

  app.use(express.static('dist'));
  app.use(express.json());
  app.use(morgan('dev'));

  app.get('/availableTimeSlots', (req, res, next) => {
    res.json(appointments.getTimeSlots());
  });

  app.get('/appointments/:from-:to', (req, res, next) => {
    res.json(appointments.getAppointments(
      parseInt(req.params.from),
      parseInt(req.params.to),
      customers.all()));
  });

  app.post('/appointments', (req, res, next) => {
    const appointment = req.body;
    if (appointments.isValid(appointment)) {
      appointments.add(appointment);
      res.sendStatus(201);
    } else {
      const errors = appointments.errors(appointment);
      res.status(422).json({ errors });
    }
  });

  app.post('/customers', (req, res, next) => {
    const customer = req.body;
    if (customers.isValid(customer)) {
      const customerWithId = customers.add(customer);
      res.status(201).json(customerWithId);
    } else {
      const errors = customers.errors(customer);
      res.status(422).json({ errors });
    }
  });

  app.get('/customers', (req, res, next) => {
    const results = customers.search(buildSearchParams(req.query));
    res.json(results);
  });

  const customerValidation = context => ({
    Argument(arg) {
      if (arg.name.value === 'customer') {
        validateObject(context, arg.value.fields, customers, 'addCustomer');
      }
    }
  });

  const validateObject = (context, fields, repository, path) => {
    const object = fields.reduce((acc, field) => {
      acc[field.name.value] = field.value.value;
      return acc;
    });
    if (!repository.isValid(object)) {
      const errors = repository.errors(object);
      Object.keys(errors).forEach(fieldName => {
        context.reportError(new GraphQLError(errors[fieldName], undefined, undefined, undefined, [path, fieldName]));
      });
    }
  };

  const appointmentValidation = context => ({
    Argument(arg) {
      if (arg.name.value === 'appointment') {
        validateObject(context, arg.value.fields, appointments, 'addAppointment');
      }
    }
  });

  app.use('/graphql', expressGraphql({
    schema,
    rootValue: {
      customer: ({ id }) => {
        const customer = customers.all()[id];
        return { ...customer, appointments: appointments.forCustomer(customer.id) };
      },
      customers: query =>
        customers.search(buildSearchParams(query)).map(customer => ({...customer,
          appointments: () => appointments.forCustomer(customer.id)
        })),
      availableTimeSlots: () => appointments.getTimeSlots(),
      appointments: ({ from, to }) => {
        return appointments.getAppointments(
          parseInt(from),
          parseInt(to),
          customers.all());
      },
      addAppointment: ({ appointment }) => {
        appointment = Object.assign(appointment, { startsAt: parseInt(appointment.startsAt) });
        return appointments.add(appointment);
      },
      addCustomer: ({ customer }) => customers.add(customer),
    },
    validationRules: [customerValidation, appointmentValidation],
    graphiql: true
  }));

  app.get('*', function (req, res) {
    res.sendFile('dist/index.html', { root: process.cwd() });
  });

  return app;
}

function buildSearchParams({ searchTerm, after, limit, orderBy, orderDirection }) {
  const searchParams = {};
  if (searchTerm)
    searchParams.searchTerms = buildSearchTerms(searchTerm);
  if (after) searchParams.after = parseInt(after);
  if (limit) searchParams.limit = parseInt(limit);
  if (orderBy) searchParams.orderBy = orderBy;
  if (orderDirection) searchParams.orderDirection = orderDirection;
  return searchParams;
}

function buildSearchTerms(searchTerm) {
  if(!searchTerm) return undefined;
  if(Array.isArray(searchTerm)) {
    return searchTerm;
  }
  return [searchTerm];
}
