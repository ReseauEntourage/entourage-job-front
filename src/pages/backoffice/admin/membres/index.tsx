import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { MemberList } from 'src/components/backoffice/admin/members/MemberList';
import { useRole } from 'src/components/backoffice/admin/members/MemberList/useRole';
import { Section } from 'src/components/utils';
import { ALL_USER_ROLES, CANDIDATE_USER_ROLES } from 'src/constants/users';
import { useFilters } from 'src/hooks/useFilters';
import { usePrevious } from 'src/hooks/utils';
import { UserContext } from 'src/store/UserProvider';
import { mutateTypeFilterDependingOnRole } from 'src/utils/Filters';
import { isRoleIncluded } from 'src/utils/Finding';

const MembersAdmin = () => {
  const { replace, query } = useRouter();

  const role = useRole();

  const [loadingDefaultFilters, setLoadingDefaultFilters] = useState(true);
  const { user } = useContext(UserContext);

  const prevUser = usePrevious(user);

  useEffect(() => {
    if (user && user !== prevUser) {
      if (
        !role ||
        (Array.isArray(role) && role.length === 0) ||
        !isRoleIncluded(ALL_USER_ROLES, role)
      ) {
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
