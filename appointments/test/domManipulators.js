import ReactDOM from 'react-dom';
import ReactTestUtils, { act } from 'react-dom/test-utils';

export const createContainer = () => {
  const container = document.createElement('div');

  const form = id => container.querySelector(`form[id="${id}"]`);
  const field = (formId, name) => form(formId).elements[name];
  const labelFor = formElement =>
    container.querySelector(`label[for="${formElement}"]`);

  const element = selector => container.querySelector(selector);
  const elements = selector =>
    Array.from(container.querySelectorAll(selector));

  const simulateEvent = eventName => (element, eventData) =>
    ReactTestUtils.Simulate[eventName](element, eventData);

  const simulateEventAndWait = eventName => async (
    element,
    eventData
  ) =>
    await act(async () =>
      ReactTestUtils.Simulate[eventName](element, eventData)
    );

  const children = element => Array.from(element.childNodes);

  return {
    render: component => ReactDOM.render(component, container),
    container,
    form,
    field,
    labelFor,
    element,
    elements,
    children,
    click: simulateEvent('click'),
    change: simulateEvent('change'),
    submit: simulateEventAndWait('submit')
  };
};

export const withEvent = (name, value) => ({
  target: { name, value }
});
