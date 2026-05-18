import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Text } from '@/src/components/ui';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { currentUserActions } from '@/src/use-cases/current-user';
import { ProfilePartCard } from '../Card/Card/Card';
import { Api } from 'src/api';
import { notificationsActions } from 'src/use-cases/notifications';

interface ProfileLinkedInConnectProps {
  smallCard?: boolean;
}

export const ProfileLinkedInConnect = ({
  smallCard,
}: ProfileLinkedInConnectProps) => {
  const dispatch = useDispatch();
  const user = useAuthenticatedUser();
  const [isLoading, setIsLoading] = useState(false);

  const hasLinkedinLinked = user?.hasLinkedinLinked ?? false;

  const handleLink = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await Api.getLinkedinOAuthUrl();
      window.location.href = data.url;
    } catch {
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message: 'Une erreur est survenue. Veuillez réessayer.',
        })
      );
      setIsLoading(false);
    }
  }, [dispatch]);

  const handleUnlink = useCallback(async () => {
    setIsLoading(true);
    try {
      await Api.deleteLinkedinLink();
      dispatch(
        notificationsActions.addNotification({
          type: 'success',
          message: 'Compte LinkedIn délié avec succès.',
        })
      );
      dispatch(currentUserActions.fetchUserRequested());
    } catch {
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message: 'Une erreur est survenue. Veuillez réessayer.',
        })
      );
      setIsLoading(false);
    }
  }, [dispatch]);

  return (
    <ProfilePartCard
      title="Liez votre compte LinkedIn"
      smallCard={smallCard}
      isCompleted={hasLinkedinLinked}
      isEmpty={false}
    >
      {hasLinkedinLinked ? (
        <>
          <Text>
            Votre compte LinkedIn est lié. Vous pouvez partager des profils de
            candidats directement depuis leurs fiches.
          </Text>
          <Button
            variant="secondary"
            size="small"
            onClick={handleUnlink}
            disabled={isLoading}
          >
            Délier mon compte LinkedIn
          </Button>
        </>
      ) : (
        <>
          <Text>
            Liez votre compte LinkedIn pour partager des profils de candidats
            directement depuis Entourage Pro.
          </Text>
          <Button
            variant="secondary"
            size="small"
            onClick={handleLink}
            disabled={isLoading}
          >
            Lier mon compte LinkedIn
          </Button>
        </>
      )}
    </ProfilePartCard>
  );
};
