import React, { useMemo } from 'react';
import { Button, Card } from '@/src/components/ui';
import { CardList } from '@/src/components/ui/CardList';
import { DirectoryUserItem } from '@/src/features/backoffice/directory/DirectoryItem';
import { StyledDashboardCardContentContainer } from '../Dashboard.styles';
import { DashboardNetworkDiscoveryCard } from '../DashboardNetworkDiscoverCard';
import { UserRoles } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { mutateToArray } from 'src/utils';
import { StyledDashboardRecommendationsList } from './DashboardRecommendationsCard.styles';
import { useDashboardRecommendations } from './useDashboardRecommendations';

const contextCompanyAdmin = 'CompanyAdmin';

type recommendationsContextsType =
  | UserRoles.CANDIDATE
  | UserRoles.COACH
  | typeof contextCompanyAdmin;

const recommendationsLabels: {
  [K in recommendationsContextsType]: {
    title: string;
    subtitle: string;
    button: string;
  };
} = {
  [UserRoles.CANDIDATE]: {
    title: 'Les coachs recommandés pour vous',
    subtitle:
      "N'hésitez pas à prendre connaissance de leurs propositions d’aide et les contacter directement",
    button: 'Voir tous les coachs',
  },
  [UserRoles.COACH]: {
    title: 'Les candidats recommandés pour vous',
    subtitle:
      "N'hésitez pas à prendre connaissance de leurs besoins et les contacter directement",
    button: 'Voir tous les candidats',
  },
  [contextCompanyAdmin]: {
    title: 'Les candidats recommandés pour votre entreprise',
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
    if (isCompanyAdmin) {
      return contextCompanyAdmin;
    }
    if (user.role === UserRoles.COACH) {
      return UserRoles.COACH;
    }
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
