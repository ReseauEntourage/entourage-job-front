import React from 'react';
import { Badge, BadgeVariant } from '@/src/components/ui';

interface WizardSubProgressBarProps {
  currentInSection: number;
  totalInSection: number;
  sectionLabel: string;
}

export const WizardSubProgressBar = ({
  currentInSection,
  totalInSection,
  sectionLabel,
}: WizardSubProgressBarProps) => {
  if (totalInSection <= 1) {
    return null;
  }

  return (
    <Badge variant={BadgeVariant.ExtraLightTeal}>
      {sectionLabel} — Étape {currentInSection + 1}/{totalInSection}
    </Badge>
  );
};
