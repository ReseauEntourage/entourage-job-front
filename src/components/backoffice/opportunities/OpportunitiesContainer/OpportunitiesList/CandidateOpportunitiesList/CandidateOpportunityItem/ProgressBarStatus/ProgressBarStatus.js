import React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Step,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesList/CandidateOpportunitiesList/CandidateOpportunityItem/ProgressBarStatus/ProgressBarStatus.styles';
import _ from 'lodash';

const ProgressBarStatus = ({ status }) => {
  return (
    <Container>
      <Step activate={!_.isNil(status)} />
      <Step activate={!_.isNil(status) && status >= 0} />
      <Step activate={!_.isNil(status) && status >= 1} />
      <Step activate={!_.isNil(status) && status >= 2} />
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
