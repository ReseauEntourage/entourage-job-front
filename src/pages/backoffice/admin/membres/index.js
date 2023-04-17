import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LayoutBackOffice from 'src/components/backoffice/LayoutBackOffice';
import { Section } from 'src/components/utils';
import { ALL_USER_ROLES, CANDIDATE_USER_ROLES } from 'src/constants/users.ts';
import { useFilters } from 'src/hooks';
import { UserContext } from 'src/store/UserProvider';
import { MemberList } from 'src/components/backoffice/admin/MemberList/index.ts';
import LoadingScreen from 'src/components/backoffice/cv/LoadingScreen';
import { isRoleIncluded, mutateTypeFilterDependingOnRole } from 'src/utils';

const MembersAdmin = () => {
  const {
    isReady,
    replace,
    query: { role, ...restParams },
  } = useRouter();

  const [loadingDefaultFilters, setLoadingDefaultFilters] = useState(true);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (isReady) {
      if (user) {
        if (
          !role ||
          (Array.isArray(role) && role.length === 0) ||
          !isRoleIncluded(ALL_USER_ROLES, role)
        ) {
          const params = { role: CANDIDATE_USER_ROLES, ...restParams };
          if (user && user.zone) {
            params.zone = user.zone;
          }
          replace(
            {
              pathname: '/backoffice/admin/membres',
              query: params,
            },
            undefined,
            { shallow: true }
          );
        } else {
          setLoadingDefaultFilters(false);
        }
      }
    }
  }, [isReady, replace, restParams, role, user]);

  const { filters, setFilters, search, setSearch, resetFilters } = useFilters(
    mutateTypeFilterDependingOnRole(role),
    '/backoffice/admin/membres'
  );

  return (
    <LayoutBackOffice title="Gestion des membres">
      <Section container="large">
        {loadingDefaultFilters ? (
          <LoadingScreen />
        ) : (
          <MemberList
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

export default MembersAdmin;
