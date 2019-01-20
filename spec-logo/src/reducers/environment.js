export const defaultState = {
  promptFocusRequest: false,
  shouldAnimate: true,
  message: () => null,
  isSharing: false,
  isWatching: false,
  url: null
};

export const environmentReducer = (
  state = defaultState,
  action
) => {
  switch (action.type) {
    case 'PROMPT_FOCUS_REQUEST':
      return { ...state, promptFocusRequest: true };
    case 'PROMPT_HAS_FOCUSED':
      return { ...state, promptFocusRequest: false };
    case 'SKIP_ANIMATING':
      return { ...state, shouldAnimate: false };
    case 'START_ANIMATING':
      return { ...state, shouldAnimate: true };
    case 'MESSAGE':
      return { ...state, message: action.message };
    case 'STARTED_SHARING':
      return { ...state, isSharing: true, url: action.url };
    case 'STOPPED_SHARING':
      return { ...state, isSharing: false };
    case 'STARTED_WATCHING':
      return { ...state, isWatching: true };
    case 'STOPPED_WATCHING':
      return { ...state, isWatching: false };
  }
  return state;
};
