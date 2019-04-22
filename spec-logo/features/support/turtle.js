export const calculateTurtleXYFromPoints = points => {
  const firstComma = points.indexOf(',');
  const secondComma = points.indexOf(',', firstComma + 1);
  return {
    x: parseFloat(points.substring(0, firstComma)) + 5,
    y:
      parseFloat(points.substring(firstComma + 1, secondComma)) - 5
  };
};

export const calculateTurtleAngleFromTransform = transform => {
  const firstParen = transform.indexOf('(');
  const firstComma = transform.indexOf(',');
  return (
    parseFloat(transform.substring(firstParen + 1, firstComma)) -
    90
  );
};
