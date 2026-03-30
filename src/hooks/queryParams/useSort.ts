import { useRouter } from 'next/router';

export function useSort() {
  const {
    query: { sort },
  } = useRouter();

  return sort;
}
