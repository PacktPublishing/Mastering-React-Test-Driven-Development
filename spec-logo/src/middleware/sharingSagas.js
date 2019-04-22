import {
  call,
  put,
  takeLatest,
  take,
  all,
  select
} from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga';
import { toInstructions } from '../language/export';

const receiveMessage = socket =>
  new Promise(resolve => {
    socket.onmessage = evt => {
      resolve(evt.data);
    };
  });

const openWebSocket = () => {
  const { host } = window.location;
  const socket = new WebSocket(`ws://${host}/share`);
  return new Promise(resolve => {
    socket.onopen = () => {
      resolve(socket);
    };
  });
};

const webSocketListener = socket =>
  eventChannel(emitter => {
    socket.onmessage = emitter;
    socket.onclose = () => emitter(END);
    return () => {
      socket.onmessage = undefined;
      socket.onclose = undefined;
    };
  });

const buildUrl = id => {
  const { protocol, host, pathname } = window.location;
  return `${protocol}//${host}${pathname}?watching=${id}`;
};

let presenterSocket;

function* startSharing(action) {
  presenterSocket = yield openWebSocket();
  presenterSocket.send(JSON.stringify({ type: 'START_SHARING' }));
  const message = yield receiveMessage(presenterSocket);
  const presenterSessionId = JSON.parse(message).id;
  yield put({
    type: 'STARTED_SHARING',
    url: buildUrl(presenterSessionId)
  });
  if (action.reset) {
    yield put({ type: 'RESET' });
  } else {
    const state = yield select(state => state.script);
    const instructions = toInstructions(state);
    yield all(
      instructions.map(instruction =>
        call(shareNewAction, {
          innerAction: {
            type: 'SUBMIT_EDIT_LINE',
            text: instruction
          }
        })
      )
    );
  }
}

function* stopSharing() {
  presenterSocket.close();
  yield put({ type: 'STOPPED_SHARING' });
}

const shareNewAction = ({ innerAction }) => {
  if (
    presenterSocket &&
    presenterSocket.readyState === WebSocket.OPEN
  ) {
    presenterSocket.send(
      JSON.stringify({ type: 'NEW_ACTION', innerAction })
    );
  }
};

function* watchUntilStopRequest(chan) {
  try {
    while (true) {
      let evt = yield take(chan);
      yield put(JSON.parse(evt.data));
    }
  } finally {
    yield put({ type: 'STOPPED_WATCHING' });
  }
}

function* startWatching() {
  const sessionId = new URLSearchParams(
    window.location.search.substring(1)
  ).get('watching');

  if (sessionId) {
    const watcherSocket = yield openWebSocket();
    yield put({ type: 'RESET' });
    watcherSocket.send(
      JSON.stringify({ type: 'START_WATCHING', id: sessionId })
    );
    yield put({ type: 'STARTED_WATCHING' });
    const chan = yield call(webSocketListener, watcherSocket);
    yield call(watchUntilStopRequest, chan);
  }
}

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
