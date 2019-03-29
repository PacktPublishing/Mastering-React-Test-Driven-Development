export const objectToQueryString = object => {
  const queryString = Object.keys(object)
    .filter(k => object[k] && object[k] !== '')
    .map(k => `${k}=${encodeURIComponent(object[k])}`)
    .join('&');

  if (queryString) return '?' + queryString;
  return '';
};
