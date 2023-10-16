import React from 'react';
import { plateform } from 'src/utils/Device';
import { AdminOpportunities as AdminOpportunitiesComponent } from './AdminOpportunities';

export const AdminOpportunities = plateform({
  Desktop: AdminOpportunitiesComponent,
  Mobile: (props) => {
    return <AdminOpportunitiesComponent {...props} isMobile />;
  },
});
