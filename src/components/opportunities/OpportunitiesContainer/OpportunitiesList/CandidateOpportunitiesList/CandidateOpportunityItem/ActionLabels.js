import React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  LabelContainer,
  IconContainer,
} from './ActionLabels.styles';

const ActionLabels = ({ color, label, icon }) => {
  return (
    <Container color={color}>
      <LabelContainer>{label}</LabelContainer>
      <IconContainer>{icon}</IconContainer>
    </Container>
  );
};

ActionLabels.propTypes = {
  color: PropTypes.oneOf(['yellow', 'primaryOrange']).isRequired,
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
};

export default ActionLabels;
