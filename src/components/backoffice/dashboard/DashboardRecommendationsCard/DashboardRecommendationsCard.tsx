import React, { useMemo } from 'react';
import { StyledDashboardCardContentContainer } from '../Dashboard.styles';
import { DashboardNetworkDiscoveryCard } from '../DashboardNetworkDiscoverCard';
import { DirectoryUserItem } from 'src/components/backoffice/directory/DirectoryItem';
import { Button, Card } from 'src/components/utils';
import { CardList } from 'src/components/utils/CardList';
import { UserRoles } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { mutateToArray } from 'src/utils';
import { StyledDashboardRecommendationsList } from './DashboardRecommendationsCard.styles';
import { useDashboardRecommendations } from './useDashboardRecommendations';

const contextCompanyAdmin = 'CompanyAdmin';

const recommendationsContexts = [
  UserRoles.CANDIDATE,
  UserRoles.COACH,
  contextCompanyAdmin,
];

type recommendationsContextsType = (typeof recommendationsContexts)[number];

const recommendationsLabels: {
  [K in recommendationsContextsType]: {
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
  [contextCompanyAdmin]: {
    title: 'Les candidats qui pourraient vous intéresser',
    subtitle: '',
    button: 'Voir tous les candidats',
  },
};

export const DashboardRecommendationsCard = () => {
  const user = useAuthenticatedUser();
  const isCompanyAdmin = useMemo(
    () => !!(user.company && user.company.companyUser?.isAdmin),
    [user.company]
  );
  const { recommendations, isLoading, isError } = useDashboardRecommendations();
  const query = {
    departments: mutateToArray(user.userProfile.department),
  };

  const context = useMemo<recommendationsContextsType>(() => {
    if (isCompanyAdmin) return contextCompanyAdmin;
    if (user.role === UserRoles.COACH) return UserRoles.COACH;
    return UserRoles.CANDIDATE;
  }, [isCompanyAdmin, user.role]);

  const itemsList = useMemo(() => {
    return recommendations.map((profile) => {
      return (
        <DirectoryUserItem
          key={profile.id}
          id={profile.id}
          firstName={profile.firstName}
          lastName={profile.lastName}
          role={profile.role}
          department={profile.department}
          nudges={profile.nudges}
          sectorOccupations={profile.sectorOccupations}
          job={profile.currentJob}
          isAvailable={profile.isAvailable}
          displayNudges={false}
          hasPicture={profile.hasPicture}
          currentJob={profile.currentJob}
        />
      );
    });
  }, [recommendations]);

  if ((recommendations.length === 0 && !isLoading) || isError) {
    return <DashboardNetworkDiscoveryCard />;
  }

  return (
    <Card
      title={recommendationsLabels[context].title}
      subtitle={recommendationsLabels[context].subtitle}
      centerTitle
    >
      <StyledDashboardCardContentContainer>
        <StyledDashboardRecommendationsList>
          <CardList list={itemsList} isLoading={isLoading} condensed />
        </StyledDashboardRecommendationsList>
        <Button
          variant="primary"
          rounded
          href={{ pathname: '/backoffice/annuaire', query }}
        >
          {recommendationsLabels[context].button}
        </Button>
      </StyledDashboardCardContentContainer>
    </Card>
  );
};
