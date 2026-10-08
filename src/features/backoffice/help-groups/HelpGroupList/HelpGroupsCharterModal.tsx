import React from 'react';
import { Text } from '@/src/components/ui';
import { ModalGeneric } from '@/src/features/modals/Modal/ModalGeneric';
import {
  StyledCharterModalContent,
  StyledCharterModalRules,
} from '../CharterModal/CharterModal.styles';
import {
  HELP_GROUPS_CHARTER_INTRO,
  HELP_GROUPS_CHARTER_RULES,
  HELP_GROUPS_CHARTER_TITLE,
} from '../help-groups.charter';

/**
 * The frame common to every group, to read only: opened from the groups
 * list, before entering any group. Accepting it is asked at the first
 * publication only (see `CharterModal`).
 */
export function HelpGroupsCharterModal() {
  return (
    <ModalGeneric
      id="help-groups-charter"
      title={HELP_GROUPS_CHARTER_TITLE}
      align="left"
      withCloseButton
    >
      <StyledCharterModalContent data-testid="help-groups-charter-modal">
        <Text>{HELP_GROUPS_CHARTER_INTRO}</Text>
        <StyledCharterModalRules>
          {HELP_GROUPS_CHARTER_RULES.map((rule) => (
            <li key={rule}>
              <Text>{rule}</Text>
            </li>
          ))}
        </StyledCharterModalRules>
      </StyledCharterModalContent>
    </ModalGeneric>
  );
}
