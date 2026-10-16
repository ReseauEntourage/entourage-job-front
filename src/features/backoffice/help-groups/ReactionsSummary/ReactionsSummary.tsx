import React from 'react';
import { HelpGroupReactionsSummary } from '@/src/api/types';
import { Text } from '@/src/components/ui';
import { formatReactionsLabel } from '../help-groups.labels';
import {
  StyledReactionsEmojis,
  StyledReactionsSummary,
} from './ReactionsSummary.styles';

interface ReactionsSummaryProps {
  summary: HelpGroupReactionsSummary | null;
}

/**
 * Distinct reactions followed by first names, never a number. Nothing is
 * rendered for a message without reactions.
 */
export function ReactionsSummary({ summary }: ReactionsSummaryProps) {
  const label = formatReactionsLabel(summary);
  if (!summary || !label) {
    return null;
  }
  return (
    <StyledReactionsSummary data-testid="reactions-summary">
      <StyledReactionsEmojis aria-hidden="true">
        {summary.emojis.join(' ')}
      </StyledReactionsEmojis>
      <Text size="small" color="darkGray">
        {label}
      </Text>
    </StyledReactionsSummary>
  );
}
