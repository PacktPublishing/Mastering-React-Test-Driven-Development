import { environmentReducer as reducer } from '../../src/reducers/environment';

describe('environmentReducer', () => {
  it('returns default state when existing state is undefined', () => {
    expect(reducer(undefined, {})).toEqual({
      promptFocusRequest: false
    });
  });

  it('sets promptFocusRequest to true when receiving a PROMPT_FOCUS_REQUEST action', () => {
    expect(
      reducer(
        { promptFocusRequest: false },
        { type: 'PROMPT_FOCUS_REQUEST' }
      )
    ).toEqual({
      promptFocusRequest: true
    });
  });

  it('sets promptFocusRequest to false when receiving a PROMPT_HAS_FOCUSED action', () => {
    expect(
      reducer(
        { promptFocusRequest: true },
        { type: 'PROMPT_HAS_FOCUSED' }
      )
    ).toEqual({
      promptFocusRequest: false
    });
  });
});
