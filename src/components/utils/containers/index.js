import React from 'react';
import { StyledContainer } from 'src/components/utils/containers/styles';
import { PropTypes } from 'prop-types';

export const Container = ({ children }) => {
  return <StyledContainer>{children}</StyledContainer>;
};

Container.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};
