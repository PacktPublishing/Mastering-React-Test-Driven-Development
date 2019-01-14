import { forward, backward, left, right } from './movement';
import { wait } from './wait';
import { penup, pendown } from './pen';
import { clearScreen } from './clearScreen';
import { repeat } from './repeat';
import { to } from './to';
import { comment } from './comment';

export const functionWithName = (name, functions) => {
  const lowerCaseName = name.toLowerCase();
  return functions.find(f =>
    f.names.map(name => name.toLowerCase()).includes(lowerCaseName)
  );
};

export const builtInFunctions = [
  forward,
  backward,
  left,
  right,
  wait,
  penup,
  pendown,
  clearScreen,
  repeat,
  to,
  comment
];
