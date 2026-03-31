import { NetworkDirectorySort } from '@/src/constants/network-directory';
import { useSort } from '@/src/hooks/queryParams/useSort';

/**
 * Returns the active sort order for the network directory
 * from the `sort` URL query param.
 *
 * Falls back to `NetworkDirectorySort.LAST_CONNECTION` when no query param is set.
 *
 * @returns The sort value from the URL, or `NetworkDirectorySort.LAST_CONNECTION` by default.
 */
export function useNetworkDirectorySort() {
  const sortQueryParam = useSort();

  return sortQueryParam || NetworkDirectorySort.LAST_CONNECTION;
}
