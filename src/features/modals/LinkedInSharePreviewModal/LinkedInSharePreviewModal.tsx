import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Text } from '@/src/components/ui';
import { useModalContext } from '@/src/features/modals/Modal';
import { ModalGeneric } from '@/src/features/modals/Modal/ModalGeneric';
import { ModalFooter } from '@/src/features/modals/Modal/ModalGeneric/ModalFooter/ModalFooter';
import { Api } from 'src/api';
import { notificationsActions } from 'src/use-cases/notifications';

interface LinkedInSharePreviewModalProps {
  profileId: string;
  firstName: string;
  hasLinkedinLinked?: boolean;
  onTriggerOAuth?: () => Promise<void>;
}

export const LinkedInSharePreviewModal = ({
  profileId,
  firstName,
  hasLinkedinLinked = true,
  onTriggerOAuth,
}: LinkedInSharePreviewModalProps) => {
  const dispatch = useDispatch();
  const { onClose } = useModalContext();
  const [shareText, setShareText] = useState<string | null>(null);
  const [isLoadingText, setIsLoadingText] = useState(true);
  const [isSharing, setIsSharing] = useState(false);

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

  const handleShare = useCallback(async () => {
    setIsSharing(true);
    try {
      if (!hasLinkedinLinked && onTriggerOAuth) {
        await onTriggerOAuth();
        return;
      }
      await Api.postLinkedinShare(profileId);
      dispatch(
        notificationsActions.addNotification({
          type: 'success',
          message: 'Profil partagé sur LinkedIn avec succès !',
        })
      );
      onClose?.();
    } catch {
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message: 'Erreur lors du partage LinkedIn. Veuillez réessayer.',
        })
      );
    } finally {
      setIsSharing(false);
    }
  }, [dispatch, hasLinkedinLinked, onClose, onTriggerOAuth, profileId]);

  return (
    <ModalGeneric
      title={`Partager le profil de ${firstName} sur LinkedIn`}
      description="Vérifiez le message qui sera publié sur votre profil LinkedIn."
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
          disabled={isSharing}
          dataTestId="linkedin-share-cancel"
        >
          Annuler
        </Button>
        <Button
          variant="primary"
          onClick={handleShare}
          disabled={isLoadingText || isSharing}
          dataTestId="linkedin-share-confirm"
        >
          Partager
        </Button>
      </ModalFooter>
    </ModalGeneric>
  );
};
