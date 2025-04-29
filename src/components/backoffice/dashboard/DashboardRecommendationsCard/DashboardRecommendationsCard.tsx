import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { StyledDashboardCardContentContainer } from '../Dashboard.styles';
import { DashboardNetworkDiscoveryCard } from '../DashboardNetworkDiscoverCard';
import { DirectoryItem } from 'src/components/backoffice/directory/DirectoryItem';
import { Button, Card } from 'src/components/utils';
import { CardList } from 'src/components/utils/CardList';
import { NormalUserRole, USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { selectLinkedUser } from 'src/use-cases/current-user';
import { mutateToArray } from 'src/utils';
import { StyledDashboardRecommendationsList } from './DashboardRecommendationsCard.styles';
import { useDashboardRecommendations } from './useDashboardRecommendations';

const recommendationsLabels: {
  [K in NormalUserRole]: {
    title: string;
    subtitle: string;
    button: string;
  };
} = {
  [USER_ROLES.CANDIDATE]: {
    title: 'Les coachs qui pourraient vous aider',
    subtitle:
      "N'hésitez pas à prendre connaissance de leurs propositions d’aide et les contacter directement",
    button: 'Voir tous les coachs',
  },
  [USER_ROLES.COACH]: {
    title: 'Les candidats que vous pourriez aider',
    subtitle:
      "N'hésitez pas à prendre connaissance de leurs besoins et les contacter directement",
    button: 'Voir tous les candidats',
  },
};

export const DashboardRecommendationsCard = () => {
  const user = useAuthenticatedUser();

  const linkedUser = useSelector(selectLinkedUser);

  const isAlreadyLinkedCandidate =
    user.role === USER_ROLES.CANDIDATE && linkedUser;

  const { recommendations, isLoading, isError } = useDashboardRecommendations();

  const query = {
    departments: mutateToArray(user.userProfile.department),
  };

  const recommendationsList = useMemo(() => {
    return recommendations.map((profile) => {
      return (
        <DirectoryItem
          key={profile.id}
          id={profile.id}
          firstName={profile.firstName}
          lastName={profile.lastName}
          role={profile.role}
          department={profile.department}
          userProfileNudges={profile.userProfileNudges}
          sectorOccupations={profile.sectorOccupations}
          job={profile.currentJob}
          isAvailable={profile.isAvailable}
          displayHelps={false}
        />
      );
    });
  }, [recommendations]);

  if ((recommendations.length === 0 && !isLoading) || isError) {
    return <DashboardNetworkDiscoveryCard />;
  }

  if (isAlreadyLinkedCandidate) {
    return null;
  }

  return (
    <Card
      title={recommendationsLabels[user.role].title}
      subtitle={recommendationsLabels[user.role].subtitle}
      centerTitle
    >
      <StyledDashboardCardContentContainer>
        <StyledDashboardRecommendationsList>
          <CardList
            list={recommendationsList}
            isLoading={isLoading}
            condensed
          />
        </StyledDashboardRecommendationsList>
        <Button
          variant="primary"
          rounded
          href={{ pathname: '/backoffice/annuaire', query }}
        >
          {recommendationsLabels[user.role].button}
        </Button>
      </StyledDashboardCardContentContainer>
    </Card>
  );
};
