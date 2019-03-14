import {
  createStore,
  compose,
  combineReducers,
  applyMiddleware
} from 'redux';
import { scriptReducer } from './reducers/script';
import { withUndoRedo } from './reducers/withUndoRedo';
import { save, load } from './middleware/localStorage';

export const configureStore = (
  storeEnhancers = [],
  initialState = {}
) => {
  return createStore(
    combineReducers({
      script: withUndoRedo(scriptReducer)
    }),
    initialState,
    compose(...[applyMiddleware(save), ...storeEnhancers])
  );
};

export const configureStoreWithLocalStorage = () =>
  configureStore(undefined, load());
