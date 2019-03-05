import { Customers, generateFakeCustomers } from '../src/customers';

describe('customers', () => {
  const customer = {
    firstName: 'Ashley',
    lastName: 'Jones',
    phoneNumber: '123456789'
  };

  describe('add', () => {
    it('returns the same fields as provided', () => {
      const result = new Customers().add(customer);
      expect(result.firstName).toBe('Ashley');
      expect(result.lastName).toBe('Jones');
      expect(result.phoneNumber).toBe('123456789');
    });

    it('generates different ids to each customer', () => {
      const customers = new Customers();
      const first = customers.add(customer);
      const second = customers.add(customer);
      expect(first.id).not.toBe(second.id);
    });
  });

  describe('all', () => {
    const one = { firstName: 'Ashley' };
    const two = { firstName: 'Sam' };

    it('returns all added customers', () => {
      const customers = new Customers();
      const oneId = customers.add(one).id;
      const twoId = customers.add(two).id;
      const result = customers.all();

      expect(result[oneId].firstName).toEqual(one.firstName);
      expect(result[twoId].firstName).toEqual(two.firstName);
    });
  });

  describe('errors', () => {

    const customer = {
      firstName: 'test',
      lastName: 'test',
      phoneNumber: '23456'
    };
    let customers;

    beforeEach(() => {
      customers = new Customers();
      customers.add({ phoneNumber: '12345' });
    });

    it('returns no errors for an object with all correct params', () => {
      expect(customers.errors(customer)).toEqual({});
    });

    it('returns error if the phone number is already used', () => {
      const newCustomer = { ...customer, phoneNumber: '12345' };
      expect(customers.errors(newCustomer)).toEqual({
        phoneNumber: 'Phone number already exists in the system'
      });
    });

    it('returns error if the first name is blank', () => {
      const newCustomer = { ...customer, firstName: ' ' };
      expect(customers.errors(newCustomer)).toEqual({
        firstName: 'First name is required'
      });
    });

    it('returns error if the last name is blank', () => {
      const newCustomer = { ...customer, lastName: ' ' };
      expect(customers.errors(newCustomer)).toEqual({
        lastName: 'Last name is required'
      });
    });

    it('returns error if the phone number is blank', () => {
      const newCustomer = { ...customer, phoneNumber: ' ' };
      expect(customers.errors(newCustomer)).toEqual({
        phoneNumber: 'Phone number is required'
      });
    });

    it('returns one error for each required field when missing', () => {
      expect(Object.keys(customers.errors({}))).toEqual(['firstName', 'lastName', 'phoneNumber']);
    });
  });

  describe('isValid', () => {
    const customer = {
      firstName: 'test',
      lastName: 'test',
      phoneNumber: '23456'
    };

    it('returns true for a valid object', () => {
      expect(new Customers().isValid(customer)).toBeTruthy();
    });

    it('returns false for an invalid object', () => {
      const newCustomer = { ...customer, firstName: '' };
      expect(new Customers().isValid(newCustomer)).toBeFalsy();
    });
  });

  describe('generateFakeCustomers', () => {
    let customers;

    it('generates 1500 customers', () => {
      const customers = generateFakeCustomers();
      expect(customers.length).toEqual(1500);
    });

    it('generates some data', () => {
      const customers = generateFakeCustomers();
      expect(customers[0].firstName).toMatch(/^\w+$/);
      expect(customers[0].lastName).toMatch(/^[\w']+$/);
      expect(customers[0].phoneNumber).toMatch(/^[0-9()\- ]+$/);
    });
  });

  describe('search customers', () => {
    it('returns only customers matching first name search terms', () => {
      const customers = new Customers([
        { firstName: 'A', lastName: '-', phoneNumber: '-' },
        { firstName: 'B', lastName: '-', phoneNumber: '-' }]);
      const result = customers.search({
        searchTerms: ['A']
      });
      expect(result.length).toEqual(1);
      expect(result[0].firstName).toEqual('A');
    });

    it('returns only customers matching last name search terms', () => {
      const customers = new Customers([
        { firstName: '-', lastName: 'A', phoneNumber: '-' },
        { firstName: '-', lastName: 'B', phoneNumber: '-' }]);
      const result = customers.search({
        searchTerms: ['A']
      });
      expect(result.length).toEqual(1);
      expect(result[0].lastName).toEqual('A');
    });

    it('returns only customers matching phone number search terms', () => {
      const customers = new Customers([
        { phoneNumber: '123' },
        { phoneNumber: '234' }]);
      const result = customers.search({
        searchTerms: ['1']
      });
      expect(result.length).toEqual(1);
      expect(result[0].phoneNumber).toEqual('123');
    });

    it('only matches on start of text string', () => {
      const customers = new Customers([
        { phoneNumber: '123' },
        { phoneNumber: '234' }]);
      const result = customers.search({
        searchTerms: ['3']
      });
      expect(result.length).toEqual(0);
    });

    it('does not list search result twice if it matches more than one field', () => {
      const customers = new Customers([
        { firstName: 'A', lastName: 'A' }]);
      const result = customers.search({
        searchTerms: ['A'],
        orderBy: 'firstName'
      });
      expect(result.length).toEqual(1);
    });

    it('sorts according to the order by field', () => {
      const customers = new Customers([
        { firstName: 'A', phoneNumber: '234' },
        { firstName: 'A', phoneNumber: '123' }]);
      const result = customers.search({
        searchTerms: ['A'],
        orderBy: 'phoneNumber'
      });
      expect(result[0].phoneNumber).toEqual('123');
      expect(result[1].phoneNumber).toEqual('234');
    });

    it('sorts descending', () => {
      const customers = new Customers([
        { firstName: 'A', phoneNumber: '234' },
        { firstName: 'A', phoneNumber: '123' }]);
      const result = customers.search({
        searchTerms: ['A'],
        orderBy: 'phoneNumber',
        orderDirection: 'desc'
      });
      expect(result[0].phoneNumber).toEqual('234');
      expect(result[1].phoneNumber).toEqual('123');
    });

    it('limits records by limit', () => {
      const customers = new Customers([
        { firstName: 'A', phoneNumber: '1' },
        { firstName: 'A', phoneNumber: '2' },
        { firstName: 'A', phoneNumber: '3' },
        { firstName: 'A', phoneNumber: '4' },
        { firstName: 'A', phoneNumber: '5' },
        { firstName: 'A', phoneNumber: '6' }]);
      const result = customers.search({
        limit: 3
      });
      expect(result.length).toEqual(3);
    });

    it('pages to the first record after the one specified', () => {
      const customers = new Customers([
        { firstName: 'A', phoneNumber: '1' },
        { firstName: 'A', phoneNumber: '2' },
        { firstName: 'A', phoneNumber: '3' },
        { firstName: 'A', phoneNumber: '4' },
        { firstName: 'A', phoneNumber: '5' },
        { firstName: 'A', phoneNumber: '6' }]);
      const afterId = customers.all()[2].id;
      const result = customers.search({
        limit: 3,
        orderBy: 'phoneNumber',
        after: afterId
      });
      expect(result[0].phoneNumber).toEqual('4');
    });

    it('returns everything if no search terms defined', () => {
      const customers = new Customers([
        { firstName: 'A' },
        { firstName: 'B' }
      ]);
      const result = customers.search({});
      expect(result.length).toEqual(2);
    });

    it('by default limits to ten records', () => {
      const customers = new Customers();
      for(let i = 0; i < 20; ++i) {
        customers.add({ firstName: 'A', phoneNumber: i });
      }
      const result = customers.search({
      });
      expect(result.length).toEqual(10);
    });

    it('by default order by firstName', () => {
      const customers = new Customers([
        { firstName: 'Z', lastName: 'A'},
        { firstName: 'Y', lastName: 'B'}
      ]);
      const result = customers.search({});
      expect(result[0].firstName).toEqual('Y');
      expect(result[1].firstName).toEqual('Z');
    });
  });
});
