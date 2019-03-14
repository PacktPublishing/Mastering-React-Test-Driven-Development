const defaultState = {
  promptFocusRequest: false
};

export const environmentReducer = (
  state = defaultState,
  action
) => {
  switch (action.type) {
    case 'PROMPT_FOCUS_REQUEST':
      return { promptFocusRequest: true };
    case 'PROMPT_HAS_FOCUSED':
      return { promptFocusRequest: false };
  }
  return state;
};
