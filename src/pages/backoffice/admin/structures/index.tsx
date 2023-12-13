import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { OrganizationList } from 'src/components/backoffice/admin/organizations/OrganizationList';
import { useZone } from 'src/components/backoffice/admin/organizations/OrganizationList/useZone';
import { Section } from 'src/components/utils';
import { ORGANIZATION_FILTERS_DATA } from 'src/constants';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useFilters } from 'src/hooks/useFilters';
import { usePrevious } from 'src/hooks/utils';

const OrganizationsAdmin = () => {
  const { replace, query } = useRouter();

  const zone = useZone();

  const [loadingDefaultFilters, setLoadingDefaultFilters] = useState(true);
  const user = useAuthenticatedUser();

  const prevUser = usePrevious(user);

  useEffect(() => {
    if (user && user !== prevUser) {
      if (!zone || (Array.isArray(zone) && zone.length === 0)) {
        const params = { ...query, ...(user.zone ? { zone: user.zone } : {}) };
        replace(
          {
            pathname: '/backoffice/admin/structures',
            query: params,
          },
          undefined,
          { shallow: true }
        );
      }
      setLoadingDefaultFilters(false);
    }
  }, [loadingDefaultFilters, prevUser, query, replace, user, zone]);

  const { filters, setFilters, search, setSearch, resetFilters } = useFilters(
    ORGANIZATION_FILTERS_DATA,
    '/backoffice/admin/structures'
  );

  return (
    <LayoutBackOffice title="Gestion des structures partenaires">
      <Section className="custom-page">
        {loadingDefaultFilters ? (
          <LoadingScreen />
        ) : (
          <OrganizationList
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

export default OrganizationsAdmin;
