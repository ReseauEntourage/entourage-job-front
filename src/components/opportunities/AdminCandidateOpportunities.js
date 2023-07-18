import PropTypes from 'prop-types';
import React from 'react';
import { OpportunityList } from 'src/components/opportunities/OpportunityList';
import { OPPORTUNITY_FILTERS_DATA } from 'src/constants';
import { useFilters } from 'src/hooks/useFilters';

const adminQueryFilters = OPPORTUNITY_FILTERS_DATA.slice(0, -1);

export const AdminCandidateOpportunities = ({ candidateId }) => {
  const { filters, setFilters, search, setSearch, resetFilters } = useFilters(
    adminQueryFilters,
    `/backoffice/admin/membres/${candidateId}/offres`,
    ['memberId', 'tab', 'offerId']
  );

  return (
    <div>
      <OpportunityList
        candidateId={candidateId}
        search={search}
        filters={filters}
        resetFilters={resetFilters}
        setSearch={setSearch}
        setFilters={setFilters}
        userRole="candidateAsAdmin"
      />
    </div>
  );
};

AdminCandidateOpportunities.propTypes = {
  candidateId: PropTypes.string.isRequired,
};
