import { useRouter } from 'next/router';

export const useEventId = () => {
  const {
    query: { eventId },
  } = useRouter();

  return eventId as string;
};
