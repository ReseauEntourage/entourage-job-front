import React, { useMemo } from 'react';
import { DirectoryItem } from 'src/components/backoffice/directory/DirectoryItem';
import { Button, Card } from 'src/components/utils';
import { CardList } from 'src/components/utils/CardList';
import { CANDIDATE_USER_ROLES, USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { isRoleIncluded } from 'src/utils';
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

  const { recommendations, isLoading } = useDashboardRecommendations();

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

  return (
    <Card title={recommendationsLabels[user.role].title}>
      <p>{recommendationsLabels[user.role].subtitle}</p>
      <CardList list={recommendationsList} isLoading={isLoading} />
      <Button>{recommendationsLabels[user.role].button}</Button>
    </Card>
  );
};
