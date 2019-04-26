import {
  required,
  match,
  list,
  hasError,
  anyErrors,
  validateMany
} from '../src/formValidation';

const alwaysPass = _ => undefined;
const alwaysFail = failDesc => _ => failDesc;

describe('validateMany', () => {
  it('validates a single field', () => {
    const validators = {
      field: alwaysFail('field validation failed')
    };
    expect(validateMany(validators, { field: 'val' })).toEqual({
      field: 'field validation failed'
    });
  });

  it('validates multiple fields', () => {
    const validators = {
      fieldOne: alwaysPass,
      fieldTwo: alwaysPass
    };
    expect(
      validateMany(validators, {
        fieldOne: 'val',
        fieldTwo: 'val'
      })
    ).toEqual({
      fieldOne: undefined,
      fieldTwo: undefined
    });
  });
});

describe('anyErrors', () => {
  it('returns true if any field is undefined', () => {
    expect(
      anyErrors({ field: undefined, errorField: 'error' })
    ).toBeTruthy();
  });

  it('returns false if no field is undefined', () => {
    expect(anyErrors({ field: undefined })).toBeFalsy();
  });
});

describe('hasError', () => {
  it('returns true if an error exists', () => {
    expect(hasError({ field: 'error' }, 'field')).toBeTruthy();
  });

  it('returns false if error field is not set', () => {
    expect(hasError({}, 'field')).toBeFalsy();
  });

  it('returns false if error field is undefined', () => {
    expect(hasError({ field: undefined }, 'field')).toBeFalsy();
  });
});

describe('list', () => {
  it('passes if all its child validators pass', () => {
    const validator = list(alwaysPass, alwaysPass);
    expect(validator(null)).not.toBeDefined();
  });

  it('returns the first child that does not match', () => {
    const validator = list(
      alwaysFail('first'),
      alwaysFail('second')
    );
    expect(validator(null)).toEqual('first');
  });
});

describe('required', () => {
  it('passes if there is a string', () => {
    const validator = required('matched');
    expect(validator('test')).not.toBeDefined();
  });

  it('fails if there is only whitespace', () => {
    const validator = required('matched');
    expect(validator(' ')).toEqual('matched');
  });
});

describe('match', () => {
  it('passes if the value matches the regular expression', () => {
    const validator = match(/abc/, 'matched');
    expect(validator('test abc test')).not.toBeDefined();
  });

  it('fails if the value does not match the regular expression', () => {
    const validator = match(/abc/, 'matched');
    expect(validator('test test')).toEqual('matched');
  });
});
