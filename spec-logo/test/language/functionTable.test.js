import {
  builtInFunctions,
  functionWithName
} from '../../src/language/functionTable';
import { clearScreen } from '../../src/language/clearScreen';

describe('built-in functions', () => {
  it('contains clearScreen', () => {
    expect(builtInFunctions).toContain(clearScreen);
  });
});

describe('functionWithName', () => {
  it('matches function with a non-lowercase name', () => {
    const expectedFunction = { names: ['aBC'] };
    const functions = [expectedFunction];
    expect(functionWithName('ABC', functions)).toBe(
      expectedFunction
    );
  });
});
