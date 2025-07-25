import React from 'react';
import {
  StyledBackofficeBackground,
  StyledBackofficeGrid,
} from '../Backoffice.styles';
import { DashboardInviteToReferCandidate } from '../referer/dashboard/DashboardInviteToReferCandidate/DashboardInviteToReferCandidate';
import { DashboardReferedCandidateList } from '../referer/dashboard/DashboardReferedCandidateList/DashboardReferedCandidateList';
import { Section } from 'src/components/utils';
import { H1 } from 'src/components/utils/Headings';
import { getNormalUserRoles, UserRoles } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useIsDesktop } from 'src/hooks/utils';
import { isRoleIncluded } from 'src/utils';
import {
  StyledDashboardLeftColumn,
  StyledDashboardRightColumn,
  StyledDashboardTitleContainer,
} from './Dashboard.styles';
import { DashboardAlertWhatsapp } from './DashboardAlertWhatsapp/DashboardAlertWhatsapp';
import { DashboardAvailabilityCard } from './DashboardAvailabilityCard';
import { DashboardMessagingConversation } from './DashboardMessagingConversation';
import { DashboardNextSteps } from './DashboardNextSteps/DashboardNextSteps';
import { DashboardProfileCard } from './DashboardProfileCard';
import { DashboardRecommendationsCard } from './DashboardRecommendationsCard';
import { DashboardReferentCard } from './DashboardReferentCard';
import { DashboardToolboxCard } from './DashboardToolboxCard';

export const Dashboard = () => {
  const isDesktop = useIsDesktop();
  const user = useAuthenticatedUser();

  const isNormalUser = isRoleIncluded(getNormalUserRoles(), user.role);
  const isReferer = user.role === UserRoles.REFERER;

  if (isDesktop) {
    return (
      <StyledBackofficeBackground>
        <Section className="custom-page">
          <StyledDashboardTitleContainer>
            <H1 title="Bienvenue sur votre tableau de bord" color="black" />
            <br />
            {isNormalUser && <DashboardAlertWhatsapp />}
          </StyledDashboardTitleContainer>
          <StyledBackofficeGrid>
            <StyledDashboardLeftColumn>
              <DashboardProfileCard />
              {isNormalUser && <DashboardAvailabilityCard />}
              <DashboardReferentCard />
            </StyledDashboardLeftColumn>
            <StyledDashboardRightColumn>
              {isNormalUser && <DashboardNextSteps />}
              <DashboardMessagingConversation />
              {isNormalUser && <DashboardRecommendationsCard />}
              {isReferer && <DashboardInviteToReferCandidate />}
              {isReferer && <DashboardReferedCandidateList />}
              <DashboardToolboxCard />
            </StyledDashboardRightColumn>
          </StyledBackofficeGrid>
        </Section>
      </StyledBackofficeBackground>
    );
  }

  // mobile
  return (
    <StyledBackofficeBackground>
      <Section className="custom-page">
        <StyledDashboardTitleContainer>
          <H1 title="Bienvenue sur votre tableau de bord" color="black" />
          <br />
          {isNormalUser && <DashboardAlertWhatsapp />}
        </StyledDashboardTitleContainer>
        <StyledBackofficeGrid className="mobile">
          <StyledDashboardRightColumn className="mobile">
            {isNormalUser && <DashboardNextSteps />}
            {isNormalUser && <DashboardRecommendationsCard />}
            <DashboardMessagingConversation />
            {isReferer && <DashboardInviteToReferCandidate />}
            {isReferer && <DashboardReferedCandidateList />}
            <DashboardToolboxCard />
          </StyledDashboardRightColumn>
          <StyledDashboardLeftColumn className="mobile">
            <DashboardProfileCard />
            {isNormalUser && <DashboardAvailabilityCard />}
            <DashboardReferentCard />
          </StyledDashboardLeftColumn>
        </StyledBackofficeGrid>
      </Section>
    </StyledBackofficeBackground>
  );
};
