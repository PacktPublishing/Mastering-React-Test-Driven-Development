
import React from 'react'
import { CustomerForm } from '../src/CustomerForm'
import { createContainer, withEvent } from './domManipulators'
import 'whatwg-fetch'
import ReactTestUtils, { act } from 'react-dom/test-utils';

const validCustomer = {
    firstName: 'first',
    lastName: 'last',
    phoneNumber: '123456789'
  };

const expectToBeInputFieldOfTypeText = formElement =>{
    expect(formElement).not.toBeNull()
    expect(formElement.tagName).toEqual('INPUT')
    expect(formElement.type).toEqual('text')
}
const spy = () =>{
    let receivedArguments;
    let retureValue
    return{
        fn: (...args) =>{receivedArguments= args; return retureValue },
        receivedArguments: () =>receivedArguments,
        receivedArgument: n=>receivedArguments[n],
        stubReturnValue: value => retureValue=value
    }
}

describe('CustomerForm',()=>{
    let render, container,form, field, labelFor,submit, change
    beforeEach(()=>{
       ( {render, container,form, field, labelFor, submit, change} =  createContainer())    
      
    })
   

    const itRendersAsATextBox = fieldName =>
    it('renders as a text box', () => {
      render(<CustomerForm {...validCustomer} />);
      expectToBeInputFieldOfTypeText(field('customer', fieldName));
    });

    const itIncludesTheExistingValue = fieldName =>
    it('includes the existing value', () => {
      render(
        <CustomerForm
          {...validCustomer}
          {...{ [fieldName]: 'jessica' }}
        />
      );
      expect(field('customer', fieldName).value).toEqual('jessica');
    });

    const itRendersALabel = (fieldName, text) =>
    it('renders a label', () => {
      render(<CustomerForm {...validCustomer} />);
      expect(labelFor(fieldName)).not.toBeNull();
      expect(labelFor(fieldName).textContent).toEqual(text);
    });

    const itAssignsAnIdThatMatchesTheLabelId = fieldName =>
    it('assigns an id that matches the label id', () => {
      render(<CustomerForm {...validCustomer} />);
      expect(field('customer', fieldName).id).toEqual(fieldName);
    });

    const itSubmitsExistingValue = (fieldName, value) =>
    it('saves existing value when submitted', async () => {
      const fetchSpy = spy()
      render(
        <CustomerForm
          {...{ [fieldName]: 'jessica' }}
          fetch={fetchSpy.fn}
          onSubmit={()=>{}}
        />
      );

      await submit(form('customer'));
      
      const fetchOpts = fetchSpy.receivedArgument(1)
      expect(JSON.parse(fetchOpts.body)[fieldName]).toEqual('jessica')
    });

    const itSubmitsNewValue = (fieldName, value) =>
    it('saves new value when submitted', async () => {
      render(
        <CustomerForm
          {...validCustomer}
          {...{ [fieldName]: 'existingValue' }}
        />
      );
      change(
        field('customer', fieldName),
        withEvent(fieldName, value)
      );
      await submit(form('customer'));

    });

    const fetchResponseOK = (body) =>{
        Promise.resolve({
            ok: true,
            json: () =>Promise.resolve(body)
        })
    }


    it('renders a form', ()=>{
        render(<CustomerForm/>)
        expect( container.querySelector(`form[id="customer"]`)).not.toBeNull()
    })

    describe('first name field', () => {
        itRendersAsATextBox('firstName');
        itIncludesTheExistingValue('firstName');
        itIncludesTheExistingValue('firstName');
        itRendersALabel('firstName', 'First name');
        itAssignsAnIdThatMatchesTheLabelId('firstName');
        itSubmitsExistingValue('firstName', 'value');
        itSubmitsNewValue('firstName', 'value');
        
    
    });

    // it('renders the firstName field as a text box', ()=>{
    //     render(<CustomerForm/>)
    //     const firstName =  container.querySelector(`form[id="customer"]`).elements['firstName'];
    //     expectToBeInputFieldOfTypeText(firstName)
    // })

    // it('includes the existing value for the first name', ()=>{
    //     render(<CustomerForm firstName='Ashley'/>)
    //     const firstName =  container.querySelector(`form[id="customer"]`).elements['firstName'];
    //     expect(firstName.value).toEqual('Ashley')
    // })

    // it('renders a label for the first name field', ()=>{
    //     render(<CustomerForm />)
    //     expect(container.querySelector(`label[for="firstName"]`).textContent).toEqual('First name')
    // })

    // it('assigns id to the first name field', ()=>{
    //     render(<CustomerForm/>)
    //     const firstName =  container.querySelector(`form[id="customer"]`).elements['firstName'];
    //     expect(firstName.id).toEqual('firstName')

    // })

    // async keyword appears before our test function. This teels Jest thtat the test will return a promise.
    // and that the test runner should wait for that promise to resolve before reproting on the success or failure of the test
    // it('save new first name field when submitted', async ()=>{
    //     expect.hasAssertions() // hasAssertion tells Jest to wait for handler onSubmit to get called
    //     render(<CustomerForm firstName='Jessie' submit={({firstName})=>expect(firstName).toEqual('Jessie')}/>)
    //     await ReactTestUtils.Simulate.submit(form('customer')) // this is handled onSubmit event asychronously 
    // })
})