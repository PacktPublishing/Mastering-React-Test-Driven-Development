import React from 'react';
import ReactDOM from 'react-dom';

export const createContainer = () => {
  const container = document.createElement('div');
  return {
    container,
    render: (component) => ReactDOM.render(component, container),
  };
};
