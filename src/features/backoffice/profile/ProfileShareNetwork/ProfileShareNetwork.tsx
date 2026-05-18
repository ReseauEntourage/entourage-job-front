import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { SvgIcon } from '@/assets/icons/icons';
import { Button, Text } from '@/src/components/ui';
import { COLORS } from '@/src/constants/styles';
import { LinkedInSharePreviewModal } from '@/src/features/modals/LinkedInSharePreviewModal/LinkedInSharePreviewModal';
import { openModal } from '@/src/features/modals/Modal/openModal';
import { ProfilePartCard } from '@/src/features/profile/ProfilePartCards/Card/Card/Card';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
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
  const [isLinkedinLoading, setIsLinkedinLoading] = useState(false);
  const [isWhatsappLoading, setIsWhatsappLoading] = useState(false);

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
    openModal(
      <LinkedInSharePreviewModal
        profileId={profile.id}
        firstName={profile.firstName}
      />
    );
    router.replace(`/backoffice/profile/${profile.id}`, undefined, {
      shallow: true,
    });
  }, [router.isReady]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleWhatsappShare = useCallback(async () => {
    setIsWhatsappLoading(true);
    try {
      const { data } = await Api.getProfileShareText(profile.id);
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
  }, [dispatch, profile.id]);

  const handleLinkedinShare = useCallback(async () => {
    if (!user.hasLinkedinLinked) {
      setIsLinkedinLoading(true);
      try {
        const { data } = await Api.getLinkedinOAuthUrl(profile.id);
        window.location.href = data.url;
      } catch {
        dispatch(
          notificationsActions.addNotification({
            type: 'danger',
            message: 'Une erreur est survenue. Veuillez réessayer.',
          })
        );
        setIsLinkedinLoading(false);
      }
      return;
    }

    openModal(
      <LinkedInSharePreviewModal
        profileId={profile.id}
        firstName={profile.firstName}
      />
    );
  }, [dispatch, profile.id, profile.firstName, user.hasLinkedinLinked]);

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
        disabled={isLinkedinLoading}
        prependIcon={
          <SvgIcon
            name="LinkedIn"
            width={15}
            height={15}
            color={COLORS.primaryBlue}
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
          <svg
            width={15}
            height={15}
            viewBox="0 0 50 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M25,2C12.318,2,2,12.318,2,25c0,3.96,1.023,7.854,2.963,11.29L2.037,46.73c-0.096,0.343-0.003,0.711,0.245,0.966 C2.473,47.893,2.733,48,3,48c0.08,0,0.161-0.01,0.24-0.029l10.896-2.699C17.463,47.058,21.21,48,25,48c12.682,0,23-10.318,23-23 S37.682,2,25,2z M36.57,33.116c-0.492,1.362-2.852,2.605-3.986,2.772c-1.018,0.149-2.306,0.213-3.72-0.231 c-0.857-0.27-1.957-0.628-3.366-1.229c-5.923-2.526-9.791-8.415-10.087-8.804C15.116,25.235,13,22.463,13,19.594 s1.525-4.28,2.067-4.864c0.542-0.584,1.181-0.73,1.575-0.73s0.787,0.005,1.132,0.021c0.363,0.018,0.85-0.137,1.329,1.001 c0.492,1.168,1.673,4.037,1.819,4.33c0.148,0.292,0.246,0.633,0.05,1.022c-0.196,0.389-0.294,0.632-0.59,0.973 s-0.62,0.76-0.886,1.022c-0.296,0.291-0.603,0.606-0.259,1.19c0.344,0.584,1.529,2.493,3.285,4.039 c2.255,1.986,4.158,2.602,4.748,2.894c0.59,0.292,0.935,0.243,1.279-0.146c0.344-0.39,1.476-1.703,1.869-2.286 s0.787-0.487,1.329-0.292c0.542,0.194,3.445,1.604,4.035,1.896c0.59,0.292,0.984,0.438,1.132,0.681 C37.062,30.587,37.062,31.755,36.57,33.116z"
              fill="#25D366"
            />
          </svg>
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
