import ReactDom from 'react-dom';
import ReactTestUtils, { act } from 'react-dom/test-utils';

export const createContainer = () =>{
    const simulateEventAndWait = eventName => async (
        element,
        eventData
      ) =>
        await act(async () =>
          ReactTestUtils.Simulate[eventName](element, eventData)
        );


    const container = document.createElement('div')
    const render = component => ReactDom.render(component, container)
    const form = id => container.querySelector(`form[id="${id}"]`);
    const field = (formId, name) => form(formId).elements[name];
    const labelFor = formElement =>
    container.querySelector(`label[for="${formElement}"]`);
    const simulateEvent = eventName => (element, eventData) =>
    ReactTestUtils.Simulate[eventName](element, eventData);
    return {
        render,
        container,
        form,
        field,
        labelFor,
        submit: simulateEventAndWait('submit'),
        change: simulateEvent('change')
    }
}

export const withEvent = (name, value) => ({
    target: { name, value }
  });