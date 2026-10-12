import React from 'react';
import { Text } from '@/src/components/ui';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { COLORS } from '@/src/constants/styles';
import {
  StyledEmptyCard,
  StyledIconCircle,
  StyledInlineRow,
  StyledTexts,
} from './StepAddItemButton.styles';

interface StepAddItemButtonProps {
  // `empty`: dashed card shown when the list has no item.
  // `inline`: dashed row shown right under the last item.
  variant: 'empty' | 'inline';
  label: string;
  helpText?: string;
  onClick: () => void;
}

export const StepAddItemButton = ({
  variant,
  label,
  helpText,
  onClick,
}: StepAddItemButtonProps) => {
  if (variant === 'inline') {
    return (
      <StyledInlineRow type="button" onClick={onClick}>
        <LucidIcon name="Plus" size={16} color={COLORS.primaryBlue} />
        <Text weight="semibold">{label}</Text>
      </StyledInlineRow>
    );
  }

  return (
    <StyledEmptyCard type="button" onClick={onClick}>
      <StyledIconCircle>
        <LucidIcon name="Plus" size={20} color={COLORS.primaryBlue} />
      </StyledIconCircle>
      <StyledTexts>
        <Text weight="semibold">{label}</Text>
        {helpText && (
          <Text color="darkGray" size="small">
            {helpText}
          </Text>
        )}
      </StyledTexts>
    </StyledEmptyCard>
  );
};
