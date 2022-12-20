import { useRouter } from 'next/router';

export function useOpportunityType() {
  const {
    query: { type },
  } = useRouter();

  return type;
}
