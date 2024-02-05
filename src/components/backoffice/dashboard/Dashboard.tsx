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
  StyledParametresRightColumn,
} from './Dashboard.styles';
import { DashboardAvailabilityCard } from './DashboardAvailabilityCard';
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
        <H1 title="Bienvenue sur votre espace personnel" color="black" />
        {/* </Section>
        <Section className="custom-page"> */}
        <StyledBackofficeGrid className={`${isDesktop ? '' : 'mobile'}`}>
          <StyledDashboardLeftColumn className={`${isDesktop ? '' : 'mobile'}`}>
            <DashboardProfileCard />
            {shouldShowAllProfile && <DashboardAvailabilityCard />}
          </StyledDashboardLeftColumn>
          <StyledParametresRightColumn
            className={`${isDesktop ? '' : 'mobile'}`}
          />
        </StyledBackofficeGrid>
      </Section>
    </StyledBackofficeBackground>
  );
};
