import React from 'react';
import {
  StyledBackofficeBackground,
  StyledBackofficeGrid,
} from '../Backoffice.styles';
import { Section } from 'src/components/utils';
import { H1 } from 'src/components/utils/Headings';
import { CANDIDATE_USER_ROLES, USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useIsDesktop } from 'src/hooks/utils';
import { isRoleIncluded } from 'src/utils';
import {
  StyledDashboardLeftColumn,
  StyledDashboardRightColumn,
  StyledDashboardTitleContainer,
} from './Dashboard.styles';
import { DashboardAvailabilityCard } from './DashboardAvailabilityCard';
import { DashboardLinkedUserCard } from './DashboardLinkedUserCard';
import { DashboardOpportunitiesCard } from './DashboardOpportunitiesCard';
import { DashboardProfileCard } from './DashboardProfileCard';

export const Dashboard = () => {
  const isDesktop = useIsDesktop();
  const user = useAuthenticatedUser();

  const shouldShowAllProfile = isRoleIncluded(
    [...CANDIDATE_USER_ROLES, USER_ROLES.COACH],
    user.role
  );

  return (
    <StyledBackofficeBackground>
      <Section className="custom-page">
        <StyledDashboardTitleContainer>
          <H1 title="Bienvenue sur votre espace personnel" color="black" />
        </StyledDashboardTitleContainer>
        <StyledBackofficeGrid className={`${isDesktop ? '' : 'mobile'}`}>
          <StyledDashboardLeftColumn className={`${isDesktop ? '' : 'mobile'}`}>
            <DashboardProfileCard />
            {shouldShowAllProfile && <DashboardAvailabilityCard />}
            <DashboardLinkedUserCard />
          </StyledDashboardLeftColumn>
          <StyledDashboardRightColumn
            className={`${isDesktop ? '' : 'mobile'}`}
          >
            {!isRoleIncluded(
              [USER_ROLES.COACH_EXTERNAL, USER_ROLES.ADMIN],
              user.role
            ) && <DashboardOpportunitiesCard />}
          </StyledDashboardRightColumn>
        </StyledBackofficeGrid>
      </Section>
    </StyledBackofficeBackground>
  );
};
