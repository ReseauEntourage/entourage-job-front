import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  currentUserActions,
  selectCurrentUser,
} from '../use-cases/current-user';
import { notificationsActions } from '../use-cases/notifications';
import { Api } from 'src/api';
import { getPusher, PUSHER_CHANNELS, PUSHER_EVENTS } from 'src/constants';

interface PusherResponse {
  success: boolean;
  error?: string;
  reason?: 'cancelled' | 'error';
}

interface UseProfileGenerationProps {
  onProfileGenerated?: () => void;
}

interface UseProfileGenerationReturn {
  generateProfileFromCV: () => Promise<void>;
  cancelProfileGeneration: () => Promise<void>;
  isLoading: boolean;
}

export const useProfileGeneration = ({
  onProfileGenerated,
}: UseProfileGenerationProps = {}): UseProfileGenerationReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const userId = user?.id;
  const jobIdRef = useRef<string | undefined>(undefined);
  const hasCancelledRef = useRef(false);

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

        // Notification tardive suite à une annulation (volontaire ou déjà
        // basculée en manuel côté front) : ignorée silencieusement.
        if (hasCancelledRef.current || response.reason === 'cancelled') {
          return;
        }

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
          // Refresh the user data to get the updated profile information
          dispatch(currentUserActions.fetchCurrentProfileCompleteRequested());
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
      hasCancelledRef.current = false;

      const response = await Api.getGenerateProfileFromCV();

      if (!response || response.status !== 200) {
        dispatchErrorNotification();
        return;
      }

      jobIdRef.current = response.data?.jobId;
    } catch {
      dispatchErrorNotification();
    }
  };

  // Fonction pour annuler la génération de profil en cours
  const cancelProfileGeneration = useCallback(async (): Promise<void> => {
    hasCancelledRef.current = true;
    setIsLoading(false);

    const jobId = jobIdRef.current;
    if (!jobId) {
      return;
    }

    try {
      await Api.cancelGenerateProfileFromCV(jobId);
    } catch {
      // Best-effort : l'utilisateur bascule en saisie manuelle dans tous les cas
    }
  }, []);

  return {
    generateProfileFromCV,
    cancelProfileGeneration,
    isLoading,
  };
};
