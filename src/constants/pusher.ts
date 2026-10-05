import Pusher from 'pusher-js';
import { STORAGE_KEYS } from './storage';

export const PUSHER_CHANNELS = {
  PROFILE_GENERATION: 'profile-generation-channel',
  EMBEDDING: 'embedding-channel',
};

export const PUSHER_EVENTS = {
  PROFILE_GENERATION_COMPLETE: 'profile-generation-complete',
  EMBEDDING_READY: 'embedding-ready',
  // Help groups: the payload only carries ids, never any content
  REPLY_CREATED: 'reply-created',
  REPLY_UPDATED: 'reply-updated',
  REPLY_DELETED: 'reply-deleted',
  REACTIONS_UPDATED: 'reactions-updated',
  DISCUSSION_UPDATED: 'discussion-updated',
  DISCUSSION_DELETED: 'discussion-deleted',
};

/**
 * Private channel of a help group discussion: subscribing needs an
 * authorization from the back (`POST /pusher/auth`), given to logged-in
 * users who can read the discussion.
 */
export const getPostPrivateChannel = (postId: string) =>
  `private-post-${postId}`;

export type PostRealtimePayload = {
  discussionId: string;
  replyId?: string;
  targetId?: string;
};

// Configuration de Pusher
let pusherInstance: Pusher | null = null;

export const getPusher = (): Pusher => {
  if (!pusherInstance) {
    pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_API_KEY || '', {
      cluster: 'eu', // Ajustez selon votre configuration Pusher
      forceTLS: true,
      // Only called for `private-` channels: the public ones are unchanged.
      // The headers are read at each authorization, to follow the token
      // renewal.
      channelAuthorization: {
        endpoint: `${process.env.NEXT_PUBLIC_API_URL}/pusher/auth`,
        transport: 'ajax',
        headersProvider: () => {
          const token =
            typeof window !== 'undefined'
              ? window.localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
              : null;
          return token ? { Authorization: `Bearer ${token}` } : {};
        },
      },
    });
  }
  return pusherInstance;
};
