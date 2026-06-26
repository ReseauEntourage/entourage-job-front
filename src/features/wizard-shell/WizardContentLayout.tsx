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
  sidePanelSide?: 'left' | 'right';
}

export const WizardContentLayout = ({
  children,
  sidePanel,
  sidePanelSide = 'right',
}: WizardContentLayoutProps) => {
  const hasSidePanel = Boolean(sidePanel);
  const showLogoInTopBar = !hasSidePanel || sidePanelSide === 'right';

  return (
    <>
      <StyledWizardPageContent
        $hasSidePanel={hasSidePanel}
        $side={sidePanelSide}
      >
        <StyledWizardMobileHeader>
          <NavbarLogo href="/" type="secondary" />
          <WizardAuthSection />
        </StyledWizardMobileHeader>
        <StyledWizardContentTopBar $hasLogo={showLogoInTopBar}>
          {showLogoInTopBar && <NavbarLogo href="/" type="primary" />}
          <WizardAuthSection onDark={false} />
        </StyledWizardContentTopBar>
        {children}
      </StyledWizardPageContent>
      {hasSidePanel && (
        <StyledWizardSidePanel $side={sidePanelSide}>
          {sidePanelSide === 'left' && (
            <StyledWizardSidePanelLogo>
              <NavbarLogo href="/" type="secondary" />
            </StyledWizardSidePanelLogo>
          )}
          <StyledWizardSidePanelBody>{sidePanel}</StyledWizardSidePanelBody>
        </StyledWizardSidePanel>
      )}
    </>
  );
};
