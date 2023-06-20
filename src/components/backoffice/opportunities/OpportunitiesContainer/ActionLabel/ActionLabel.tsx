import PropTypes from 'prop-types';
import React from 'react';
import {
  StyledContainer,
  StyledIconContainer,
  StyledLabelContainer,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/ActionLabel/ActionLabel.styles';

const ActionLabel = ({
  color,
  label,
  icon,
  disabled,
  hoverAnimation,
  fill,
  onClick,
  id,
}) => {
  return (
    <StyledContainer
      fill={fill}
      color={color}
      disabled={disabled}
      hoverAnimation={hoverAnimation}
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
      data-testid={id}
    >
      <StyledIconContainer>{icon}</StyledIconContainer>
      <StyledLabelContainer className="action-label">
        {label}
      </StyledLabelContainer>
    </StyledContainer>
  );
};

ActionLabel.defaultProps = {
  disabled: false,
  hoverAnimation: false,
  fill: false,
  onClick: () => {},
  id: '',
};

ActionLabel.propTypes = {
  color: PropTypes.oneOf(['yellow', 'primaryOrange']).isRequired,
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  hoverAnimation: PropTypes.bool,
  fill: PropTypes.bool,
  onClick: PropTypes.func,
  id: PropTypes.string,
};

export default ActionLabel;
