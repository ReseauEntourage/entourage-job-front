import { useRouter } from 'next/router';

export function useTab() {
  const {
    query: { tab },
  } = useRouter();

  return tab as string;
}
