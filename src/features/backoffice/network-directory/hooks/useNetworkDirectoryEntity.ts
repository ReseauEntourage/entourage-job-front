import { NetworkDirectoryEntity } from '@/src/constants/network-directory';
import { useEntity } from '@/src/hooks/queryParams/useEntity';

/**
 * Returns the active entity type for the network directory
 * from the `entity` URL query param.
 *
 * Falls back to `NetworkDirectoryEntity.USER` when no query param is set.
 *
 * @returns The entity filter from the URL, or `NetworkDirectoryEntity.USER` by default.
 */
export function useNetworkDirectoryEntity() {
  const entityFilter = useEntity();

  return entityFilter || NetworkDirectoryEntity.USER;
}
