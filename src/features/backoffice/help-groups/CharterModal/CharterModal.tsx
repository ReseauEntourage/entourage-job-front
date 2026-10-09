import React, { useState } from 'react';
import { Button, Text } from '@/src/components/ui';
import { CheckBox } from '@/src/components/ui/Inputs';
import { useModalContext } from '@/src/features/modals/Modal';
import { ModalGeneric } from '@/src/features/modals/Modal/ModalGeneric';
import { ModalFooter } from '@/src/features/modals/Modal/ModalGeneric/ModalFooter/ModalFooter';
import {
  CHARTER_MODAL_ACCEPT,
  CHARTER_MODAL_CHECKBOX,
  CHARTER_MODAL_INTRO,
  CHARTER_MODAL_TITLE,
  COMPOSER_CANCEL_LABEL,
} from '../help-groups-participation.labels';
import { HELP_GROUPS_CHARTER_RULES } from '../help-groups.charter';
import {
  StyledCharterModalContent,
  StyledCharterModalRules,
} from './CharterModal.styles';

interface CharterModalProps {
  // Sends the message with the charter acceptance
  onAccept: () => void;
}

/**
 * The frame common to every group, accepted once per person at their very
 * first publication. Cancelling sends nothing and keeps the typed text.
 */
export function CharterModal({ onAccept }: CharterModalProps) {
  const { onClose } = useModalContext();
  const [isChecked, setIsChecked] = useState(false);

  return (
    <ModalGeneric title={CHARTER_MODAL_TITLE} align="left">
      <StyledCharterModalContent>
        <Text>{CHARTER_MODAL_INTRO}</Text>
        <StyledCharterModalRules>
          {HELP_GROUPS_CHARTER_RULES.map((rule) => (
            <li key={rule}>
              <Text>{rule}</Text>
            </li>
          ))}
        </StyledCharterModalRules>
        <CheckBox
          id="help-group-charter-accept"
          name="help-group-charter-accept"
          title={CHARTER_MODAL_CHECKBOX}
          value={isChecked}
          onChange={setIsChecked}
          useOutsideOfForm
        />
      </StyledCharterModalContent>
      <ModalFooter>
        <Button
          variant="default"
          onClick={onClose}
          dataTestId="charter-modal-cancel"
        >
          {COMPOSER_CANCEL_LABEL}
        </Button>
        <Button
          variant="primary"
          disabled={!isChecked}
          dataTestId="charter-modal-accept"
          onClick={() => {
            if (!isChecked) {
              return;
            }
            onClose?.();
            onAccept();
          }}
        >
          {CHARTER_MODAL_ACCEPT}
        </Button>
      </ModalFooter>
    </ModalGeneric>
  );
}
