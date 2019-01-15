import { builtInFunctions } from './language/functionTable';
import { parseAndSaveStatement } from './language/parseCall';
import initialText from '../examples/initialText.lgo';

export const emptyState = {
  pen: { down: true },
  turtle: { x: 0, y: 0, angle: 0 },
  drawCommands: [],
  collectedParameters: {},
  parsedStatements: [],
  parsedTokens: [],
  nextInstructionId: 0,
  nextDrawCommandId: 0,
  allFunctions: builtInFunctions,
  name: 'Unnamed script'
};

export const initialState = {
  ...emptyState,
  parsedTokens: tokenizeLine(initialText, 0)
};

function tokenizeLine(line, lastLineNumber) {
  const tokenRegExp = new RegExp(/(\S+)|\n/gm);
  const tokens = [];
  let lastIndex = 0;
  let match;
  let lineNumber = lastLineNumber + 1;
  while ((match = tokenRegExp.exec(line)) != null) {
    if (match.index > lastIndex) {
      tokens.push({
        type: 'whitespace',
        text: line.substring(lastIndex, match.index),
        lineNumber: lineNumber
      });
    }
    if (match[0] === '\n') {
      tokens.push({
        type: 'whitespace',
        text: match[0],
        lineNumber: lineNumber++
      });
    } else {
      tokens.push({
        type: 'token',
        text: match[0],
        lineNumber: lineNumber
      });
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < line.length) {
    tokens.push({
      type: 'whitespace',
      text: line.substring(lastIndex),
      lineNumber: lineNumber
    });
  }
  return tokens;
}

function lastLineNumber({ parsedTokens }) {
  return parsedTokens.reduce((highest, token) => {
    if (token.lineNumber > highest) {
      return token.lineNumber;
    } else {
      return highest;
    }
  }, 0);
}

export function parseStatement(line, state) {
  try {
    return parseTokens(
      tokenizeLine(line, lastLineNumber(state)),
      state
    );
  } catch (e) {
    return { ...state, error: { ...e, line } };
  }
}

export function parseTokens(tokens, state) {
  const updatedState = tokens.reduce(parseAndSaveStatement, state);
  if (!updatedState.currentInstruction) {
    return updatedState;
  } else {
    return state;
  }
}
