import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react'
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { AdminOpportunities } from 'src/components/backoffice/admin/AdminOpportunities';
import { AdminOpportunitiesFilters } from 'src/components/backoffice/admin/Adminopportunities/AdminOpportunitiesFilters.types';
// import { useOpportunityId } from 'src/components/backoffice/opportunities/useOpportunityId';
import { useQueryParamsOpportunities } from 'src/components/backoffice/opportunities/useQueryParamsOpportunities';
import { OpportunityError } from 'src/components/opportunities/OpportunityError';
import { ADMIN_OPPORTUNITY_FILTERS_DATA } from 'src/constants';
import { GA_TAGS } from 'src/constants/tags';
import { useFilters } from 'src/hooks';
import { UserContext } from 'src/store/UserProvider';

const AdminOpportunitiesPage = () => {

    const { replace, pathname, query } = useRouter();
    // const opportunityId = useOpportunityId();

    const queryParamsOpportunities = useQueryParamsOpportunities();

    const { user } = useContext(UserContext);

    const [hasError, setHasError] = useState(false);
    const [loading, setLoading] = useState(false);
    // const [hasLoadedDefaultFilters, setHasLoadedDefaultFilters] = useState(false);

    const { filters, setFilters, search, setSearch, resetFilters } = useFilters(
        ADMIN_OPPORTUNITY_FILTERS_DATA,
        `/backoffice/admin/offres`,
        [],
        GA_TAGS.BACKOFFICE_ADMIN_SUPPRIMER_FILTRES_CLIC
        );

    let content;

    // redirect with default tag
    useEffect(() => {
        if (!query.tag) {
            // if no offerId in param
            if (!pathname.includes('offerId')) {
                replace(
                    {
                        pathname: pathname,
                        query: {tag: "pending"},
                    },
                    undefined,
                    {
                      shallow: true,
                    }
                );
            // if offerId in param, wait for it
            } else if (query.offerId) {
                replace(
                    {
                        pathname: pathname,
                        query: {...query, tag: "pending"},
                    },
                    undefined,
                    {
                      shallow: true,
                    }
                );
            }
        }
    }, [queryParamsOpportunities, query, pathname, replace])


  if (
    loading ||
    !user
  ) {
    content = <LoadingScreen />;
  } else if (hasError) {
    content = <OpportunityError />;
  } else {
    content = (
        <AdminOpportunities
            search={search}
            filters={filters as AdminOpportunitiesFilters}
            resetFilters={resetFilters}
            setSearch={setSearch}
            setFilters={setFilters}
        />
    );
  }
  return (
    <LayoutBackOffice
      title="Modération des offres"
    >
        {content}
    </LayoutBackOffice>
  )
}

export default AdminOpportunitiesPage