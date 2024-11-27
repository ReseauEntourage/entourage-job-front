import React, { useEffect, useMemo, useState } from 'react';
import { Api } from 'src/api';
import { PublicProfile } from 'src/api/types';
import { StyledDashboardCardContentContainer } from 'src/components/backoffice/dashboard/Dashboard.styles';
import { DirectoryItem } from 'src/components/backoffice/directory/DirectoryItem';
import { CardList } from 'src/components/utils/CardList';
import { Card } from 'src/components/utils/Cards/Card';
import { USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { StyledDashboardReferedCandidateList } from './DashboardReferedCandidateList.styles';

export const DashboardReferedCandidateList = () => {
  const user = useAuthenticatedUser();

  const [loading, setLoading] = useState(true);
  const [referedCandidates, setReferedCandidates] = useState<PublicProfile[]>(
    []
  );
  const [offset] = useState(0);
  const [limit] = useState(20);

  useEffect(() => {
    if (user) {
      setLoading(true);
      Api.getReferedCandidateProfiles({
        offset,
        limit,
      })
        .then((response) => {
          setReferedCandidates(response.data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [limit, offset, user]);

  const referedList = useMemo(() => {
    return referedCandidates.map((profile) => {
      const helps =
        profile.role === USER_ROLES.CANDIDATE
          ? profile.helpNeeds
          : profile.helpOffers;

      const businessLines =
        profile.role === USER_ROLES.CANDIDATE
          ? profile.searchBusinessLines
          : profile.networkBusinessLines;

      return (
        <DirectoryItem
          key={profile.id}
          id={profile.id}
          firstName={profile.firstName}
          lastName={profile.lastName}
          role={profile.role}
          department={profile.department}
          helps={helps}
          businessLines={businessLines}
          ambitions={profile.searchAmbitions}
          job={profile.currentJob}
          isAvailable={profile.isAvailable}
        />
      );
    });
  }, [referedCandidates]);

  return (
    <Card title="Les candidats que vous avez orientés" centerTitle>
      <StyledDashboardCardContentContainer>
        <StyledDashboardReferedCandidateList>
          <CardList list={referedList} isLoading={loading} />
        </StyledDashboardReferedCandidateList>
      </StyledDashboardCardContentContainer>
    </Card>
  );
};
