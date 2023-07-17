import React from 'react';
import { plateform } from 'src/utils/Device';
import { CandidateOpportunities as CandidateOpportunitiesComponent } from './CandidateOpportunities';

export const CandidateOpportunities = plateform({
  Desktop: CandidateOpportunitiesComponent,
  Mobile: (props) => {
    return <CandidateOpportunitiesComponent {...props} isMobile />;
  },
});
