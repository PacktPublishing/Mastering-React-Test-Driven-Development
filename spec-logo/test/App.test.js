import React from 'react';
import {
  createShallowRenderer,
  id,
  type,
  childrenOf
} from './shallowHelpers';
import { App } from '../src/App';
import { MenuButtons } from '../src/MenuButtons';
import { StatementHistory } from '../src/StatementHistory';
import { ScriptName } from '../src/ScriptName';
import { Drawing } from '../src/Drawing';
import { Prompt } from '../src/Prompt';
import { PromptError } from '../src/PromptError';

describe('App', () => {
  let render, elementMatching;
  let output;

  beforeEach(() => {
    ({ render, elementMatching } = createShallowRenderer());
    render(<App />);
  });

  const table = () => elementMatching(type('table'));

  it('renders a ScriptName component as the first item in  the menu', () => {
    expect(
      childrenOf(elementMatching(id('menu')))[0].type
    ).toEqual(ScriptName);
  });

  it('renders a MenuButtons component as the second items in the menu', () => {
    expect(
      childrenOf(elementMatching(id('menu')))[1].type
    ).toEqual(MenuButtons);
  });

  it('renders a Display component in div#drawing', () => {
    expect(
      childrenOf(elementMatching(id('drawing'))).map(c => c.type)
    ).toContain(Drawing);
  });

  it('renders a table in div#commands', () => {
    expect(
      childrenOf(elementMatching(id('commands'))).map(c => c.type)
    ).toContain('table');
  });

  it('renders a StatementHistory component as the first item in the table', () => {
    expect(childrenOf(table())[0].type).toEqual(StatementHistory);
  });

  it('renders a Prompt component as the second item in the table', () => {
    expect(childrenOf(table())[1].type).toEqual(Prompt);
  });

  it('renders a PromptError component as the third item in the table', () => {
    expect(childrenOf(table())[2].type).toEqual(PromptError);
  });
});
