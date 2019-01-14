import React from 'react';
import { connect } from 'react-redux';

const groupByLineNumber = tokens => {
  return tokens.reduce((lines, token) => {
    if (lines[token.lineNumber]) {
      return {
        ...lines,
        [token.lineNumber]: [...lines[token.lineNumber], token]
      };
    } else {
      return { ...lines, [token.lineNumber]: [token] };
    }
  }, {});
};

export const LineWithNumber = ({ number, tokens }) => {
  const fullTextLine = tokens
    .map(instruction => instruction.text)
    .join('');
  return (
    <tr key={number.toString()}>
      <td className="lineNumber">{number}</td>
      <td className="text">{fullTextLine}</td>
    </tr>
  );
};

const mapStateToProps = ({ script: { parsedTokens } }) => ({
  parsedTokens
});
const mapDispatchToProps = () => ({});

export const StatementHistory = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ parsedTokens }) => {
  const lines = groupByLineNumber(parsedTokens);

  return (
    <tbody key="acceptedStatements">
      {Object.keys(lines).map(lineNumber => (
        <LineWithNumber
          key={lineNumber}
          number={lineNumber}
          tokens={lines[lineNumber]}
        />
      ))}
    </tbody>
  );
});
