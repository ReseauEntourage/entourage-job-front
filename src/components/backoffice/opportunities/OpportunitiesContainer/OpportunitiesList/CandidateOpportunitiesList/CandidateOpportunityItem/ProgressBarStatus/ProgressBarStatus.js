import React from 'react';
import PropTypes from 'prop-types';
import {
  StyledContainer,
  StyledStep,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesList/CandidateOpportunitiesList/CandidateOpportunityItem/ProgressBarStatus/ProgressBarStatus.styles';
import _ from 'lodash';

const ProgressBarStatus = ({ status, archived }) => {
  const noStatusOrAbandonned =
    archived || _.isNil(status) || status === 3 || status === 4;
  return (
    <StyledContainer>
      <StyledStep activate={!noStatusOrAbandonned} />
      <StyledStep activate={!noStatusOrAbandonned && status >= 0} />
      <StyledStep activate={!noStatusOrAbandonned && status >= 1} />
      <StyledStep activate={!noStatusOrAbandonned && status >= 2} />
    </StyledContainer>
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
