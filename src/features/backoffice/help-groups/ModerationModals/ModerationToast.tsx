import React, { useEffect } from 'react';
import { SimpleLink, Text } from '@/src/components/ui';
import {
  getMessagingHref,
  MODERATION_DONE_LABEL,
  WRITE_TO_AUTHOR_LABEL,
} from '../help-groups-participation.labels';
import { StyledModerationToast } from './ModerationModals.styles';

const TOAST_DURATION_MS = 10000;

interface ModerationToastProps {
  // null for a deleted account: no shortcut
  authorId: string | null;
  onDismiss: () => void;
}

/**
 * Shown to the admin after a moderation deletion, with a shortcut to write
 * to the author in the messaging (nothing is sent automatically).
 */
export function ModerationToast({ authorId, onDismiss }: ModerationToastProps) {
  useEffect(() => {
    const timeout = setTimeout(onDismiss, TOAST_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [onDismiss]);

  return (
    <StyledModerationToast role="status" data-testid="moderation-toast">
      <Text color="white">{MODERATION_DONE_LABEL}</Text>
      {authorId && (
        <SimpleLink href={getMessagingHref(authorId)}>
          <Text color="white" weight="semibold" underline>
            {WRITE_TO_AUTHOR_LABEL}
          </Text>
        </SimpleLink>
      )}
    </StyledModerationToast>
  );
}
