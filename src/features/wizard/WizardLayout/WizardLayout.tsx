import Link from 'next/link';
import React from 'react';
import { MobileStickyBanner } from 'src/components/MobileStickyBanner';
import { UserRoles } from 'src/constants/users';
import { PanelState, SuggestedProfile, WizardSubStep } from 'src/use-cases/wizard/wizard.types';
import { WizardBreadcrumb } from '../WizardBreadcrumb';
import { WizardProgressBar } from '../WizardProgressBar';
import {
  StyledWizardBody,
  StyledWizardHeader,
  StyledWizardHeaderLink,
  StyledWizardHeaderLogo,
  StyledWizardMain,
  StyledWizardPage,
  StyledWizardPanel,
} from './WizardLayout.styles';

interface WizardLayoutProps {
  currentMajorStep: 1 | 2 | 3;
  currentSubStep: WizardSubStep;
  role?: UserRoles;
  panelState: PanelState;
  suggestions: SuggestedProfile[];
  panel: React.ReactNode;
  children: React.ReactNode;
}

export const WizardLayout = ({
  currentMajorStep,
  currentSubStep,
  role,
  panelState,
  suggestions,
  panel,
  children,
}: WizardLayoutProps) => {
  return (
    <StyledWizardPage>
      <MobileStickyBanner
        panelState={panelState}
        suggestionsCount={suggestions.length}
      />
      <StyledWizardHeader>
        <StyledWizardHeaderLogo>Entourage Pro</StyledWizardHeaderLogo>
        <StyledWizardHeaderLink>
          <Link href="/connexion">Déjà inscrit ?</Link>
        </StyledWizardHeaderLink>
      </StyledWizardHeader>
      <StyledWizardBody>
        <StyledWizardMain>
          <WizardBreadcrumb
            currentMajorStep={currentMajorStep}
            role={role}
          />
          <WizardProgressBar currentSubStep={currentSubStep} />
          {children}
        </StyledWizardMain>
        {role !== UserRoles.REFERER && (
          <StyledWizardPanel>{panel}</StyledWizardPanel>
        )}
      </StyledWizardBody>
    </StyledWizardPage>
  );
};
