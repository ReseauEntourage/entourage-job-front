import React from 'react';
import {
  StyledBackofficeBackground,
  StyledBackofficeGrid,
} from '../Backoffice.styles';
import { Section } from 'src/components/utils';
import { H1 } from 'src/components/utils/Headings';
import { useIsDesktop } from 'src/hooks/utils';
import {
  StyledDashboardLeftColumn,
  StyledParametresRightColumn,
} from './Dashboard.styles';
import { DashboardProfileCard } from './DashboardProfileCard';

export const Dashboard = () => {
  const isDesktop = useIsDesktop();
  return (
    <StyledBackofficeBackground>
      <Section className="custom-page">
        <H1 title="Bienvenue sur votre espace personnel" color="black" />
        {/* </Section>
        <Section className="custom-page"> */}
        <StyledBackofficeGrid className={`${isDesktop ? '' : 'mobile'}`}>
          <StyledDashboardLeftColumn className={`${isDesktop ? '' : 'mobile'}`}>
            <DashboardProfileCard />
          </StyledDashboardLeftColumn>
          <StyledParametresRightColumn
            className={`${isDesktop ? '' : 'mobile'}`}
          />
        </StyledBackofficeGrid>
      </Section>
    </StyledBackofficeBackground>
  );
};
