import React from 'react';
import { createContainerWithStore } from './domManipulators';
import { StatementHistory } from '../src/StatementHistory';

describe('StatementHistory', () => {
  const initialState = {
    script: {
      parsedTokens: [
        { lineNumber: 1, text: 'abc' },
        { lineNumber: 1, text: 'def' },
        { lineNumber: 2, text: 'abc' },
        { lineNumber: 3, text: 'abc' }
      ]
    }
  };
  let container, renderWithStore;

  beforeEach(() => {
    ({ container, renderWithStore } = createContainerWithStore());
    renderWithStore(
      <table>
        <StatementHistory />
      </table>,
      initialState
    );
  });

  it('renders a tbody', () => {
    expect(container.querySelector('tbody')).not.toBeNull();
  });

  it('renders a table cell with the line number as the first cell in each row', () => {
    const td = container.querySelectorAll('tr')[0].childNodes[0];
    expect(td.textContent).toEqual('1');
    expect(td.className).toContain('lineNumber');
  });

  it('renders a table cell with the joined tokens as the second cell in each row', () => {
    const td = container.querySelectorAll('tr')[0].childNodes[1];
    expect(td.textContent).toEqual('abcdef');
    expect(td.className).toContain('text');
  });

  it('renders a row for each line', () => {
    expect(container.querySelectorAll('tr').length).toEqual(3);
  });
});
