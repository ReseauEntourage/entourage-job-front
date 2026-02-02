import React, { useMemo } from 'react';
import { Section } from '@/src/components/ui';
import { H1 } from '@/src/components/ui/Headings';
import { CompanyGoal } from '@/src/constants/company';
import {
  StyledBackofficeBackground,
  StyledBackofficeGrid,
} from '../Backoffice.styles';
import { DashboardInviteToReferCandidate } from '../referer/dashboard/DashboardInviteToReferCandidate/DashboardInviteToReferCandidate';
import { DashboardReferedCandidateList } from '../referer/dashboard/DashboardReferedCandidateList/DashboardReferedCandidateList';
import { getNormalUserRoles, UserRoles } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useIsDesktop } from 'src/hooks/utils';
import { isRoleIncluded } from 'src/utils';
import { CompanyRecruitementAlertCard } from './CompanyRecruitementAlertCard';
import {
  StyledDashboardLeftColumn,
  StyledDashboardRightColumn,
  StyledDashboardTitleContainer,
} from './Dashboard.styles';
import { DashboardAlertWhatsapp } from './DashboardAlertWhatsapp/DashboardAlertWhatsapp';
import { DashboardAvailabilityCard } from './DashboardAvailabilityCard';
import { DashboardCompanyCard } from './DashboardCompanyCard/DashboardCompanyCard';
import { DashboardCompanyCollaboratorsList } from './DashboardCompanyCollaboratorsList/DashboardCompanyCollaboratorsList';
import { DashboardMessagingConversation } from './DashboardMessagingConversation';
import { DashboardNextSteps } from './DashboardNextSteps/DashboardNextSteps';
import { DashboardProfileCard } from './DashboardProfileCard';
import { DashboardRecommendationsCard } from './DashboardRecommendationsCard';
import { DashboardStaffContactCard } from './DashboardStaffContactCard';
import { DashboardToolboxCard } from './DashboardToolboxCard';

export const Dashboard = () => {
  const isDesktop = useIsDesktop();
  const user = useAuthenticatedUser();

  const isNormalUser = isRoleIncluded(getNormalUserRoles(), user.role);
  const isReferer = user.role === UserRoles.REFERER;
  const isCompanyAdmin = useMemo(
    () => user.company && user.company.companyUser?.isAdmin,
    [user.company]
  );

  const isCompanyAdminWithRecruitGoal = useMemo(
    () => isCompanyAdmin && user.company?.goal === CompanyGoal.RECRUIT,
    [isCompanyAdmin, user.company?.goal]
  );

  const renderLeftColumnContent = () => {
    return (
      <>
        {isCompanyAdmin && user.company && (
          <DashboardCompanyCard company={user.company} />
        )}
        <DashboardProfileCard />
        {!isCompanyAdmin && user.company && (
          <DashboardCompanyCard company={user.company} />
        )}
        {isNormalUser && <DashboardAvailabilityCard />}
        <DashboardStaffContactCard />
      </>
    );
  };

  const renderRightColumnContent = () => {
    // Changing the order of the cards for company admins with a recruit goal
    return (
      <>
        {isCompanyAdminWithRecruitGoal ? (
          <>
            {isNormalUser && <DashboardNextSteps />}
            {isCompanyAdmin && <CompanyRecruitementAlertCard />}
            {isNormalUser && <DashboardRecommendationsCard />}
            {isCompanyAdmin && user.company && (
              <DashboardCompanyCollaboratorsList companyId={user.company.id} />
            )}
            <DashboardMessagingConversation />
            {isReferer && <DashboardInviteToReferCandidate />}
            {isReferer && <DashboardReferedCandidateList />}
            <DashboardToolboxCard />
          </>
        ) : (
          <>
            {isNormalUser && <DashboardNextSteps />}
            {isCompanyAdmin && user.company && (
              <DashboardCompanyCollaboratorsList companyId={user.company.id} />
            )}
            {isCompanyAdmin && <CompanyRecruitementAlertCard />}
            <DashboardMessagingConversation />
            {isNormalUser && <DashboardRecommendationsCard />}
            {isReferer && <DashboardInviteToReferCandidate />}
            {isReferer && <DashboardReferedCandidateList />}
            <DashboardToolboxCard />
          </>
        )}
      </>
    );
  };

  if (isDesktop) {
    return (
      <StyledBackofficeBackground>
        <Section className="custom-page">
          <StyledDashboardTitleContainer>
            <H1 title="Bienvenue sur votre tableau de bord" color="black" />
            <br />
            {isNormalUser && !isCompanyAdmin && <DashboardAlertWhatsapp />}
          </StyledDashboardTitleContainer>
          <StyledBackofficeGrid>
            <StyledDashboardLeftColumn>
              {renderLeftColumnContent()}
            </StyledDashboardLeftColumn>
            <StyledDashboardRightColumn>
              {renderRightColumnContent()}
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
            {renderRightColumnContent()}
          </StyledDashboardRightColumn>
          <StyledDashboardLeftColumn className="mobile">
            {renderLeftColumnContent()}
          </StyledDashboardLeftColumn>
        </StyledBackofficeGrid>
      </Section>
    </StyledBackofficeBackground>
  );
};
