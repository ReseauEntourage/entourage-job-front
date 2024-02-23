import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  StyledDashboardCardContent,
  StyledDashboardCardContentContainer,
  StyledDashboardCardSubtitle,
} from '../Dashboard.styles';
import { DirectoryItem } from 'src/components/backoffice/directory/DirectoryItem';
import { Button, Card } from 'src/components/utils';
import { CardList } from 'src/components/utils/CardList';
import { Typography } from 'src/components/utils/Typography';
import { CANDIDATE_USER_ROLES, USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import {
  selectCurrentUserProfileBusinessLines,
  selectCurrentUserProfileHelps,
  selectLinkedUser,
} from 'src/use-cases/current-user';
import { isRoleIncluded, mutateToArray } from 'src/utils';
import { StyledDashboardRecommendationsList } from './DashboardRecommendationsCard.styles';
import { useDashboardRecommendations } from './useDashboardRecommendations';

const recommendationsLabels: {
  [K in typeof USER_ROLES.CANDIDATE | typeof USER_ROLES.COACH]: {
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
    isRoleIncluded(CANDIDATE_USER_ROLES, user.role) && linkedUser;

  const { recommendations, isLoading } = useDashboardRecommendations();

  const currentUserHelps = useSelector(selectCurrentUserProfileHelps);
  const currentUserBusinessLines = useSelector(
    selectCurrentUserProfileBusinessLines
  );

  const query = {
    businessLines: currentUserBusinessLines
      ? currentUserBusinessLines.map(({ name }) => name)
      : [],
    helps: currentUserHelps ? currentUserHelps.map(({ name }) => name) : [],
    departments: mutateToArray(user.userProfile.department),
  };

  const recommendationsList = useMemo(() => {
    return recommendations.map((profile) => {
      const helps = isRoleIncluded(CANDIDATE_USER_ROLES, profile.role)
        ? profile.helpNeeds
        : profile.helpOffers;

      const businessLines = isRoleIncluded(CANDIDATE_USER_ROLES, profile.role)
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
  }, [recommendations]);

  if (isAlreadyLinkedCandidate || recommendations.length === 0) {
    return null;
  }

  return (
    <Card title={recommendationsLabels[user.role].title}>
      <StyledDashboardCardContentContainer>
        <StyledDashboardCardSubtitle>
          <Typography>{recommendationsLabels[user.role].subtitle}</Typography>
        </StyledDashboardCardSubtitle>
        <StyledDashboardCardContent>
          <StyledDashboardRecommendationsList>
            <CardList list={recommendationsList} isLoading={isLoading} />
          </StyledDashboardRecommendationsList>
        </StyledDashboardCardContent>
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
