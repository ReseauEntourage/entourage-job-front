import React from 'react';

import ModalGeneric from 'src/components/modals/Modal/ModalGeneric';
import { Button } from 'src/components/utils';
import { useModalContext } from 'src/components/modals/Modal';
import PropTypes from 'prop-types';

const ModalNotificationSending = ({ callback }) => {
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

export default ModalNotificationSending;
