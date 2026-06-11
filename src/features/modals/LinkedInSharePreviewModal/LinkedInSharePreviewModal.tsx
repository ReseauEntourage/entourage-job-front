import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { isLinkedinShareDuplicateError } from '@/src/api/axiosErrors';
import { Alert, Button, Text } from '@/src/components/ui';
import { AlertType } from '@/src/components/ui/Alert/Alert.types';
import { LinkedInPostWhatsAppInviteModal } from '@/src/features/modals/LinkedInPostWhatsAppInviteModal/LinkedInPostWhatsAppInviteModal';
import { useModalContext } from '@/src/features/modals/Modal';
import { ModalGeneric } from '@/src/features/modals/Modal/ModalGeneric';
import { ModalFooter } from '@/src/features/modals/Modal/ModalGeneric/ModalFooter/ModalFooter';
import { openModal } from '@/src/features/modals/Modal/openModal';
import { Api } from 'src/api';
import { notificationsActions } from 'src/use-cases/notifications';
import { LinkedInMentionEditor } from './LinkedInMentionEditor';
import { StyledContentContainer } from './LinkedInSharePreviewModal.styles';

const MENTION_REGEX = /@\[[^\]]+\]\([^)]+\)/g;

function hasInvalidParentheses(text: string): boolean {
  const withoutMentions = text.replace(MENTION_REGEX, '');
  return /[()]/.test(withoutMentions);
}

interface LinkedInSharePreviewModalProps {
  profileId: string;
  firstName: string;
  hasLinkedinLinked?: boolean;
  onTriggerOAuth?: () => Promise<void>;
  hasAlreadySharedWhatsapp?: boolean;
}

export const LinkedInSharePreviewModal = ({
  profileId,
  firstName,
  hasLinkedinLinked = true,
  onTriggerOAuth,
  hasAlreadySharedWhatsapp = false,
}: LinkedInSharePreviewModalProps) => {
  const dispatch = useDispatch();
  const { onClose } = useModalContext();
  const [shareText, setShareText] = useState<string | null>(null);
  const [editedText, setEditedText] = useState<string | null>(null);
  const [isLoadingText, setIsLoadingText] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  useEffect(() => {
    Api.getProfileShareText(profileId, 'linkedin')
      .then(({ data }) => {
        setShareText(data.text);
        setEditedText(data.text);
      })
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

  const hasParensError = editedText ? hasInvalidParentheses(editedText) : false;

  const handleShare = useCallback(async () => {
    setShareError(null);
    setIsSharing(true);
    try {
      if (!hasLinkedinLinked && onTriggerOAuth) {
        if (editedText) {
          localStorage.setItem(`pendingLinkedinText_${profileId}`, editedText);
        }
        await onTriggerOAuth();
        return;
      }
      const { data } = await Api.postLinkedinShare(
        profileId,
        editedText ?? undefined
      );

      onClose?.();
      if (!hasAlreadySharedWhatsapp && data.linkedinPostUrl) {
        openModal(
          <LinkedInPostWhatsAppInviteModal
            firstName={firstName}
            linkedinPostUrl={data.linkedinPostUrl}
          />
        );
      } else {
        dispatch(
          notificationsActions.addNotification({
            type: 'success',
            message: `Merci pour ce coup de pouce ! Votre partage peut changer la donne pour ${firstName}.`,
          })
        );
      }
    } catch (error) {
      setShareError(
        isLinkedinShareDuplicateError(error)
          ? 'Ce profil a déjà été partagé récemment sur LinkedIn. LinkedIn peut limiter la fréquence de partage du même contenu. Veuillez réessayer plus tard.'
          : 'Erreur lors du partage LinkedIn. Veuillez réessayer.'
      );
    } finally {
      setIsSharing(false);
    }
  }, [
    dispatch,
    editedText,
    firstName,
    hasAlreadySharedWhatsapp,
    hasLinkedinLinked,
    onClose,
    onTriggerOAuth,
    profileId,
  ]);

  return (
    <ModalGeneric
      title={`Partager le profil de ${firstName} sur LinkedIn`}
      description="Voici un message pré-rempli pour vous faire gagner du temps. Modifiez-le librement avant de publier sur votre profil LinkedIn."
      size="large"
    >
      <StyledContentContainer>
        {isLoadingText ? (
          <Text>Chargement du message…</Text>
        ) : shareText ? (
          <LinkedInMentionEditor
            initialText={shareText}
            onChange={setEditedText}
          />
        ) : null}
        {hasParensError && (
          <Alert type={AlertType.Error} icon={null}>
            Le message ne peut pas contenir de parenthèses. Veuillez les
            supprimer avant de partager.
          </Alert>
        )}
        {shareError && (
          <Alert type={AlertType.Error} icon={null}>
            {shareError}
          </Alert>
        )}
      </StyledContentContainer>
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
          disabled={isLoadingText || isSharing || hasParensError}
          dataTestId="linkedin-share-confirm"
        >
          Partager
        </Button>
      </ModalFooter>
    </ModalGeneric>
  );
};
