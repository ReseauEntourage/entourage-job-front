import PropTypes from 'prop-types';
import React from 'react';

import { Button } from '@/src/components/ui';
import { useModalContext } from '@/src/features/modals/Modal';
import { ModalGeneric } from '@/src/features/modals/Modal/ModalGeneric';

export const ModalNotificationSending = ({ callback }) => {
  const { onClose } = useModalContext();

  return (
    <ModalGeneric
      description="Souhaitez-vous envoyer une notification au(x) binôme(s) ?"
      title="Envoi de notification"
    >
      <div className="uk-modal-footer uk-padding-remove-horizontal uk-padding-remove-bottom">
        <Button
          style="default"
          onClick={async () => {
            onClose();
            await callback({
              isValidated: true,
              isArchived: false,
              shouldSendNotifications: false,
            });
          }}
        >
          Ne pas envoyer
        </Button>
        <Button
          style="primary"
          onClick={async () => {
            onClose();
            await callback({
              isValidated: true,
              isArchived: false,
              shouldSendNotifications: true,
            });
          }}
        >
          Envoyer
        </Button>
      </div>
    </ModalGeneric>
  );
};

ModalNotificationSending.propTypes = {
  callback: PropTypes.func.isRequired,
};
