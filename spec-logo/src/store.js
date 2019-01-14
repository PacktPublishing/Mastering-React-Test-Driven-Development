import {
  createStore,
  compose,
  combineReducers,
  applyMiddleware
} from 'redux';
import { logoReducer } from './reducers/logo';

export const configureStore = (
  storeEnhancers = [],
  initialState = {}
) => {
  return createStore(
    combineReducers({
      script: logoReducer
    }),
    initialState,
    compose(...storeEnhancers)
  );
};
