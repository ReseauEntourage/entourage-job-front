import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Text } from '@/src/components/ui';
import { useModalContext } from '@/src/features/modals/Modal';
import { ModalGeneric } from '@/src/features/modals/Modal/ModalGeneric';
import { ModalFooter } from '@/src/features/modals/Modal/ModalGeneric/ModalFooter/ModalFooter';
import { Api } from 'src/api';
import { notificationsActions } from 'src/use-cases/notifications';

interface WhatsAppSharePreviewModalProps {
  profileId: string;
  firstName: string;
}

export const WhatsAppSharePreviewModal = ({
  profileId,
  firstName,
}: WhatsAppSharePreviewModalProps) => {
  const dispatch = useDispatch();
  const { onClose } = useModalContext();
  const [shareText, setShareText] = useState<string | null>(null);
  const [isLoadingText, setIsLoadingText] = useState(true);

  useEffect(() => {
    Api.getProfileShareText(profileId)
      .then(({ data }) => setShareText(data.text))
      .catch(() => {
        dispatch(
          notificationsActions.addNotification({
            type: 'danger',
            message: 'Impossible de charger le texte de partage.',
          })
        );
        onClose?.();
      })
      .finally(() => setIsLoadingText(false));
  }, [dispatch, onClose, profileId]);

  const handleShare = () => {
    if (!shareText) {
      return;
    }
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      '_blank',
      'noopener,noreferrer'
    );
    onClose?.();
  };

  return (
    <ModalGeneric
      title={`Partager le profil de ${firstName} sur WhatsApp`}
      description="Vérifiez le message qui sera envoyé via WhatsApp."
      size="large"
    >
      {isLoadingText ? (
        <Text>Chargement du message…</Text>
      ) : (
        <div
          style={{
            whiteSpace: 'pre-wrap',
            background: '#f3f6f9',
            borderRadius: 8,
            padding: '16px',
            maxHeight: 320,
            overflowY: 'auto',
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          {shareText}
        </div>
      )}
      <ModalFooter>
        <Button
          variant="default"
          onClick={onClose}
          dataTestId="whatsapp-share-cancel"
        >
          Annuler
        </Button>
        <Button
          variant="primary"
          onClick={handleShare}
          disabled={isLoadingText}
          dataTestId="whatsapp-share-confirm"
        >
          Partager
        </Button>
      </ModalFooter>
    </ModalGeneric>
  );
};
