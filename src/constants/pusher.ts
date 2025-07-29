import Pusher from 'pusher-js';

export const PUSHER_CHANNELS = {
  PROFILE_GENERATION: 'profile-generation-channel',
};

export const PUSHER_EVENTS = {
  PROFILE_GENERATION_COMPLETE: 'profile-generation-complete',
};

// Configuration de Pusher
let pusherInstance: Pusher | null = null;

export const getPusher = (): Pusher => {
  if (!pusherInstance) {
    pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_API_KEY || '', {
      cluster: 'eu', // Ajustez selon votre configuration Pusher
      forceTLS: true,
    });
  }
  return pusherInstance;
};
