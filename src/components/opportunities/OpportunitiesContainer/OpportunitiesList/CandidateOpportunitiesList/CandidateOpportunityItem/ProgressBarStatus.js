import React from 'react';
import PropTypes from 'prop-types';
import { Container, Step } from './ProgressBarStatus.styles';

const ProgressBarStatus = ({ status }) => {
  return (
    <Container>
      <Step activate />
      <Step activate={status >= 0} />
      <Step activate={status >= 1} />
      <Step activate={status >= 2} />
    </Container>
  );
};

ProgressBarStatus.propTypes = {
  status: PropTypes.number.isRequired,
};

export default ProgressBarStatus;
