import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStoreWithLocalStorage } from './store';
import { App } from './App';

const store = configureStoreWithLocalStorage();
store.dispatch({ type: 'TRY_START_WATCHING' });

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
