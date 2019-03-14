import {
  createStore,
  compose,
  combineReducers,
  applyMiddleware
} from 'redux';
import { scriptReducer } from './reducers/script';
import { withUndoRedo } from './reducers/withUndoRedo';

export const configureStore = (
  storeEnhancers = [],
  initialState = {}
) => {
  return createStore(
    combineReducers({
      script: withUndoRedo(scriptReducer)
    }),
    initialState,
    compose(...storeEnhancers)
  );
};
