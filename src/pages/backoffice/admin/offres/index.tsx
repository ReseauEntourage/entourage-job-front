import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { AdminOpportunities } from 'src/components/backoffice/admin/AdminOpportunities';
import { AdminOpportunitiesFilters } from 'src/components/backoffice/admin/AdminOpportunities/AdminOpportunitiesFilters.types';
// import { useOpportunityId } from 'src/components/backoffice/opportunities/useOpportunityId';
import { useQueryParamsOpportunities } from 'src/components/backoffice/opportunities/useQueryParamsOpportunities';
// import { OpportunityError } from 'src/components/opportunities/OpportunityError';
import { ADMIN_OPPORTUNITY_FILTERS_DATA } from 'src/constants';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { GA_TAGS } from 'src/constants/tags';
import { useFilters } from 'src/hooks';
import { UserContext } from 'src/store/UserProvider';

const AdminOpportunitiesPage = () => {
  const { replace, pathname, query } = useRouter();
  // const opportunityId = useOpportunityId();

  const queryParamsOpportunities = useQueryParamsOpportunities();

  const { user } = useContext(UserContext);

  // const [hasError, setHasError] = useState(false);
  // const [loading, setLoading] = useState(false);
  // const [hasLoadedDefaultFilters, setHasLoadedDefaultFilters] = useState(false);

  const { filters, setFilters, search, setSearch, resetFilters } = useFilters(
    ADMIN_OPPORTUNITY_FILTERS_DATA,
    `/backoffice/admin/offres`,
    [],
    GA_TAGS.BACKOFFICE_ADMIN_SUPPRIMER_FILTRES_CLIC
  );

  let content;

  // redirect with default tag and departments
  useEffect(() => {
    if ((!query.tag || !query.department) && user) {
      const defaultDepartmentsForAdmin = DEPARTMENTS_FILTERS.filter((dept) => {
        return user.zone === dept.zone;
      });

      const redirectQuery = {
        ...query,
        tag: query.tag ? query.tag : 'pending',
        department: query.department
          ? query.department
          : defaultDepartmentsForAdmin.map((dept) => {
              return dept.value;
            }),
      };
      // if no offerId in param
      if (!pathname.includes('offerId')) {
        replace(
          {
            pathname,
            query: redirectQuery,
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
            pathname,
            query: { ...query, ...redirectQuery },
          },
          undefined,
          {
            shallow: true,
          }
        );
      }
    }
  }, [queryParamsOpportunities, query, pathname, replace, user]);

  if (
    // loading ||
    !user
  ) {
    content = <LoadingScreen />;
    // } else if (hasError) {
    //   content = <OpportunityError />;
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
    <LayoutBackOffice title="Modération des offres">{content}</LayoutBackOffice>
  );
};

export default AdminOpportunitiesPage;
