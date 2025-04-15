import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { AdminOpportunities } from 'src/components/backoffice/admin/AdminOpportunities';
import { Section } from 'src/components/utils';
import {
  OFFER_ADMIN_FILTERS_DATA,
  OPPORTUNITY_FILTERS_DATA,
} from 'src/constants';
import { ADMIN_ZONES, DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { GA_TAGS } from 'src/constants/tags';
import { UserRoles } from 'src/constants/users';
import { useFilters } from 'src/hooks';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useCandidateId } from 'src/hooks/queryParams/useCandidateId';
import { getDefaultUrl } from 'src/utils/Redirects';

const AdminOpportunitiesPage = () => {
  const {
    replace,
    query: { q, offerId, tag, ...restParams },
  } = useRouter();

  const user = useAuthenticatedUser();
  const candidateId = useCandidateId();

  const [loadingDefaultFilters, setLoadingDefaultFilters] = useState(true);

  const { filters, setFilters, search, setSearch, resetFilters } = useFilters(
    OPPORTUNITY_FILTERS_DATA,
    `/backoffice/admin/offres`,
    ['offerId'],
    GA_TAGS.BACKOFFICE_ADMIN_SUPPRIMER_FILTRES_CLIC
  );

  // redirect with default tag and departments
  useEffect(() => {
    if (user.role !== UserRoles.ADMIN) {
      if (candidateId) {
        replace(
          `/backoffice/candidat/${candidateId}/offres${
            offerId ? `/${offerId}` : ''
          }`,
          undefined,
          {
            shallow: true,
          }
        );
      } else {
        replace(getDefaultUrl(user.role));
      }
    } else if (!tag) {
      const params = {
        tag: OFFER_ADMIN_FILTERS_DATA[0].tag,
        ...restParams,
      } as { department?: string[]; tag?: string };
      if (user.zone && user.zone !== ADMIN_ZONES.HZ) {
        const defaultDepartmentsForAdmin = DEPARTMENTS_FILTERS.filter(
          (dept) => {
            return user.zone === dept.zone;
          }
        );

        params.department = defaultDepartmentsForAdmin.map((dept) => {
          return dept.value;
        });
      }
      if (offerId) {
        replace(
          {
            pathname: `/backoffice/admin/offres/${offerId}`,
            query: params,
          },
          undefined,
          {
            shallow: true,
          }
        );
      } else {
        replace(
          {
            pathname: '/backoffice/admin/offres',
            query: params,
          },
          undefined,
          {
            shallow: true,
          }
        );
      }
    } else {
      setLoadingDefaultFilters(false);
    }
  }, [offerId, replace, restParams, tag, user, candidateId]);

  return (
    <LayoutBackOffice title="Modération des offres">
      <Section className="custom-page">
        {loadingDefaultFilters ? (
          <LoadingScreen />
        ) : (
          <AdminOpportunities
            search={search}
            filters={filters}
            resetFilters={resetFilters}
            setSearch={setSearch}
            setFilters={setFilters}
          />
        )}
      </Section>
    </LayoutBackOffice>
  );
};

export default AdminOpportunitiesPage;
