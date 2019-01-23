import express from 'express';
import expressWs from 'express-ws';

export const app = express();
export const expressWs2 = expressWs(app);

app.use(express.json());
app.use(express.static('dist'));

let nextSessionId = 0;

const sessions = {};

const sendJson = (subscriber, obj) => subscriber.send(JSON.stringify(obj));

const OPEN = 1;

const clearSubscribers = session =>
  session.subscribers = session.subscribers.filter(subscriber => subscriber.readyState === OPEN);

const sendToSubscribers = (session, obj) => {
  clearSubscribers(session);
  session.subscribers.forEach(subscriber => sendJson(subscriber, obj));
};

const stopSharingIfPresenter = ws => {
  const id = Object.keys(sessions).find(id => sessions[id] && sessions[id].presenter === ws);
  if (id) {
    sessions[id].subscribers.forEach(subscriber => subscriber.close());
    sessions[id] = undefined;
  }
};

app.ws('/share', function(ws, req) {
  ws.on('close', function(msg) {
    stopSharingIfPresenter(ws);
  });
  ws.on('message', function(msg) {
    let session;
    const request = JSON.parse(msg);
    switch(request.type) {
      case 'START_SHARING':
        sendJson(ws, { status: 'STARTED', id: nextSessionId });
        sessions[nextSessionId] = {
          presenter: ws,
          history: [],
          subscribers: []
        };
        nextSessionId++;
        break;
      case 'START_WATCHING':
        session = sessions[request.id];
        if (session) {
          session.subscribers = [...session.subscribers, ws];
          session.history.forEach(obj => sendJson(ws, obj));
        }
        break;
      case 'NEW_ACTION':
        session = sessions[request.id];
        sendToSubscribers(session, request.innerAction);
        session.history = [...session.history, request.innerAction];
    }
  });
});
