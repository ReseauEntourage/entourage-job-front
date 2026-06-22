import React from 'react';
import { NavbarLogo } from '@/src/components/ui/Navbar/NavbarLogo';
import { WizardAuthSection } from './WizardAuthSection';
import {
  StyledWizardContentTopBar,
  StyledWizardMobileHeader,
  StyledWizardPageContent,
  StyledWizardSidePanel,
  StyledWizardSidePanelBody,
  StyledWizardSidePanelLogo,
} from './WizardContentLayout.styles';

interface WizardContentLayoutProps {
  children: React.ReactNode;
  sidePanel?: React.ReactNode;
}

export const WizardContentLayout = ({
  children,
  sidePanel,
}: WizardContentLayoutProps) => {
  const hasSidePanel = Boolean(sidePanel);

  return (
    <>
      <StyledWizardPageContent $hasSidePanel={hasSidePanel}>
        <StyledWizardMobileHeader>
          <NavbarLogo href="/" type="secondary" />
          <WizardAuthSection />
        </StyledWizardMobileHeader>
        <StyledWizardContentTopBar $hasLogo={!hasSidePanel}>
          {!hasSidePanel && <NavbarLogo href="/" type="primary" />}
          <WizardAuthSection onDark={false} />
        </StyledWizardContentTopBar>
        {children}
      </StyledWizardPageContent>
      {hasSidePanel && (
        <StyledWizardSidePanel>
          <StyledWizardSidePanelLogo>
            <NavbarLogo href="/" type="secondary" />
          </StyledWizardSidePanelLogo>
          <StyledWizardSidePanelBody>{sidePanel}</StyledWizardSidePanelBody>
        </StyledWizardSidePanel>
      )}
    </>
  );
};
