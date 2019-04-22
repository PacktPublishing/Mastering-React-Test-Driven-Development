import { storeSpy, expectRedux } from 'expect-redux';
import { act } from 'react-dom/test-utils';
import { configureStore } from '../../src/store';
import {
  duplicateForSharing,
  sharingSaga
} from '../../src/middleware/sharingSagas';

const WEB_SOCKET_OPEN = WebSocket.OPEN;
const WEB_SOCKET_CLOSED = WebSocket.CLOSED;

describe('duplicateForSharing', () => {
  let dispatch;
  let store;
  let next;

  beforeEach(() => {
    dispatch = jest.fn();
    store = { dispatch };
    next = jest.fn();
  });

  const callMiddleware = action =>
    duplicateForSharing(store)(next)(action);

  it('calls next with the action', () => {
    const action = { a: 123 };
    callMiddleware(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('returns the result of the next action', () => {
    next.mockReturnValue({ a: 123 });
    expect(callMiddleware({})).toEqual({ a: 123 });
  });

  it('dispatches a new SHARE_NEW_ACTION action if the action is of type SUBMIT_EDIT_LINE', () => {
    const action = { type: 'SUBMIT_EDIT_LINE', text: 'abc' };
    callMiddleware(action);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SHARE_NEW_ACTION',
      innerAction: action
    });
  });

  it('does not dispatch a SHARE_NEW_ACTION action if the action is not of type SUBMIT_EDIT_LINE', () => {
    const action = { type: 'UNKNOWN' };
    callMiddleware(action);
    expect(dispatch).not.toHaveBeenCalled();
  });
});

describe('sharingSaga', () => {
  let store;
  let socketSpyFactory;
  let socketSpy;
  let sendSpy;
  let closeSpy;

  beforeEach(() => {
    sendSpy = jest.fn();
    closeSpy = jest.fn();
    socketSpyFactory = jest.spyOn(window, 'WebSocket');
    Object.defineProperty(socketSpyFactory, 'OPEN', {
      value: WEB_SOCKET_OPEN
    });
    Object.defineProperty(socketSpyFactory, 'CLOSED', {
      value: WEB_SOCKET_CLOSED
    });
    socketSpyFactory.mockImplementation(() => {
      socketSpy = {
        send: sendSpy,
        close: closeSpy,
        readyState: WebSocket.OPEN
      };
      return socketSpy;
    });
    store = configureStore([storeSpy]);
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        protocol: 'http:',
        host: 'test:1234',
        pathname: '/index.html'
      }
    });
  });

  afterEach(() => {
    socketSpyFactory.mockReset();
  });

  const notifySocketOpened = async () => {
    await act(async () => {
      socketSpy.onopen();
    });
  };

  const sendSocketMessage = async message => {
    await act(async () => {
      socketSpy.onmessage({ data: JSON.stringify(message) });
    });
  };

  describe('START_SHARING', () => {
    it('opens a websocket when starting to share', () => {
      store.dispatch({ type: 'START_SHARING' });
      expect(socketSpyFactory).toHaveBeenCalledWith(
        'ws://test:1234/share'
      );
    });

    it('dispatches a START_SHARING action to the socket', async () => {
      store.dispatch({ type: 'START_SHARING' });
      await notifySocketOpened();
      expect(sendSpy).toHaveBeenCalledWith(
        JSON.stringify({ type: 'START_SHARING' })
      );
    });

    it('dispatches an action of STARTED_SHARING with a URL containing the id that is returned from the server', async () => {
      store.dispatch({ type: 'START_SHARING' });
      await notifySocketOpened();
      await sendSocketMessage({ type: 'UNKNOWN', id: 123 });
      return expectRedux(store)
        .toDispatchAnAction()
        .matching({
          type: 'STARTED_SHARING',
          url: 'http://test:1234/index.html?watching=123'
        });
    });

    it('puts an action of RESET if reset is true', async () => {
      store.dispatch({ type: 'START_SHARING', reset: true });
      await notifySocketOpened();
      await sendSocketMessage({ type: 'UNKNOWN', id: 123 });
      return expectRedux(store)
        .toDispatchAnAction()
        .matching({ type: 'RESET' });
    });

    it('shares all existing actions if reset is false', async () => {
      const forward10 = {
        type: 'SUBMIT_EDIT_LINE',
        text: 'forward 10'
      };
      const right90 = {
        type: 'SUBMIT_EDIT_LINE',
        text: 'right 90'
      };
      store.dispatch(forward10);
      store.dispatch(right90);
      store.dispatch({ type: 'START_SHARING', reset: false });
      await notifySocketOpened();
      await sendSocketMessage({ type: 'UNKNOWN', id: 123 });
      expect(sendSpy).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'NEW_ACTION',
          innerAction: forward10
        })
      );
      expect(sendSpy).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'NEW_ACTION',
          innerAction: right90
        })
      );
    });
  });

  const startSharing = async sessionId => {
    store.dispatch({ type: 'START_SHARING', reset: true });
    await notifySocketOpened();
    await sendSocketMessage({ type: 'UNKNOWN', id: 123 });
  };

  describe('STOP_SHARING', () => {
    it('calls close on the open socket', async () => {
      await startSharing();
      store.dispatch({ type: 'STOP_SHARING' });
      expect(closeSpy).toHaveBeenCalled();
    });

    it('dispatches an action of STOPPED_SHARING', async () => {
      await startSharing();
      store.dispatch({ type: 'STOP_SHARING' });
      return expectRedux(store)
        .toDispatchAnAction()
        .matching({ type: 'STOPPED_SHARING' });
    });
  });

  describe('SHARE_NEW_ACTION', () => {
    it('forwards the same action on to the socket', async () => {
      const innerAction = { a: 123 };
      await startSharing(123);
      store.dispatch({ type: 'SHARE_NEW_ACTION', innerAction });
      expect(sendSpy).toHaveBeenLastCalledWith(
        JSON.stringify({ type: 'NEW_ACTION', innerAction })
      );
    });

    it('does not forward if the socket is not set yet', () => {
      store.dispatch({ type: 'SHARE_NEW_ACTION' });
      expect(sendSpy).not.toHaveBeenCalled();
    });

    it('does not forward if the socket has been closed', async () => {
      await startSharing(123);
      socketSpy.readyState = WebSocket.CLOSED;
      store.dispatch({ type: 'SHARE_NEW_ACTION' });
      expect(sendSpy.mock.calls.length).toEqual(1);
    });
  });

  describe('watching', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        writable: true,
        value: {
          host: 'test:1234',
          pathanme: '/index.html',
          search: '?watching=234'
        }
      });
    });

    it('opens a socket when the page loads', () => {
      store.dispatch({ type: 'TRY_START_WATCHING' });
      expect(socketSpyFactory).toHaveBeenCalledWith(
        'ws://test:1234/share'
      );
    });

    it('does not open socket if the watching field is not set', () => {
      window.location.search = '?';
      store.dispatch({ type: 'TRY_START_WATCHING' });
      expect(socketSpyFactory).not.toHaveBeenCalled();
    });

    const startWatching = async () => {
      await act(async () => {
        store.dispatch({ type: 'TRY_START_WATCHING' });
        socketSpy.onopen();
      });
    };

    it('dispatches a RESET action', async () => {
      await startWatching();
      return expectRedux(store)
        .toDispatchAnAction()
        .matching({ type: 'RESET' });
    });

    it('sends the session id to the socket with a action type of START_WATCHING', async () => {
      await startWatching();
      expect(sendSpy).toHaveBeenCalledWith(
        JSON.stringify({ type: 'START_WATCHING', id: '234' })
      );
    });

    it('dispatches a STARTED_WATCHING action', async () => {
      await startWatching();
      return expectRedux(store)
        .toDispatchAnAction()
        .matching({ type: 'STARTED_WATCHING' });
    });

    it('relays multiple actions from the websocket', async () => {
      const message1 = { type: 'ABC' };
      const message2 = { type: 'BCD' };
      const message3 = { type: 'CDE' };
      await startWatching();
      await sendSocketMessage(message1);
      await sendSocketMessage(message2);
      await sendSocketMessage(message3);

      await expectRedux(store)
        .toDispatchAnAction()
        .matching(message1);
      await expectRedux(store)
        .toDispatchAnAction()
        .matching(message2);
      await expectRedux(store)
        .toDispatchAnAction()
        .matching(message3);
      socketSpy.onclose();
    });

    it('dispatches a STOPPED_WATCHING action when the connection is closed', async () => {
      await startWatching();
      socketSpy.onclose();

      return expectRedux(store)
        .toDispatchAnAction()
        .matching({ type: 'STOPPED_WATCHING' });
    });
  });
});
