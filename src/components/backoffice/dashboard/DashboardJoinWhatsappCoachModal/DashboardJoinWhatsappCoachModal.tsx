import React, { useMemo } from 'react';

import { useModalContext } from 'src/components/modals/Modal';
import { ModalGeneric } from 'src/components/modals/Modal/ModalGeneric';
import { Button, Img, SimpleLink } from 'src/components/utils';
import { WhatsappCoach } from 'src/constants/whatsapps-coach';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { StyledImageContainer } from './DashboardJoinWhatsappCoachModal.styles';

export const DashboardJoinWhatsappCoachModal = () => {
  const { onClose } = useModalContext();
  const user = useAuthenticatedUser();

  const whatsappCoach = useMemo(() => {
    return WhatsappCoach[user.zone];
  }, [user.zone]);

  return (
    <ModalGeneric title="Rejoindre note groupe Whatsapp">
      Pour recevoir des actualités et échanger avec les coachs de votre région,
      scannez le QR code
      <StyledImageContainer>
        <SimpleLink href={whatsappCoach.url} target="_blank">
          <Img
            src={whatsappCoach.qrcode_url}
            alt="QR code Whatsapp"
            width={250}
            height={250}
          />
        </SimpleLink>
      </StyledImageContainer>
      <div className="uk-modal-footer uk-padding-remove-horizontal uk-padding-remove-bottom uk-margin-medium-top">
        <Button onClick={onClose} style="default">
          Fermer
        </Button>
      </div>
    </ModalGeneric>
  );
};
