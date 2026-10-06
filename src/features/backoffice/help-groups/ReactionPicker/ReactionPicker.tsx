import React, { useState } from 'react';
import { HelpGroupReactionEmoji } from '@/src/api/types';
import { HELP_GROUP_REACTIONS } from '@/src/use-cases/help-groups';
import { REACT_LABEL } from '../help-groups-participation.labels';
import {
  StyledReactionOption,
  StyledReactionPalette,
  StyledReactionPicker,
  StyledReactionToggle,
} from './ReactionPicker.styles';

interface ReactionPickerProps {
  viewerReaction: HelpGroupReactionEmoji | null;
  // While the previous change of the viewer is being saved
  disabled?: boolean;
  // null removes the viewer's reaction
  onChange: (emoji: HelpGroupReactionEmoji | null) => void;
}

/**
 * Closed palette, no thumb up. The viewer's reaction is flagged; choosing
 * it again removes it, choosing another one replaces it.
 */
export function ReactionPicker({
  viewerReaction,
  disabled = false,
  onChange,
}: ReactionPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <StyledReactionPicker>
      <StyledReactionToggle
        type="button"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => setIsOpen((open) => !open)}
        data-testid="reaction-toggle"
      >
        {viewerReaction ? `${viewerReaction} ${REACT_LABEL}` : REACT_LABEL}
      </StyledReactionToggle>
      {isOpen && (
        <StyledReactionPalette role="group" aria-label={REACT_LABEL}>
          {HELP_GROUP_REACTIONS.map((emoji) => (
            <StyledReactionOption
              key={emoji}
              type="button"
              $isActive={emoji === viewerReaction}
              aria-pressed={emoji === viewerReaction}
              data-testid={`reaction-option-${emoji}`}
              onClick={() => {
                setIsOpen(false);
                onChange(emoji === viewerReaction ? null : emoji);
              }}
            >
              {emoji}
            </StyledReactionOption>
          ))}
        </StyledReactionPalette>
      )}
    </StyledReactionPicker>
  );
}
