import { negate, integerParameterValue } from './values';
import { parseCall } from './parseCall';
import { moveDistance } from './moveDistance';
import { rotate } from './rotate';

export const forward = {
  names: ['forward', 'fd'],
  isWriteProtected: true,
  initial: {},
  parseToken: parseCall,
  parameters: ['distance'],
  perform: state =>
    moveDistance(state, integerParameterValue('distance'))
};

export const backward = {
  names: ['backward', 'bd'],
  isWriteProtected: true,
  initial: {},
  parseToken: parseCall,
  parameters: ['distance'],
  perform: state =>
    moveDistance(state, negate(integerParameterValue('distance')))
};

export const left = {
  names: ['left', 'lt'],
  isWriteProtected: true,
  initial: {},
  parseToken: parseCall,
  parameters: ['angle'],
  perform: state =>
    rotate(state, negate(integerParameterValue('angle')))
};

export const right = {
  names: ['right', 'rt'],
  isWriteProtected: true,
  initial: {},
  parseToken: parseCall,
  parameters: ['angle'],
  perform: state => rotate(state, integerParameterValue('angle'))
};
