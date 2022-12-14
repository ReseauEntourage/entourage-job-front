import React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Step,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesList/CandidateOpportunitiesList/CandidateOpportunityItem/ProgressBarStatus/ProgressBarStatus.styles';
import _ from 'lodash';

const ProgressBarStatus = ({ status, archived }) => {
  const noStatusOrAbandonned =
    archived || _.isNil(status) || status === 3 || status === 4;
  return (
    <Container>
      <Step activate={!noStatusOrAbandonned} />
      <Step activate={!noStatusOrAbandonned && status >= 0} />
      <Step activate={!noStatusOrAbandonned && status >= 1} />
      <Step activate={!noStatusOrAbandonned && status >= 2} />
    </Container>
  );
};

ProgressBarStatus.defaultProps = {
  status: null,
  archived: false,
};

ProgressBarStatus.propTypes = {
  status: PropTypes.number,
  archived: PropTypes.bool,
};

export default ProgressBarStatus;
