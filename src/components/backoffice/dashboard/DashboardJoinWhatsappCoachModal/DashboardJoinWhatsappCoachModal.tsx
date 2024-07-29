import React from 'react';

import { useModalContext } from 'src/components/modals/Modal';
import { ModalGeneric } from 'src/components/modals/Modal/ModalGeneric';
import { Button, Img, SimpleLink } from 'src/components/utils';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { StyledImageContainer } from './DashboardJoinWhatsappCoachModal.styles';

export const DashboardJoinWhatsappCoachModal = () => {
  const { onClose } = useModalContext();
  const user = useAuthenticatedUser();

  return (
    <ModalGeneric title="Rejoindre note groupe Whatsapp">
      Pour recevoir des actualités et échanger avec les coachs de votre région,
      scannez le QR code
      <StyledImageContainer>
        <SimpleLink href={user.whatsappJoinUrl.url} target="_blank">
          <Img
            src={user.whatsappJoinUrl.qrcode_url}
            alt="QR code Whatsapp"
            width={250}
            height={250}
          />
        </SimpleLink>
        <p>{user.whatsappJoinUrl.name}</p>
      </StyledImageContainer>
      <div className="uk-modal-footer uk-padding-remove-horizontal uk-padding-remove-bottom uk-margin-medium-top">
        <Button onClick={onClose} style="default">
          Fermer
        </Button>
      </div>
    </ModalGeneric>
  );
};
