import { useRouter } from 'next/router';

export function useInternalMessageId() {
  const {
    query: { internalMessageId },
  } = useRouter();

  return internalMessageId as string;
}
