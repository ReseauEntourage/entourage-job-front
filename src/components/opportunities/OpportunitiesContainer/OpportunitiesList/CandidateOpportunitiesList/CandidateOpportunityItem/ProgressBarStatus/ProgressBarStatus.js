import React from 'react';
import PropTypes from 'prop-types';
import { Container, Step } from 'src/components/opportunities/OpportunitiesContainer/OpportunitiesList/CandidateOpportunitiesList/CandidateOpportunityItem/ProgressBarStatus/ProgressBarStatus.styles';

const ProgressBarStatus = ({ status }) => {
  return (
    <Container>
      <Step activate={status} />
      <Step activate={status && status >= 0} />
      <Step activate={status && status >= 1} />
      <Step activate={status && status >= 2} />
    </Container>
  );
};

ProgressBarStatus.defaultProps = {
  status: null,
};

ProgressBarStatus.propTypes = {
  status: PropTypes.number,
};

export default ProgressBarStatus;
