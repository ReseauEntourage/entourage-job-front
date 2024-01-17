import { useRouter } from 'next/router';

export const useUserId = () => {
  const {
    query: { userId },
  } = useRouter();

  return userId as string;
};
