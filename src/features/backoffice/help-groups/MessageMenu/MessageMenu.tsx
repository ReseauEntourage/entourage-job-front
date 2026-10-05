import React from 'react';
import { Dropdown } from '@/src/components/ui/Dropdown/Dropdown';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { MESSAGE_MENU_LABELS } from '../help-groups-participation.labels';
import {
  StyledMessageMenuToggle,
  StyledModerationItem,
} from './MessageMenu.styles';

export type MessageMenuAction =
  'copyLink' | 'edit' | 'delete' | 'revisions' | 'report' | 'moderate';

/**
 * Actions of a message, depending on the viewer:
 * - anyone: copy the link,
 * - the author: edit, delete,
 * - an Entourage admin, on an edited message: previous versions,
 * - any logged-in person, member or not, on someone else's message which is
 *   not hidden after reports: report,
 * - an Entourage admin, on someone else's message: moderation deletion,
 *   set apart from the other actions.
 */
export const getMessageMenuActions = ({
  isAuthor,
  isAdmin,
  isEdited,
  isUnderReview = false,
}: {
  isAuthor: boolean;
  isAdmin: boolean;
  isEdited: boolean;
  isUnderReview?: boolean;
}): MessageMenuAction[] => [
  'copyLink',
  ...(isAuthor ? (['edit', 'delete'] as const) : []),
  ...(isAdmin && isEdited ? (['revisions'] as const) : []),
  ...(!isAuthor && !isUnderReview ? (['report'] as const) : []),
  ...(isAdmin && !isAuthor ? (['moderate'] as const) : []),
];

interface MessageMenuProps {
  actions: MessageMenuAction[];
  onAction: (action: MessageMenuAction) => void;
}

export function MessageMenu({ actions, onAction }: MessageMenuProps) {
  return (
    <Dropdown>
      <Dropdown.Toggle>
        {/* A real button: reachable and activable from the keyboard */}
        <StyledMessageMenuToggle
          type="button"
          aria-haspopup="menu"
          aria-label={MESSAGE_MENU_LABELS.open}
          data-testid="message-menu-toggle"
        >
          <LucidIcon name="Ellipsis" size={18} />
        </StyledMessageMenuToggle>
      </Dropdown.Toggle>
      <Dropdown.Menu openDirection="left">
        {actions
          .filter((action) => action !== 'moderate')
          .map((action) => (
            <Dropdown.Item key={action} onClick={() => onAction(action)}>
              {MESSAGE_MENU_LABELS[action]}
            </Dropdown.Item>
          ))}
        {actions.includes('moderate') && (
          <>
            <Dropdown.ItemSeparator />
            <Dropdown.Item onClick={() => onAction('moderate')}>
              <StyledModerationItem>
                {MESSAGE_MENU_LABELS.moderate}
              </StyledModerationItem>
            </Dropdown.Item>
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}
