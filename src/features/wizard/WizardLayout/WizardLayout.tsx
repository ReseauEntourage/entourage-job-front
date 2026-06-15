import React from 'react';
import { WizardBreadcrumb } from '../WizardBreadcrumb';
import { WizardProgressBar } from '../WizardProgressBar';
import { MobileStickyBanner } from 'src/components/MobileStickyBanner';
import { UserRoles } from 'src/constants/users';
import {
  PanelState,
  SuggestedProfile,
  WizardSubStep,
} from 'src/use-cases/wizard/wizard.types';
import {
  StyledWizardBody,
  StyledWizardBreadcrumbSpacer,
  StyledWizardMain,
  StyledWizardPanel,
} from './WizardLayout.styles';

interface WizardLayoutProps {
  currentSubStep: WizardSubStep;
  role?: UserRoles;
  panelState: PanelState;
  suggestions: SuggestedProfile[];
  panel: React.ReactNode;
  children: React.ReactNode;
}

export const WizardLayout = ({
  currentSubStep,
  role,
  panelState,
  suggestions,
  panel,
  children,
}: WizardLayoutProps) => {
  return (
    <>
      <MobileStickyBanner
        panelState={panelState}
        suggestionsCount={suggestions.length}
      />
      <StyledWizardBody>
        <StyledWizardMain>
          {role && (
            <>
              <WizardProgressBar currentSubStep={currentSubStep} role={role} />
              <StyledWizardBreadcrumbSpacer />
              <WizardBreadcrumb currentSubStep={currentSubStep} role={role} />
            </>
          )}
          {children}
        </StyledWizardMain>
        {role !== UserRoles.REFERER && (
          <StyledWizardPanel>{panel}</StyledWizardPanel>
        )}
      </StyledWizardBody>
    </>
  );
};
