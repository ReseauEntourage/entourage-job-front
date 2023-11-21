import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { AdminOpportunities } from 'src/components/backoffice/admin/AdminOpportunities';
import { AdminOpportunitiesFilters } from 'src/components/backoffice/admin/AdminOpportunities/AdminOpportunitiesFilters.types';
import {
  ADMIN_OPPORTUNITY_FILTERS_DATA,
  OFFER_ADMIN_FILTERS_DATA,
} from 'src/constants';
import { ADMIN_ZONES, DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { GA_TAGS } from 'src/constants/tags';
import { USER_ROLES } from 'src/constants/users';
import { useFilters } from 'src/hooks';
import { UserContext } from 'src/store/UserProvider';

const AdminOpportunitiesPage = () => {
  const {
    replace,
    query: { q, offerId, tag, ...restParams },
    isReady,
  } = useRouter();

  const [loadingDefaultFilters, setLoadingDefaultFilters] = useState(true);

  const { user } = useContext(UserContext);

  const { filters, setFilters, search, setSearch, resetFilters } = useFilters(
    ADMIN_OPPORTUNITY_FILTERS_DATA,
    `/backoffice/admin/offres${offerId ? `/${offerId}` : ''}`,
    [],
    GA_TAGS.BACKOFFICE_ADMIN_SUPPRIMER_FILTRES_CLIC,
    true
  );

  let content;

  // redirect with default tag and departments
  useEffect(() => {
    if (isReady) {
      const redirectParams = tag
        ? {
            tag,
            ...restParams,
          }
        : restParams;

      if (q) {
        replace(
          {
            pathname: `/backoffice/admin/offres/${q}`,
            query: redirectParams,
          },
          undefined,
          {
            shallow: true,
          }
        );
      } else if (user) {
        if (user.role !== USER_ROLES.ADMIN) {
          replace(
            `/backoffice/candidat/offres${offerId ? `/${offerId}` : ''}`,
            undefined
          );
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
      }
    }
  }, [q, offerId, replace, restParams, tag, user, isReady]);

  if (
    // loading ||
    !user
  ) {
    content = <LoadingScreen />;
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
    <>
      {!user || loadingDefaultFilters ? (
        <LoadingScreen />
      ) : (
        <LayoutBackOffice title="Modération des offres">
          {content}
        </LayoutBackOffice>
      )}
    </>
  );
};

export default AdminOpportunitiesPage;
