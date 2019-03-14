import * as parser from '../parser';

export const save = store => next => action => {
  const result = next(action);
  const {
    script: { name, parsedTokens }
  } = store.getState();
  localStorage.setItem('name', name);
  localStorage.setItem(
    'parsedTokens',
    JSON.stringify(parsedTokens)
  );
  return result;
};

export const load = () => {
  const name = localStorage.getItem('name');
  const parsedTokens = JSON.parse(
    localStorage.getItem('parsedTokens')
  );
  if (parsedTokens && parsedTokens !== null) {
    return {
      script: {
        ...parser.parseTokens(parsedTokens, parser.emptyState),
        name
      }
    };
  }
};
