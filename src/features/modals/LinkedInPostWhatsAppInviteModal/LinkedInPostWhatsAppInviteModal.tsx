import React, { useState } from 'react';
import { Text, Button, CopyInput, LucidIcon } from '@/src/components/ui';
import { useModalContext } from '@/src/features/modals/Modal';
import { ModalGeneric } from '@/src/features/modals/Modal/ModalGeneric';
import { ModalFooter } from '@/src/features/modals/Modal/ModalGeneric/ModalFooter/ModalFooter';
import { StyledContentContainer } from './LinkedInPostWhatsAppInviteModal.styles';

interface LinkedInPostWhatsAppInviteModalProps {
  firstName: string;
  linkedinPostUrl: string;
}

export const LinkedInPostWhatsAppInviteModal = ({
  firstName,
  linkedinPostUrl,
}: LinkedInPostWhatsAppInviteModalProps) => {
  const { onClose } = useModalContext();
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = () => {
    setIsSharing(true);
    const message = `J'ai partagé le profil de ${firstName} sur LinkedIn. Likez ou repartagez pour lui donner de la visibilité !\n${linkedinPostUrl}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer'
    );
    setIsSharing(false);
    onClose?.();
  };

  return (
    <ModalGeneric
      title={
        <>
          <LucidIcon name="PartyPopper" size={25} /> Votre publication a été
          partagée sur LinkedIn !
        </>
      }
      size="medium"
    >
      <StyledContentContainer>
        <Text>
          Partagez votre publication au groupe WhatsApp des coachs — un like ou
          un repartage peut tout changer pour {firstName}.
        </Text>
        <CopyInput
          value={linkedinPostUrl}
          label="Lien vers votre publication LinkedIn"
        />
      </StyledContentContainer>
      <ModalFooter>
        <Button
          variant="default"
          onClick={onClose}
          dataTestId="linkedin-whatsapp-invite-later"
        >
          Plus tard
        </Button>
        <Button
          variant="primary"
          onClick={handleShare}
          disabled={isSharing}
          dataTestId="linkedin-whatsapp-invite-share"
        >
          Partager sur WhatsApp
        </Button>
      </ModalFooter>
    </ModalGeneric>
  );
};
