import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/src/components/ui';
import { CardList } from '@/src/components/ui/CardList';
import { Card } from '@/src/components/ui/Cards/Card';
import { StyledDashboardCardContentContainer } from '@/src/features/backoffice/dashboard/Dashboard.styles';
import { NetworkDirectoryUserItem } from '../../../network-directory/NetworkDirectoryItem';
import { Api } from 'src/api';
import { Profile } from 'src/api/types';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { StyledDashboardReferedCandidateList } from './DashboardReferedCandidateList.styles';

export const DashboardReferedCandidateList = () => {
  const user = useAuthenticatedUser();

  const [loading, setLoading] = useState(true);
  const [referedCandidates, setReferedCandidates] = useState<Profile[]>([]);
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
      return (
        <NetworkDirectoryUserItem
          key={profile.id}
          id={profile.id}
          firstName={profile.firstName}
          lastName={profile.lastName}
          role={profile.role}
          gender={profile.gender}
          department={profile.department}
          sectorOccupations={profile.sectorOccupations}
          job={profile.currentJob}
          isAvailable={profile.isAvailable}
          hasPicture={profile.hasPicture}
          currentJob={profile.currentJob}
          achievements={profile.achievements}
        />
      );
    });
  }, [referedCandidates]);

  return (
    <Card title="Les candidats que vous avez orientés" centerTitle>
      <StyledDashboardCardContentContainer>
        <StyledDashboardReferedCandidateList>
          <CardList list={referedList} isLoading={loading} condensed />
        </StyledDashboardReferedCandidateList>
        <Button variant="secondary" href="/backoffice/referer/candidates">
          Voir le suivi de mes candidats
        </Button>
      </StyledDashboardCardContentContainer>
    </Card>
  );
};
