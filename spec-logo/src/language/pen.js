const changePen = option => state => ({
  pen: { ...state.pen, ...option }
});

export const penup = {
  names: ['penup', 'pu'],
  isWriteProtected: true,
  initial: { isComplete: true },
  perform: changePen({ down: false })
};

export const pendown = {
  names: ['pendown', 'pd'],
  isWriteProtected: true,
  initial: { isComplete: true },
  perform: changePen({ down: true })
};
