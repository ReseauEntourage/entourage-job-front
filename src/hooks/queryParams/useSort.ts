import { useRouter } from 'next/router';
import { NetworkDirectorySort } from '@/src/constants/network-directory';

export function useSort() {
  const {
    query: { sort },
  } = useRouter();

  return sort as NetworkDirectorySort;
}
