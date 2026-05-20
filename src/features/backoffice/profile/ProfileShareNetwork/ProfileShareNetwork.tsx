import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SvgIcon } from '@/assets/icons/icons';
import { Button, Text } from '@/src/components/ui';
import { COLORS } from '@/src/constants/styles';
import { UserRoles } from '@/src/constants/users';
import { LinkedInPostWhatsAppInviteModal } from '@/src/features/modals/LinkedInPostWhatsAppInviteModal/LinkedInPostWhatsAppInviteModal';
import { openModal } from '@/src/features/modals/Modal/openModal';
import { ProfilePartCard } from '@/src/features/profile/ProfilePartCards/Card/Card/Card';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useProfileShare } from '@/src/hooks/useProfileShare';
import { Api } from 'src/api';
import { currentUserActions } from 'src/use-cases/current-user';
import { notificationsActions } from 'src/use-cases/notifications';

interface ProfileShareNetworkProps {
  profile: {
    id: string;
    firstName: string;
  };
}

export const ProfileShareNetwork = ({ profile }: ProfileShareNetworkProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useAuthenticatedUser();
  const {
    handleWhatsappShare,
    handleLinkedinShare,
    hasSharedWhatsapp,
    isWhatsappLoading,
  } = useProfileShare({ profileId: profile.id, firstName: profile.firstName });

  useEffect(() => {
    if (!router.isReady || !router.query.linkedinJustConnected) {
      return;
    }

    dispatch(currentUserActions.fetchUserRequested());
    dispatch(
      notificationsActions.addNotification({
        type: 'success',
        message: 'Compte LinkedIn lié avec succès !',
      })
    );
    const pendingTextKey = `pendingLinkedinText_${profile.id}`;
    const customText = localStorage.getItem(pendingTextKey) ?? undefined;
    localStorage.removeItem(pendingTextKey);
    Api.postLinkedinShare(profile.id, customText)
      .then(({ data }) => {
        dispatch(
          notificationsActions.addNotification({
            type: 'success',
            message: 'Profil partagé sur LinkedIn avec succès !',
          })
        );
        if (!hasSharedWhatsapp && data.linkedinPostUrl) {
          openModal(
            <LinkedInPostWhatsAppInviteModal
              firstName={profile.firstName}
              linkedinPostUrl={data.linkedinPostUrl}
            />
          );
        }
      })
      .catch(() => {
        dispatch(
          notificationsActions.addNotification({
            type: 'danger',
            message: 'Erreur lors du partage LinkedIn. Veuillez réessayer.',
          })
        );
      });
    router.replace(`/backoffice/profile/${profile.id}`, undefined, {
      shallow: true,
    });
  }, [router.isReady]); // eslint-disable-line react-hooks/exhaustive-deps

  if (user.role === UserRoles.CANDIDATE) {
    return null;
  }

  return (
    <ProfilePartCard
      title="Mobiliser mon réseau"
      smallCard={false}
      isCompleted={false}
      isEmpty={false}
    >
      <Text>
        Faites connaître {profile.firstName} à votre réseau professionnel
      </Text>
      <Button
        variant="secondary"
        size="medium"
        onClick={handleLinkedinShare}
        prependIcon={
          <SvgIcon
            name="LinkedIn"
            width={15}
            height={15}
            color={COLORS.linkedInBlue}
          />
        }
      >
        Partager sur LinkedIn
      </Button>
      <Button
        variant="secondary"
        size="medium"
        onClick={handleWhatsappShare}
        disabled={isWhatsappLoading}
        prependIcon={
          <SvgIcon
            name="Whatsapp"
            width={15}
            height={15}
            color={COLORS.whatsAppGreen}
          />
        }
      >
        Partager sur WhatsApp
      </Button>
      <Text size="small" center>
        ✨ Un message personnalisé sera pré-rempli
      </Text>
    </ProfilePartCard>
  );
};
