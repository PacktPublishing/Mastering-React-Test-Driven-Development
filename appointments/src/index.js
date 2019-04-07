import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';
import { appHistory } from './history';
import { configureStore } from './store';
import { ConnectedApp } from './App';

ReactDOM.render(
  <Provider store={configureStore()}>
    <Router history={appHistory}>
      <Route path="/" component={ConnectedApp} />
    </Router>
  </Provider>,
  document.getElementById('root')
);
