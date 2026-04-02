import React, { useMemo } from 'react';
import { Button, Card, LucidIcon, Tooltip } from '@/src/components/ui';
import { CardList } from '@/src/components/ui/CardList';
import { NetworkDirectoryUserItem } from '../../network-directory/NetworkDirectoryItem';
import { StyledDashboardCardContentContainer } from '../Dashboard.styles';
import { DashboardNetworkDiscoveryCard } from '../DashboardNetworkDiscoverCard';
import { PublicProfile } from 'src/api/types';
import { UserRoles } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { mutateToArray } from 'src/utils';
import {
  StyledDashboardRecommendationsList,
  StyledRecommendationsHowItWorksWrapper,
} from './DashboardRecommendationsCard.styles';
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
    howItWorksText: string;
  };
} = {
  [UserRoles.CANDIDATE]: {
    title: 'Les coachs recommandés pour vous',
    subtitle:
      "N'hésitez pas à prendre connaissance de leurs propositions d'aide et les contacter directement",
    button: 'Voir tous les coachs',
    howItWorksText:
      'Chaque semaine, nous analysons votre profil et vos demandes pour vous suggérer les coachs les plus susceptibles de vous aider — en tenant compte de leurs propositions, de leur expérience, de leur proximité géographique et de leur disponibilité.',
  },
  [UserRoles.COACH]: {
    title: 'Les candidats recommandés pour vous',
    subtitle:
      "N'hésitez pas à prendre connaissance de leurs besoins et les contacter directement",
    button: 'Voir tous les candidats',
    howItWorksText:
      'Chaque semaine, nous analysons votre profil et vos coups de pouce pour vous suggérer les candidats les plus susceptibles de bénéficier de votre aide — en tenant compte de leurs besoins, de leur profil, de leur proximité géographique et de leur disponibilité.',
  },
  [contextCompanyAdmin]: {
    title: 'Les candidats recommandés pour votre entreprise',
    subtitle: '',
    button: 'Voir tous les candidats',
    howItWorksText:
      'Chaque semaine, nous analysons les profils de candidats pour vous suggérer les plus susceptibles de vous intéresser.',
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

  const hasAiRecommendations = useMemo(
    () => recommendations.some((r) => r.reason !== null),
    [recommendations]
  );

  const itemsList = useMemo(() => {
    return recommendations.map((recommendation) => {
      // TODO: supprimer après migration backend
      const profile =
        recommendation.publicProfile ??
        (recommendation as unknown as PublicProfile);
      const reason = recommendation.reason ?? null;
      return (
        <NetworkDirectoryUserItem
          key={profile.id}
          id={profile.id}
          firstName={profile.firstName}
          lastName={profile.lastName}
          role={profile.role}
          department={profile.department}
          sectorOccupations={profile.sectorOccupations}
          job={profile.currentJob}
          isAvailable={profile.isAvailable}
          hasPicture={profile.hasPicture}
          currentJob={profile.currentJob}
          recommendationReason={reason}
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
        {hasAiRecommendations && (
          <StyledRecommendationsHowItWorksWrapper>
            <Tooltip content={recommendationsLabels[context].howItWorksText}>
              <Button variant="hoverBlue" size="small" rounded>
                <LucidIcon name="Info" /> &nbsp;Comment ça marche ?
              </Button>
            </Tooltip>
          </StyledRecommendationsHowItWorksWrapper>
        )}
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
