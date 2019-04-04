import React from 'react';
import { objectToQueryString } from '../objectToQueryString';
import { Link } from 'react-router-dom';

export const ToggleRouterButton = ({
  queryParams,
  pathname,
  children,
  toggled
}) => {
  let className = 'button';
  if (toggled) {
    className += ' toggled';
  }
  return (
    <Link
      className={className}
      to={{
        pathname,
        search: objectToQueryString(queryParams)
      }}>
      {children}
    </Link>
  );
};
