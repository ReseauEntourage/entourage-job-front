import { useRouter } from 'next/router';

export function useSort() {
  const {
    query: { sort },
  } = useRouter();

  return Array.isArray(sort) ? sort[0] : sort;
}
