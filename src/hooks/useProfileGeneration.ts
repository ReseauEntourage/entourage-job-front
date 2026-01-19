import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { currentUserActions } from '../use-cases/current-user';
import { notificationsActions } from '../use-cases/notifications';
import { Api } from 'src/api';
import { getPusher, PUSHER_CHANNELS, PUSHER_EVENTS } from 'src/constants';
import { useAuthenticatedUser } from './authentication/useAuthenticatedUser';

interface PusherResponse {
  success: boolean;
  error?: string;
}

interface UseProfileGenerationProps {
  onProfileGenerated?: () => void;
}

export interface UseProfileGenerationReturn {
  generateProfileFromCV: () => Promise<void>;
  isLoading: boolean;
}

export const useProfileGeneration = ({
  onProfileGenerated,
}: UseProfileGenerationProps = {}): UseProfileGenerationReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useAuthenticatedUser();
  const userId = user.id;

  const dispatchErrorNotification = useCallback(() => {
    dispatch(
      notificationsActions.addNotification({
        type: 'danger',
        message:
          'Une erreur est survenue lors de la génération du profil. Veuillez réessayer.',
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    // Abonnement au channel Pusher
    const pusher = getPusher();
    const channel = pusher.subscribe(
      `${PUSHER_CHANNELS.PROFILE_GENERATION}-${userId}`
    );

    // Configurer l'écouteur d'événement
    channel.bind(
      PUSHER_EVENTS.PROFILE_GENERATION_COMPLETE,
      (response: PusherResponse) => {
        setIsLoading(false);

        // Erreur
        if (response.error) {
          dispatchErrorNotification();
        }
        // Success
        else {
          if (onProfileGenerated) {
            onProfileGenerated();
          }
          dispatch(
            notificationsActions.addNotification({
              type: 'success',
              message: 'Votre profil a été généré avec succès !',
            })
          );
          dispatch(currentUserActions.fetchUserRequested());
        }
      }
    );

    // Nettoyage lors du démontage
    return () => {
      channel.unbind(PUSHER_EVENTS.PROFILE_GENERATION_COMPLETE);
      pusher.unsubscribe(`${PUSHER_CHANNELS.PROFILE_GENERATION}-${userId}`);
    };
  }, [userId, dispatch, dispatchErrorNotification, onProfileGenerated]);

  // Fonction pour déclencher la génération de profil
  const generateProfileFromCV = async (): Promise<void> => {
    try {
      setIsLoading(true);

      const response = await Api.getGenerateProfileFromCV();

      if (!response || response.status !== 200) {
        dispatchErrorNotification();
      }
    } catch {
      dispatchErrorNotification();
    }
  };

  return {
    generateProfileFromCV,
    isLoading,
  };
};
