import React from 'react';
import {
  StyledBackofficeBackground,
  StyledBackofficeGrid,
} from '../Backoffice.styles';
import { DashboardInviteToReferCandidate } from '../referer/dashboard/DashboardInviteToReferCandidate/DashboardInviteToReferCandidate';
import { DashboardReferedCandidateList } from '../referer/dashboard/DashboardReferedCandidateList/DashboardReferedCandidateList';
import { Section } from 'src/components/utils';
import { H1 } from 'src/components/utils/Headings';
import { NORMAL_USER_ROLES, USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useIsDesktop } from 'src/hooks/utils';
import { isRoleIncluded } from 'src/utils';
import {
  StyledDashboardLeftColumn,
  StyledDashboardRightColumn,
  StyledDashboardTitleContainer,
} from './Dashboard.styles';
import { DashboardAlertWhatsappCoach } from './DashboardAlertWhatsappCoach/DashboardAlertWhatsappCoach';
import { DashboardAvailabilityCard } from './DashboardAvailabilityCard';
import { DashboardLinkedUserCard } from './DashboardLinkedUserCard';
import { DashboardMessagingConversation } from './DashboardMessagingConversation';
import { DashboardNextSteps } from './DashboardNextSteps/DashboardNextSteps';
import { DashboardProfileCard } from './DashboardProfileCard';
import { DashboardReadDocumentsCard } from './DashboardReadDocumentsCard';
import { DashboardRecommendationsCard } from './DashboardRecommendationsCard';
import { DashboardReferentCard } from './DashboardReferentCard';
import { DashboardToolboxCard } from './DashboardToolboxCard';

export const Dashboard = () => {
  const isDesktop = useIsDesktop();
  const user = useAuthenticatedUser();

  const isNormalUser = isRoleIncluded(NORMAL_USER_ROLES, user.role);
  const isReferer = user.role === USER_ROLES.REFERER;

  return (
    <StyledBackofficeBackground>
      <Section className="custom-page">
        <StyledDashboardTitleContainer>
          <H1 title="Bienvenue sur votre espace personnel" color="black" />
          {user.role === USER_ROLES.COACH && <DashboardAlertWhatsappCoach />}
        </StyledDashboardTitleContainer>
        <StyledBackofficeGrid className={`${isDesktop ? '' : 'mobile'}`}>
          <StyledDashboardLeftColumn className={`${isDesktop ? '' : 'mobile'}`}>
            <DashboardProfileCard />
            {isNormalUser && <DashboardAvailabilityCard />}
            <DashboardLinkedUserCard />
            <DashboardReferentCard />
          </StyledDashboardLeftColumn>
          <StyledDashboardRightColumn
            className={`${isDesktop ? '' : 'mobile'}`}
          >
            {isNormalUser && (
              <>
                <DashboardReadDocumentsCard />
                <DashboardNextSteps />
              </>
            )}
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
};
