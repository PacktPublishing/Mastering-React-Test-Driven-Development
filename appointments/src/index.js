import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import { appHistory } from './history';
import { App } from './App';

ReactDOM.render(
  <Router history={appHistory}>
    <Route path="/" component={App} />
  </Router>,
  document.getElementById('root')
);
