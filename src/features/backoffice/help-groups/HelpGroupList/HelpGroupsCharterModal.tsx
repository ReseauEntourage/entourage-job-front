import React from 'react';
import { Text } from '@/src/components/ui';
import { EthicsCharterSummaries } from '@/src/components/ui/EthicsCharter/EthicsCharterSummaries';
import { ModalGeneric } from '@/src/features/modals/Modal/ModalGeneric';
import { StyledCharterModalContent } from '../CharterModal/CharterModal.styles';
import {
  HELP_GROUPS_CHARTER_INTRO,
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
        <EthicsCharterSummaries />
      </StyledCharterModalContent>
    </ModalGeneric>
  );
}
