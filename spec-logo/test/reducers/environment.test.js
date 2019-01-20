import {
  environmentReducer as reducer,
  defaultState
} from '../../src/reducers/environment';

describe('environmentReducer', () => {
  it('returns default state when existing state is undefined', () => {
    expect(reducer(undefined, {})).toEqual(defaultState);
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

  it('sets shouldAnimate to false when receiving a SKIP_ANIMATING action', () => {
    expect(
      reducer({ shouldAnimate: true }, { type: 'SKIP_ANIMATING' })
    ).toEqual({
      shouldAnimate: false
    });
  });

  it('sets shouldAnimate to true when receiving a START_ANIMATING action', () => {
    expect(
      reducer(
        { shouldAnimate: false },
        { type: 'START_ANIMATING' }
      )
    ).toEqual({
      shouldAnimate: true
    });
  });

  it('sets isSharing to true when receiving a STARTED_SHARING action', () => {
    const newState = reducer(
      { isSharing: false },
      { type: 'STARTED_SHARING', url: 'a' }
    );
    expect(newState.isSharing).toBe(true);
  });

  it('sets the url when receiving a STARTED_SHARING action', () => {
    const newState = reducer(
      { isSharing: false },
      { type: 'STARTED_SHARING', url: 'a' }
    );
    expect(newState.url).toEqual('a');
  });

  it('sets isSharing to false when receiving a STOPPED_SHARING action', () => {
    const newState = reducer(
      { isSharing: false },
      { type: 'STOPPED_SHARING' }
    );
    expect(newState.isSharing).toBe(false);
  });

  it('sets isWatching to true when receiving a STARTED_WATCHING action', () => {
    const newState = reducer(
      { isWatching: false },
      { type: 'STARTED_WATCHING' }
    );
    expect(newState.isWatching).toBe(true);
  });

  it('sets isWatching to false when receiving a STOPPED_WATCHING action', () => {
    const newState = reducer(
      { isWatching: false },
      { type: 'STOPPED_WATCHING' }
    );
    expect(newState.isWatching).toBe(false);
  });
});
