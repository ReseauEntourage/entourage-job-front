import React from 'react';
import { plateform } from 'src/utils/Device';
import CandidateOpportunitiesComponent from './CandidateOpportunities';

export const CandidateOpportunities = plateform({
  Desktop: CandidateOpportunitiesComponent,
  Mobile: (props) => {
    return <CandidateOpportunitiesComponent {...props} isMobile />;
  },
});
