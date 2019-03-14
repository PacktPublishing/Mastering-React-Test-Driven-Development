import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStoreWithLocalStorage } from './store';
import { App } from './App';

ReactDOM.render(
  <Provider store={configureStoreWithLocalStorage()}>
    <App />
  </Provider>,
  document.getElementById('root')
);
