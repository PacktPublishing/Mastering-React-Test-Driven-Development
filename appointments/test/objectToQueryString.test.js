import { objectToQueryString } from '../src/objectToQueryString';

describe('objectToQueryString', () => {
  it('returns empty string if no params passed', () => {
    expect(objectToQueryString({})).toEqual('');
  });

  it('returns a key/value pair as a k=v string', () => {
    expect(objectToQueryString({ k: 'v' })).toEqual('?k=v');
  });

  it('returns multiple key/value pairs', () => {
    expect(
      objectToQueryString({ a: 'x', b: 'y', c: 'z' })
    ).toEqual('?a=x&b=y&c=z');
  });

  it('removes empty values', () => {
    expect(objectToQueryString({ k: '' })).toEqual('');
  });

  it('removes undefined values', () => {
    expect(objectToQueryString({ k: undefined })).toEqual('');
  });

  it('url encodes values', () => {
    expect(objectToQueryString({ k: ' ' })).toEqual('?k=%20');
  });
});
