import { useRouter } from 'next/router';

export function useMemberId() {
  const {
    query: { memberId },
  } = useRouter();

  return memberId as string;
}
