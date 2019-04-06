import {
  Environment,
  Network,
  RecordSource,
  Store
} from 'relay-runtime';

const verifyStatusOk = result => {
  if (!result.ok) {
    return Promise.reject(new Error(500));
  } else {
    return result;
  }
};

export const performFetch = (operation, variables) =>
  window
    .fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: operation.text,
        variables
      })
    })
    .then(verifyStatusOk)
    .then(result => result.json());

let environment = null;
export const getEnvironment = () =>
  environment ||
  (environment = new Environment({
    network: Network.create(performFetch),
    store: new Store(new RecordSource())
  }));
