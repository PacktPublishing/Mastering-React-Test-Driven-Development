import request from 'supertest';
import { app } from '../src/app';

describe('app', () => {
  it('serves an index page', async () => {
    await request(app).get('/').expect(200);
  });

  describe('websocket', () => {
    let server;

    beforeAll(() => {
      server = app.listen(0);
    });

    afterAll(() => {
      return server.close();
    });

    const websocketPromise = address => {
      return new Promise((resolve, reject) => {
        const websocket = new WebSocket(address);
        websocket.onopen = (evt) => { resolve(websocket) };
        websocket.onerror = (evt) => { reject(evt) };
      });
    };

    const requestWebSocket = (server, path) => {
      const port = server.address().port;
      return websocketPromise(`ws://localhost:${port}${path}`);
    }

    const receiveJsonMessages = (websocket, count) => {
      const messages = [];
      return new Promise((resolve, reject) => {
        websocket.onmessage = msg => {
          messages.push(JSON.parse(msg.data));
          if (messages.length === count) {
            websocket.onmessage = undefined;
            resolve(messages);
          }
        }
        websocket.onerror = err => { reject(err); }
      });
    };

    const receiveJsonMessage = websocket => receiveJsonMessages(websocket, 1).then(result => result[0]);

    const sendJsonMessage = (websocket, obj) => websocket.send(JSON.stringify(obj));

    const websocketClose = websocket => {
      return new Promise((resolve, reject) => {
        websocket.onclose = _ => resolve();
      });
    }

    it('opens websocket connections at /share', async () => {
      const websocket = await requestWebSocket(server, '/share');
      expect(websocket.readyState).toBe(1);
    });

    it('returns a STARTED status with the session id when receiving a START_SHARING message', async () => {
      const websocket = await requestWebSocket(server, '/share');
      sendJsonMessage(websocket, { type: 'START_SHARING' });
      const receivedMessage = await receiveJsonMessage(websocket);
      expect(receivedMessage).toEqual({ status: 'STARTED', id: 0 });
    });

    it('increments session id when starting sessions', async () => {
      const websocket = await requestWebSocket(server, '/share');
      sendJsonMessage(websocket, { type: 'START_SHARING' });
      const startedSharingMessage1 = await receiveJsonMessage(websocket);
      sendJsonMessage(websocket, { type: 'START_SHARING' });
      const startedSharingMessage2 = await receiveJsonMessage(websocket);
      expect(startedSharingMessage2.id).toEqual(startedSharingMessage1.id + 1);
    });

    it('replays all existing commands to new subscribers', async () => {
      const websocketServer = await requestWebSocket(server, '/share');
      sendJsonMessage(websocketServer, { type: 'START_SHARING' });
      const startedSharingMessage = await receiveJsonMessage(websocketServer);
      sendJsonMessage(websocketServer, {
        type: 'NEW_ACTION',
        innerAction: { type: 'SUBMIT_EDIT_LINE' } });
      sendJsonMessage(websocketServer, {
        type: 'NEW_ACTION',
        innerAction: { type: 'PROMPT_FOCUS_REQUEST' } });
      const websocketClient = await requestWebSocket(server, '/share');
      sendJsonMessage(websocketClient, { type: 'START_WATCHING', id: startedSharingMessage.id });
      const messages = await receiveJsonMessages(websocketClient, 2);
      expect(messages).toEqual([
        { type: 'SUBMIT_EDIT_LINE' },
        { type: 'PROMPT_FOCUS_REQUEST' }]);
    });

    it('sends all new actions to subscriber', async () => {
      const websocketServer = await requestWebSocket(server, '/share');
      sendJsonMessage(websocketServer, { type: 'START_SHARING' });
      const startedSharingMessage = await receiveJsonMessage(websocketServer);
      const websocketClient = await requestWebSocket(server, '/share');
      sendJsonMessage(websocketClient, { type: 'START_WATCHING', id: startedSharingMessage.id });
      sendJsonMessage(websocketServer, {
        type: 'NEW_ACTION',
        innerAction: { type: 'SUBMIT_EDIT_LINE' } });
      const message = await receiveJsonMessage(websocketClient);
      expect(message).toEqual({ type: 'SUBMIT_EDIT_LINE' });
    });

    it('supports multiple subscribers', async () => {
      const websocketServer = await requestWebSocket(server, '/share');
      sendJsonMessage(websocketServer, { type: 'START_SHARING' });
      const startedSharingMessage = await receiveJsonMessage(websocketServer);
      const websocketClient1 = await requestWebSocket(server, '/share');
      sendJsonMessage(websocketClient1, { type: 'START_WATCHING', id: startedSharingMessage.id });
      const websocketClient2 = await requestWebSocket(server, '/share');
      sendJsonMessage(websocketClient2, { type: 'START_WATCHING', id: startedSharingMessage.id });
      sendJsonMessage(websocketServer, {
        type: 'NEW_ACTION',
        id: startedSharingMessage.id,
        innerAction: { type: 'SUBMIT_EDIT_LINE' } });
      const messageClient1 = await receiveJsonMessage(websocketClient1);
      const messageClient2 = await receiveJsonMessage(websocketClient2);
      expect(messageClient1).toEqual({ type: 'SUBMIT_EDIT_LINE' });
      expect(messageClient2).toEqual({ type: 'SUBMIT_EDIT_LINE' });
    });

    it('closes connection to subscribers when presenter stops sharing', async () => {
      const websocket = await requestWebSocket(server, '/share');
      sendJsonMessage(websocket, { type: 'START_SHARING' });
      const startedSharingMessage = await receiveJsonMessage(websocket);
      const websocketClient = await requestWebSocket(server, '/share');
      sendJsonMessage(websocketClient, { type: 'START_WATCHING', id: startedSharingMessage.id });
      websocket.close();
      await websocketClose(websocketClient);
      expect(websocketClient.readyState).toEqual(3);
    });
  });
});
