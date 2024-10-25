import React from 'react';
import {
  StyledBackofficeBackground,
  StyledBackofficeGrid,
} from '../Backoffice.styles';
import { Section } from 'src/components/utils';
import { H1 } from 'src/components/utils/Headings';
import { USER_ROLES } from 'src/constants/users';
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
import { DashboardOpportunitiesCard } from './DashboardOpportunitiesCard';
import { DashboardProfileCard } from './DashboardProfileCard';
import { DashboardReadDocumentsCard } from './DashboardReadDocumentsCard';
import { DashboardRecommendationsCard } from './DashboardRecommendationsCard';
import { DashboardReferentCard } from './DashboardReferentCard';
import { DashboardStepsCard } from './DashboardStepsCard';
import { DashboardToolboxCard } from './DashboardToolboxCard';

export const Dashboard = () => {
  const isDesktop = useIsDesktop();
  const user = useAuthenticatedUser();

  const shouldShowAllProfile = isRoleIncluded(
    [USER_ROLES.CANDIDATE, USER_ROLES.COACH],
    user.role
  );

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
            {shouldShowAllProfile && <DashboardAvailabilityCard />}
            <DashboardLinkedUserCard />
            <DashboardReferentCard />
          </StyledDashboardLeftColumn>
          <StyledDashboardRightColumn
            className={`${isDesktop ? '' : 'mobile'}`}
          >
            {!isRoleIncluded(
              [USER_ROLES.REFERRER, USER_ROLES.ADMIN],
              user.role
            ) && (
              <>
                <DashboardReadDocumentsCard />
                <DashboardMessagingConversation />
                <DashboardStepsCard />
                <DashboardOpportunitiesCard />
                <DashboardRecommendationsCard />
                <DashboardToolboxCard />
              </>
            )}
          </StyledDashboardRightColumn>
        </StyledBackofficeGrid>
      </Section>
    </StyledBackofficeBackground>
  );
};
