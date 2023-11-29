import { useRouter } from 'next/router';
import { AdminOffersTags } from 'src/constants';

export function useTag() {
  const {
    query: { tag },
  } = useRouter();

  return tag as AdminOffersTags;
}
