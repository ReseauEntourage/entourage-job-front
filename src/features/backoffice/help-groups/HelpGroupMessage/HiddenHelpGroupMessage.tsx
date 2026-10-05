import React from 'react';
import { UNDER_REVIEW_MENTION } from '../help-groups-participation.labels';
import { StyledUnderReviewMention } from './HelpGroupMessage.styles';

/**
 * A message hidden after reports, for a reader who is neither its author nor
 * an admin: a neutral mention, without author, reactions nor actions (the
 * back sends nothing else).
 */
export function HiddenHelpGroupMessage() {
  return (
    <StyledUnderReviewMention data-testid="hidden-message">
      {UNDER_REVIEW_MENTION}
    </StyledUnderReviewMention>
  );
}
