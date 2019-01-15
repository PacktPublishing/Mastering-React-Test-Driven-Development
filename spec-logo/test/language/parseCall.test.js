import {
  parseAndSaveStatement,
  parseCall
} from '../../src/language/parseCall';

describe('parseAndSaveStatement', () => {
  let state;

  describe('completing an instruction', () => {
    let parseTokenSpy;
    let performSpy;

    beforeEach(() => {
      parseTokenSpy = jest.fn();
      performSpy = jest.fn();

      parseTokenSpy.mockReturnValue({ a: 123 });
      performSpy.mockReturnValue({ b: 234 });
      state = parseAndSaveStatement(
        {
          parsedStatements: [],
          parsedTokens: [],
          currentInstruction: {
            id: 123,
            isComplete: true,
            functionDefinition: {
              parseToken: parseTokenSpy,
              perform: performSpy
            }
          }
        },
        { type: 'token', text: 'token' }
      );
    });

    it('appends currentInstruction to parsedStatements when it is complete', () => {
      expect(state.parsedStatements.length).toEqual(1);
      expect(state.parsedStatements[0].a).toEqual(123);
    });

    it('removes currentInstruction if it has been completed', () => {
      expect(state.currentInstruction).not.toBeDefined();
    });

    it('adds this token into the parsedTokens after parsing', () => {
      expect(state.parsedTokens.length).toEqual(1);
      expect(state.parsedTokens[0]).toEqual({
        type: 'token',
        text: 'token',
        instructionId: 123
      });
    });

    it('performs the statement', () => {
      expect(performSpy).toHaveBeenCalled();
    });

    it('appends the result from perform', () => {
      expect(state).toHaveProperty('b', 234);
    });
  });

  describe('beginning a new instruction', () => {
    beforeEach(() => {
      state = parseAndSaveStatement(
        {
          nextInstructionId: 123,
          parsedStatements: [],
          currentInstruction: undefined,
          parsedTokens: [],
          allFunctions: [{ names: ['forward'] }]
        },
        { type: 'token', text: 'forward' }
      );
    });

    it('assigns an id to the new instruction', () => {
      expect(state.currentInstruction.id).toEqual(123);
    });

    it('increments nextInstructionId', () => {
      expect(state.nextInstructionId).toEqual(124);
    });

    it('adds this token into the currentInstruction parseTokens', () => {
      expect(state.parsedTokens.length).toEqual(1);
      expect(state.parsedTokens[0]).toEqual({
        type: 'token',
        text: 'forward',
        instructionId: 123
      });
    });
  });

  describe('whitespace', () => {
    it('adds whitespace as tokens without an instruction if currently outside an instruction', () => {
      state = parseAndSaveStatement(
        {
          parsedStatements: [],
          currentInstruction: undefined,
          parsedTokens: [],
          allFunctions: [{ names: ['forward'] }]
        },
        { type: 'whitespace', text: '   ' }
      );
      expect(state.parsedTokens.length).toEqual(1);
      expect(state.parsedTokens[0]).toEqual({
        type: 'whitespace',
        text: '   '
      });
    });
  });
});

describe('parseCall', () => {
  it('ignores whitespace', () => {
    const currentInstruction = {
      collectedParameters: {},
      functionDefinition: {
        parameters: ['x']
      }
    };
    const result = parseCall(
      { currentInstruction },
      { type: 'whitespace' }
    );

    expect(result).toEqual(currentInstruction);
  });
});
