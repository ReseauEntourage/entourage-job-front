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

interface StepAddItemButtonBaseProps {
  label: string;
  onClick: () => void;
}

// `empty`: dashed card shown when the list has no item.
// `inline`: dashed row shown right under the last item (no help text).
type StepAddItemButtonProps = StepAddItemButtonBaseProps &
  ({ variant: 'empty'; helpText?: string } | { variant: 'inline' });

export const StepAddItemButton = (props: StepAddItemButtonProps) => {
  const { label, onClick } = props;

  if (props.variant === 'inline') {
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
        {props.helpText && (
          <Text color="darkGray" size="small">
            {props.helpText}
          </Text>
        )}
      </StyledTexts>
    </StyledEmptyCard>
  );
};
