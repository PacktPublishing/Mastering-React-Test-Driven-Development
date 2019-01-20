import { call, put, takeLatest, take } from 'redux-saga/effects';

function* startSharing() {}

function* stopSharing() {}

function* shareNewAction({ innerAction }) {}

function* startWatching() {}

export function* sharingSaga() {
  yield takeLatest('TRY_START_WATCHING', startWatching);
  yield takeLatest('START_SHARING', startSharing);
  yield takeLatest('STOP_SHARING', stopSharing);
  yield takeLatest('SHARE_NEW_ACTION', shareNewAction);
}

export const duplicateForSharing = store => next => action => {
  if (action.type === 'SUBMIT_EDIT_LINE') {
    store.dispatch({
      type: 'SHARE_NEW_ACTION',
      innerAction: action
    });
  }
  return next(action);
};
