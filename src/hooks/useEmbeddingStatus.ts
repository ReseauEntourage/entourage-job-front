import { useEffect } from 'react';
import { getPusher, PUSHER_CHANNELS, PUSHER_EVENTS } from 'src/constants';
import { useAuthenticatedUser } from './authentication/useAuthenticatedUser';

interface UseEmbeddingStatusProps {
  onReady: () => void;
  enabled?: boolean;
}

export const useEmbeddingStatus = ({
  onReady,
  enabled = true,
}: UseEmbeddingStatusProps): void => {
  const user = useAuthenticatedUser();
  const userId = user?.id;

  useEffect(() => {
    if (!enabled || !userId) {
      return;
    }

    const pusher = getPusher();
    const channelName = `${PUSHER_CHANNELS.EMBEDDING}-${userId}`;
    const channel = pusher.subscribe(channelName);

    channel.bind(PUSHER_EVENTS.EMBEDDING_READY, () => {
      onReady();
    });

    return () => {
      channel.unbind(PUSHER_EVENTS.EMBEDDING_READY);
      pusher.unsubscribe(channelName);
    };
  }, [enabled, userId, onReady]);
};
