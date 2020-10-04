const defaultState = {
  promptFocusRequest: false,
  shouldAnimate: true
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
  }
  return state;
};
