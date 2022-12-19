import React from 'react';
import {
  allCTAs,
  CTAsByTab,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/CandidateOpportunityDetails/CandidateOpportunityDetailsCTAs/CandidateOpportunityDetailsCTAs.utils';
import Button from 'src/components/utils/Button';
import { StyledOppCTAsContainer } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/CandidateOpportunityDetails/CandidateOpportunityDetailsCTAs/CandidateOpportunityDetailsCTAS.styles';
import uuid from 'uuid/v4';
import PropTypes from 'prop-types';

const CandidateOpportunityDetailsCTAs = ({ tab }) => {
  return (
    <StyledOppCTAsContainer>
      {(tab || tab === 0) &&
        CTAsByTab.find((CTAByTab) => {
          return CTAByTab.tab === tab;
        }).ctas.map((cta) => {
          const { color, className, action, text } = allCTAs[cta];
          return (
            <li key={uuid}>
              <Button color={color} style={className} onClick={action}>
                {text}
              </Button>
            </li>
          );
        })}
    </StyledOppCTAsContainer>
  );
};

CandidateOpportunityDetailsCTAs.propTypes = {
  tab: PropTypes.number.isRequired,
};

export default CandidateOpportunityDetailsCTAs;
