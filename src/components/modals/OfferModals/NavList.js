import PropTypes from 'prop-types';
import React from 'react';

export const List = ({ className, children }) => {
  return (
    <ul className={`uk-nav ${className}`}>
      {Array.isArray(children)
        ? children.map((item, i) => {
            return <li key={i}>{item}</li>;
          })
        : children}
    </ul>
  );
};

List.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};

List.defaultProps = {
  className: undefined,
};
