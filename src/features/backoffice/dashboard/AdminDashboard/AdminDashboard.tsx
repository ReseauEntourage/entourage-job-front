import React from 'react';
import { Section } from '@/src/components/ui';
import { H1 } from '@/src/components/ui/Headings';
import { useIsDesktop } from '@/src/hooks/utils';
import {
  StyledBackofficeBackground,
  StyledBackofficeGrid,
} from '../../Backoffice.styles';
import {
  StyledDashboardLeftColumn,
  StyledDashboardRightColumn,
  StyledDashboardTitleContainer,
} from '../Dashboard.styles';
import { DashboardProfileCard } from '../DashboardProfileCard';
import { AdminDashboardMessages } from './AdminDashboardMessages';

/**
 * The dashboard of the platform administrators: their profile card on the
 * left, a preview of their messages on the right. On mobile the right column
 * comes first, as on the dashboard of the other roles. It deliberately leaves
 * out the cards that only make sense for candidates and coaches (e-learning,
 * recommendations, WhatsApp group, company, staff contact, toolbox guides).
 */
export const AdminDashboard = () => {
  const isDesktop = useIsDesktop();

  const leftColumn = <DashboardProfileCard hideNudges hideExternalCv />;
  const rightColumn = <AdminDashboardMessages />;

  return (
    <StyledBackofficeBackground>
      <Section className="custom-page">
        <StyledDashboardTitleContainer>
          <H1 title="Bienvenue sur votre tableau de bord" color="black" />
        </StyledDashboardTitleContainer>
        {isDesktop ? (
          <StyledBackofficeGrid>
            <StyledDashboardLeftColumn>{leftColumn}</StyledDashboardLeftColumn>
            <StyledDashboardRightColumn>
              {rightColumn}
            </StyledDashboardRightColumn>
          </StyledBackofficeGrid>
        ) : (
          <StyledBackofficeGrid className="mobile">
            <StyledDashboardRightColumn className="mobile">
              {rightColumn}
            </StyledDashboardRightColumn>
            <StyledDashboardLeftColumn className="mobile">
              {leftColumn}
            </StyledDashboardLeftColumn>
          </StyledBackofficeGrid>
        )}
      </Section>
    </StyledBackofficeBackground>
  );
};
