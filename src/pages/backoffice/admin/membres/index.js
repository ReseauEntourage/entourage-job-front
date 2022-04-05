import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LayoutBackOffice from 'src/components/backoffice/LayoutBackOffice';
import { Section } from 'src/components/utils';
import { MEMBER_FILTERS_DATA } from 'src/constants';
import { useFilters } from 'src/hooks';
import { UserContext } from 'src/components/store/UserProvider';
import MemberList from 'src/components/backoffice/admin/MemberList';
import LoadingScreen from 'src/components/backoffice/cv/LoadingScreen';

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
        if (!role) {
          const params = { role: 'All', ...restParams };

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
    MEMBER_FILTERS_DATA,
    '/backoffice/admin/membres'
  );

  return (
    <LayoutBackOffice title="Gestion des membres">
      <Section>
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
