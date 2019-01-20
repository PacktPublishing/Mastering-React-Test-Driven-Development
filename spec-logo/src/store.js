import {
  createStore,
  compose,
  combineReducers,
  applyMiddleware
} from 'redux';
import { scriptReducer } from './reducers/script';
import { withUndoRedo } from './reducers/withUndoRedo';
import { save, load } from './middleware/localStorage';
import { environmentReducer } from './reducers/environment';
import {
  sharingSaga,
  duplicateForSharing
} from './middleware/sharingSagas';
import createSagaMiddleware from 'redux-saga';

export const configureStore = (
  storeEnhancers = [],
  initialState = {}
) => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    combineReducers({
      script: withUndoRedo(scriptReducer),
      environment: environmentReducer
    }),
    initialState,
    compose(
      ...[
        applyMiddleware(save, duplicateForSharing, sagaMiddleware),
        ...storeEnhancers
      ]
    )
  );
  sagaMiddleware.run(sharingSaga);
  return store;
};

export const configureStoreWithLocalStorage = () =>
  configureStore(undefined, load());
