import React from 'react';
import { BottomSheet } from '@/src/components/ui/BottomSheet';
import { NavbarLogo } from '@/src/components/ui/Navbar/NavbarLogo';
import { WizardAuthSection } from './WizardAuthSection';
import {
  StyledWizardContentTopBar,
  StyledWizardMobileHeader,
  StyledWizardPageContent,
  StyledWizardSidePanel,
  StyledWizardSidePanelBody,
  StyledWizardTopBarProgressFill,
  StyledWizardTopBarProgressStrip,
} from './WizardContentLayout.styles';

type SidePanelRenderFn = (mode: 'compact' | 'full') => React.ReactNode;

interface WizardContentLayoutProps {
  children: React.ReactNode;
  sidePanel?: SidePanelRenderFn | null;
  sidePanelSide?: 'left' | 'right';
  stepper?: React.ReactNode;
  sectionProgress?: number | null;
  mobileBottomSheet?: boolean;
}

export const WizardContentLayout = ({
  children,
  sidePanel,
  sidePanelSide = 'right',
  stepper,
  sectionProgress,
  mobileBottomSheet = false,
}: WizardContentLayoutProps) => {
  const hasSidePanel = Boolean(sidePanel);
  const showLogoInTopBar = !hasSidePanel || sidePanelSide === 'right';
  const showMobileBottomSheet = mobileBottomSheet && Boolean(sidePanel);

  return (
    <>
      <StyledWizardPageContent
        $hasSidePanel={hasSidePanel}
        $side={sidePanelSide}
        $mobileBottomSheet={showMobileBottomSheet}
      >
        <StyledWizardMobileHeader>
          <NavbarLogo href="/" type="secondary" />
          <WizardAuthSection />
        </StyledWizardMobileHeader>
        <StyledWizardContentTopBar
          $hasLogo={showLogoInTopBar}
          $hasSidePanel={hasSidePanel}
          $side={sidePanelSide}
        >
          {showLogoInTopBar && <NavbarLogo href="/" type="primary" />}
          {stepper}
          <WizardAuthSection onDark={false} />
        </StyledWizardContentTopBar>
        {sectionProgress != null && (
          <StyledWizardTopBarProgressStrip
            $hasSidePanel={hasSidePanel}
            $side={sidePanelSide}
          >
            <StyledWizardTopBarProgressFill $percent={sectionProgress} />
          </StyledWizardTopBarProgressStrip>
        )}
        {children}
      </StyledWizardPageContent>
      {hasSidePanel && (
        <StyledWizardSidePanel $side={sidePanelSide}>
          <StyledWizardSidePanelBody $side={sidePanelSide}>
            {sidePanel!('full')}
          </StyledWizardSidePanelBody>
        </StyledWizardSidePanel>
      )}
      {showMobileBottomSheet && <BottomSheet>{sidePanel!}</BottomSheet>}
    </>
  );
};
