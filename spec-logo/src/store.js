import {
  createStore,
  compose,
  combineReducers,
  applyMiddleware
} from 'redux';
import { scriptReducer } from './reducers/script';

export const configureStore = (
  storeEnhancers = [],
  initialState = {}
) => {
  return createStore(
    combineReducers({
      script: scriptReducer
    }),
    initialState,
    compose(...storeEnhancers)
  );
};
