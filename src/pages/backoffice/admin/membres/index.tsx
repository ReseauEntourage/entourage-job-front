import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { MemberList } from 'src/components/backoffice/admin/members/MemberList';
import { Section } from 'src/components/utils';
import { ALL_USER_ROLES, CANDIDATE_USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useRole } from 'src/hooks/queryParams/useRole';
import { useFilters } from 'src/hooks/useFilters';
import { usePrevious } from 'src/hooks/utils';
import { mutateTypeFilterDependingOnRole } from 'src/utils/Filters';
import { isRoleIncluded } from 'src/utils/Finding';

const MembersAdmin = () => {
  const { replace, query } = useRouter();

  const role = useRole();

  const [loadingDefaultFilters, setLoadingDefaultFilters] = useState(true);
  const user = useAuthenticatedUser();

  const prevUser = usePrevious(user);

  useEffect(() => {
    if (user && user !== prevUser) {
      if (!role || role.length === 0 || !isRoleIncluded(ALL_USER_ROLES, role)) {
        const params = {
          ...query,
          role: CANDIDATE_USER_ROLES,
          ...(user.zone ? { zone: user.zone } : {}),
        };
        replace(
          {
            pathname: '/backoffice/admin/membres',
            query: params,
          },
          undefined,
          { shallow: true }
        );
      }
      setLoadingDefaultFilters(false);
    }
  }, [loadingDefaultFilters, prevUser, replace, query, role, user]);

  const { filters, setFilters, search, setSearch, resetFilters } = useFilters(
    mutateTypeFilterDependingOnRole(role),
    '/backoffice/admin/membres'
  );

  return (
    <LayoutBackOffice title="Gestion des membres">
      <Section className="custom-page">
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
