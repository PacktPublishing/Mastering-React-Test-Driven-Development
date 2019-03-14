import { load, save } from '../../src/middleware/localStorage';
import * as parser from '../../src/parser';

describe('localStorage', () => {
  let getItemSpy = jest.fn();
  let setItemSpy = jest.fn();

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: getItemSpy,
        setItem: setItemSpy
      }
    });
  });

  describe('save middleware', () => {
    const name = 'script name';
    const parsedTokens = ['forward 10'];
    const state = { script: { name, parsedTokens } };
    const action = { type: 'ANYTHING' };
    const store = { getState: () => state };
    let next;

    beforeEach(() => {
      next = jest.fn();
    });

    function callMiddleware() {
      return save(store)(next)(action);
    }

    it('calls next with the action', () => {
      callMiddleware();
      expect(next).toHaveBeenCalledWith(action);
    });

    it('returns the result of next action', () => {
      next.mockReturnValue({ a: 123 });
      expect(callMiddleware()).toEqual({ a: 123 });
    });

    it('saves the current state of the store in localStorage', () => {
      callMiddleware();
      expect(setItemSpy).toHaveBeenCalledWith('name', name);
      expect(setItemSpy).toHaveBeenCalledWith(
        'parsedTokens',
        JSON.stringify(parsedTokens)
      );
    });
  });

  describe('load', () => {
    let parserSpy;

    describe('with saved data', () => {
      beforeEach(() => {
        parserSpy = jest.fn();
        parser.parseTokens = parserSpy;
        getItemSpy.mockReturnValueOnce('script name');
        getItemSpy.mockReturnValueOnce(
          JSON.stringify([{ a: 123 }])
        );
      });

      it('retrieves state from localStorage', () => {
        load();
        expect(getItemSpy).toHaveBeenCalledWith('name');
        expect(getItemSpy).toHaveBeenLastCalledWith(
          'parsedTokens'
        );
      });

      it('calls to parsedTokens to retrieve data', () => {
        load();
        expect(parserSpy).toHaveBeenCalledWith(
          [{ a: 123 }],
          parser.emptyState
        );
      });

      it('returns re-parsed draw commands', () => {
        parserSpy.mockReturnValue({ drawCommands: [] });
        expect(load().script).toHaveProperty('drawCommands', []);
      });

      it('returns name', () => {
        expect(load().script).toHaveProperty(
          'name',
          'script name'
        );
      });
    });

    it('returns undefined if there is no state saved', () => {
      getItemSpy.mockReturnValue(null);
      expect(load()).not.toBeDefined();
    });
  });
});
