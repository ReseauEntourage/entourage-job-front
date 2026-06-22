import React from 'react';
import {
  StyledWizardPageContent,
  StyledWizardSidePanel,
} from './WizardContentLayout.styles';

interface WizardContentLayoutProps {
  children: React.ReactNode;
  sidePanel: React.ReactNode;
}

export const WizardContentLayout = ({
  children,
  sidePanel,
}: WizardContentLayoutProps) => {
  return (
    <>
      <StyledWizardPageContent>{children}</StyledWizardPageContent>
      <StyledWizardSidePanel>{sidePanel}</StyledWizardSidePanel>
    </>
  );
};
