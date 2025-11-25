import React from 'react';
import { NormalUserRoles, UserRoles } from '@/src/constants/users';
import { StyledDashboardCardContentContainer } from '../Dashboard.styles';
import { Button, Card, LegacyImg } from 'src/components/utils';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useIsDesktop } from 'src/hooks/utils';
import {
  StyledDashboardNetworkDiscoverContent,
  StyledDashboardNetworkDiscoverText,
  StyledDashboardNetworkImageContainer,
} from './DashboardNetworkDiscoverCard.styles';

const cardVariables: {
  [K in NormalUserRoles]: {
    title: string;
    imageUrl: string;
    content: string;
    button: string;
    buttonHref: string;
  };
} = {
  [UserRoles.CANDIDATE]: {
    title: 'Découvrez les coachs qui pourraient vous accompagner',
    imageUrl: '/static/img/illustrations/network-card-coach.png',
    content:
      "N'hésitez pas à prendre contact avec eux pour les accompagner dans votre recherche",
    button: 'Découvrez les coachs',
    buttonHref: '/backoffice/annuaire?entity=user&role=Coach',
  },
  [UserRoles.COACH]: {
    title: 'Découvrez les candidats que vous pourriez accompagner',
    imageUrl: '/static/img/illustrations/network-card-candidate.png',
    content:
      "N'hésitez pas à prendre contact avec eux pour les accompagner dans leur projet professionnel",
    button: 'Découvrez les candidats',
    buttonHref: '/backoffice/annuaire?entity=user&role=Candidat',
  },
};

export const DashboardNetworkDiscoveryCard = () => {
  const user = useAuthenticatedUser();
  const isDesktop = useIsDesktop();

  return (
    <Card title={cardVariables[user.role].title} centerTitle>
      <StyledDashboardCardContentContainer>
        <StyledDashboardNetworkDiscoverContent>
          {isDesktop && (
            <StyledDashboardNetworkImageContainer>
              <LegacyImg
                src={cardVariables[user.role].imageUrl}
                alt="Illustration réseau d'entraide"
                width={138}
                height={168}
              />
            </StyledDashboardNetworkImageContainer>
          )}
          <div>
            <StyledDashboardNetworkDiscoverText>
              Le réseau d&apos;entraide est un espace qui vous permet de
              découvrir l&apos;ensemble des membres de la communauté, coachs et
              candidats
            </StyledDashboardNetworkDiscoverText>
            <StyledDashboardNetworkDiscoverText>
              {cardVariables[user.role].content}
            </StyledDashboardNetworkDiscoverText>
          </div>
        </StyledDashboardNetworkDiscoverContent>

        <Button
          variant="primary"
          rounded
          href={cardVariables[user.role].buttonHref}
        >
          {cardVariables[user.role].button}
        </Button>
      </StyledDashboardCardContentContainer>
    </Card>
  );
};
