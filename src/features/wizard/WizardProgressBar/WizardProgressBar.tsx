import React from 'react';
import { WizardSubStep } from 'src/use-cases/wizard/wizard.types';
import {
  StyledProgressContainer,
  StyledProgressFill,
  StyledProgressLabel,
  StyledProgressTrack,
} from './WizardProgressBar.styles';

const SUB_STEP_CONFIG: Record<
  WizardSubStep,
  { index: number; total: number; label: string } | null
> = {
  '1.1-nudges': { index: 1, total: 5, label: 'Coups de pouce' },
  '1.2-metiers-secteurs': { index: 2, total: 5, label: 'Métiers & secteurs' },
  '1.3-personal-info': { index: 3, total: 5, label: 'Informations personnelles' },
  '1.4-account': { index: 4, total: 5, label: 'Création du compte' },
  '1.5-otp': { index: 5, total: 5, label: 'Vérification e-mail' },
  '2.1-elearning': { index: 1, total: 1, label: 'E-learning' },
  '3.1-social-situation': { index: 1, total: 1, label: 'Situation sociale' },
  done: null,
};

interface WizardProgressBarProps {
  currentSubStep: WizardSubStep;
}

export const WizardProgressBar = ({
  currentSubStep,
}: WizardProgressBarProps) => {
  const config = SUB_STEP_CONFIG[currentSubStep];
  if (!config) return null;

  const percent = (config.index / config.total) * 100;

  return (
    <StyledProgressContainer>
      <StyledProgressLabel>
        Étape {config.index} sur {config.total} — {config.label}
      </StyledProgressLabel>
      <StyledProgressTrack>
        <StyledProgressFill percent={percent} />
      </StyledProgressTrack>
    </StyledProgressContainer>
  );
};
