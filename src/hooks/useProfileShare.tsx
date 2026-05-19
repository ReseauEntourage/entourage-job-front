import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { LinkedInSharePreviewModal } from '@/src/features/modals/LinkedInSharePreviewModal/LinkedInSharePreviewModal';
import { openModal } from '@/src/features/modals/Modal/openModal';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { Api } from 'src/api';
import { notificationsActions } from 'src/use-cases/notifications';

interface UseProfileShareOptions {
  profileId: string;
  firstName: string;
}

export const useProfileShare = ({
  profileId,
  firstName,
}: UseProfileShareOptions) => {
  const dispatch = useDispatch();
  const user = useAuthenticatedUser();
  const [isWhatsappLoading, setIsWhatsappLoading] = useState(false);

  const handleWhatsappShare = useCallback(async () => {
    setIsWhatsappLoading(true);
    try {
      const { data } = await Api.getProfileShareText(profileId);
      const url = `https://wa.me/?text=${encodeURIComponent(data.text)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message: 'Une erreur est survenue. Veuillez réessayer.',
        })
      );
    } finally {
      setIsWhatsappLoading(false);
    }
  }, [dispatch, profileId]);

  const handleTriggerOAuth = useCallback(async () => {
    const { data } = await Api.getLinkedinOAuthUrl(profileId);
    window.location.href = data.url;
  }, [profileId]);

  const handleLinkedinShare = useCallback(() => {
    openModal(
      <LinkedInSharePreviewModal
        profileId={profileId}
        firstName={firstName}
        hasLinkedinLinked={user.hasLinkedinLinked}
        onTriggerOAuth={handleTriggerOAuth}
      />
    );
  }, [profileId, firstName, user.hasLinkedinLinked, handleTriggerOAuth]);

  return {
    handleWhatsappShare,
    handleLinkedinShare,
    isWhatsappLoading,
  };
};
