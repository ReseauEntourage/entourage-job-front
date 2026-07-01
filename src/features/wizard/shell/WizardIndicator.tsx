import React from 'react';
import { LucidIcon, Tag, TagSize, TagVariant, Text } from '@/src/components/ui';
import { StyledWizardIndicatorContainer } from './WizardIndicator.styles';

interface WizardIndicatorProps {
  totalSteps: number;
  currentIdx: number;
}

export const WizardIndicator = ({
  totalSteps,
  currentIdx,
}: WizardIndicatorProps) => {
  return (
    <Tag variant={TagVariant.ExtraDarkBlue} size={TagSize.Large}>
      <StyledWizardIndicatorContainer>
        <LucidIcon name="Calendar" color="white" />
        <Text color="white">
          Étape {currentIdx + 1} sur {totalSteps}
        </Text>
      </StyledWizardIndicatorContainer>
    </Tag>
  );
};
