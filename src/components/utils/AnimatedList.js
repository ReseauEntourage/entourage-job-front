import React from 'react';

import PropTypes from 'prop-types';

const AnimatedList = ({ items }) => {
  return (
    <ul
      uk-scrollspy="cls:uk-animation-slide-bottom; target: > li; delay: 200;"
      className="uk-list uk-list-disc uk-margin-remove-bottom"
    >
      {items.map((item) => {
        return (
          <li className="uk-text-primary">
            <span className="uk-text-secondary">{item}</span>
          </li>
        );
      })}
    </ul>
  );
};

AnimatedList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default AnimatedList;
