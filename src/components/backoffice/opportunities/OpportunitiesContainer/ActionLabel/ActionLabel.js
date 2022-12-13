import React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  IconContainer,
  LabelContainer,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/ActionLabel/ActionLabel.styles';

const ActionLabel = ({
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
      fill={fill}
      color={color}
      disabled={disabled}
      hoverAnimation={hoverAnimation}
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
    >
      <IconContainer>{icon}</IconContainer>
      <LabelContainer className="action-label">{label}</LabelContainer>
    </Container>
  );
};
ActionLabel.defaultProps = {
  disabled: false,
  hoverAnimation: false,
  fill: false,
  onClick: () => {},
};

ActionLabel.propTypes = {
  color: PropTypes.oneOf(['yellow', 'primaryOrange']).isRequired,
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  hoverAnimation: PropTypes.bool,
  fill: PropTypes.bool,
  onClick: PropTypes.func,
};

export default ActionLabel;
