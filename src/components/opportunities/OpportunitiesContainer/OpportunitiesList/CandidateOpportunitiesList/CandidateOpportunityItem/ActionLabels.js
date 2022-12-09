import React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  LabelContainer,
  IconContainer,
} from './ActionLabels.styles';

const ActionLabels = ({
  color,
  label,
  icon,
  disabled,
  hoverAnimation,
  fill,
  onClick,
}) => {
  return (
    <Container
      className={hoverAnimation ? '.slide-in-right' : ''}
      fill={fill}
      color={color}
      disabled={disabled}
      hoverAnimation={hoverAnimation}
      onClick={onClick}
    >
      <LabelContainer>{label}</LabelContainer>
      <IconContainer>{icon}</IconContainer>
    </Container>
  );
};
ActionLabels.defaultProps = {
  disabled: false,
  hoverAnimation: false,
  fill: false,
  onClick: () => {},
};

ActionLabels.propTypes = {
  color: PropTypes.oneOf(['yellow', 'primaryOrange']).isRequired,
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  hoverAnimation: PropTypes.bool,
  fill: PropTypes.bool,
  onClick: PropTypes.func,
};

export default ActionLabels;
