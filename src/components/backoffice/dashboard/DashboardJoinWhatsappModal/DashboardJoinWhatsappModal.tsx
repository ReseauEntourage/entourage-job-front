import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { useModalContext } from 'src/components/modals/Modal';
import { ModalGeneric } from 'src/components/modals/Modal/ModalGeneric';
import { Button, Img, SimpleLink } from 'src/components/utils';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { StyledImageContainer } from './DashboardJoinWhatsappModal.styles';

export const DashboardJoinWhatsappModal = () => {
  const { onClose } = useModalContext();
  const user = useAuthenticatedUser();

  return (
    <ModalGeneric title="Rejoindre note groupe Whatsapp">
      Pour recevoir des actualités et échanger avec les{' '}
      {user.role === UserRoles.COACH ? 'coachs' : 'candidats'} de votre région,
      scannez le QR code
      <StyledImageContainer>
        <SimpleLink href={user.whatsappZoneUrl} target="_blank">
          <Img
            src={user.whatsappZoneQR}
            alt="QR code Whatsapp"
            width={250}
            height={250}
          />
        </SimpleLink>
        <p>{user.whatsappZoneName}</p>
      </StyledImageContainer>
      <div className="uk-modal-footer uk-padding-remove-horizontal uk-padding-remove-bottom uk-margin-medium-top">
        <Button onClick={onClose} variant="default">
          Fermer
        </Button>
      </div>
    </ModalGeneric>
  );
};
