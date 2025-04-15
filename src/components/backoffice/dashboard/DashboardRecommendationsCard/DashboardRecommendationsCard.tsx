import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { StyledDashboardCardContentContainer } from '../Dashboard.styles';
import { DashboardNetworkDiscoveryCard } from '../DashboardNetworkDiscoverCard';
import { DirectoryItem } from 'src/components/backoffice/directory/DirectoryItem';
import { Button, Card } from 'src/components/utils';
import { CardList } from 'src/components/utils/CardList';
import { NormalUserRoles, UserRoles } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { selectLinkedUser } from 'src/use-cases/current-user';
import { mutateToArray } from 'src/utils';
import { StyledDashboardRecommendationsList } from './DashboardRecommendationsCard.styles';
import { useDashboardRecommendations } from './useDashboardRecommendations';

const recommendationsLabels: {
  [K in NormalUserRoles]: {
    title: string;
    subtitle: string;
    button: string;
  };
} = {
  [UserRoles.CANDIDATE]: {
    title: 'Les coachs qui pourraient vous aider',
    subtitle:
      "N'hésitez pas à prendre connaissance de leurs propositions d’aide et les contacter directement",
    button: 'Voir tous les coachs',
  },
  [UserRoles.COACH]: {
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
    user.role === UserRoles.CANDIDATE && linkedUser;

  const { recommendations, isLoading, isError } = useDashboardRecommendations();

  const query = {
    departments: mutateToArray(user.userProfile.department),
  };

  const recommendationsList = useMemo(() => {
    return recommendations.map((profile) => {
      const helps =
        profile.role === UserRoles.CANDIDATE
          ? profile.helpNeeds
          : profile.helpOffers;

      const businessLines =
        profile.role === UserRoles.CANDIDATE
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
          style="custom-secondary-inverted"
          href={{ pathname: '/backoffice/annuaire', query }}
        >
          {recommendationsLabels[user.role].button}
        </Button>
      </StyledDashboardCardContentContainer>
    </Card>
  );
};
