import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { ContactTypeEnum } from '@/src/constants/contactTypes';
import {
  NetworkDirectoryEntity,
  NetworkDirectorySort,
} from '@/src/constants/network-directory';
import { UserRoles } from '@/src/constants/users';
import { useNetworkDirectoryEntity } from './useNetworkDirectoryEntity';
import { useNetworkDirectoryRole } from './useNetworkDirectoryRole';
import { useNetworkDirectorySort } from './useNetworkDirectorySort';

export type NetworkDirectoryQueryParams = {
  role: UserRoles;
  search?: string;
  nudgeIds: string[];
  departments: string[];
  businessSectorIds: string[];
  contactTypes: ContactTypeEnum | ContactTypeEnum[];
  entity: NetworkDirectoryEntity;
  isAvailable?: boolean;
  sort?: NetworkDirectorySort;
};

export type NetworkDirectorySortFilters = {
  key: 'sorts';
  constants: { value: NetworkDirectorySort; label: string }[];
  title: string;
};

/**
 * Aggregates all active filter and sort parameters for the network directory
 * into a single typed object.
 *
 * Reads `role`, `entity`, and `sort` via their dedicated hooks
 * (`useNetworkDirectoryRole`, `useNetworkDirectoryEntity`, `useNetworkDirectorySort`)
 * which each provide safe defaults. The remaining params (`search`, `nudgeIds`,
 * `businessSectorIds`, `departments`, `contactTypes`, `isAvailable`) are read
 * directly from the router query and normalised.
 *
 * Array query params (`businessSectorIds`, `departments`) are normalised so that
 * a single string value is always returned as a one-element array.
 *
 * @returns A `NetworkDirectoryQueryParams` object ready to be dispatched as API filters.
 */
export function useNetworkDirectoryQueryParams() {
  const role = useNetworkDirectoryRole();
  const entity = useNetworkDirectoryEntity();
  const sort = useNetworkDirectorySort();
  const {
    query: {
      search,
      nudgeIds,
      businessSectorIds,
      departments,
      contactTypes,
      isAvailable,
    },
  } = useRouter();

  const normalizeBusinessSectorIds = useCallback((): string[] => {
    if (!businessSectorIds) {
      return [];
    }
    if (Array.isArray(businessSectorIds)) {
      return businessSectorIds as string[];
    }
    return [businessSectorIds as string];
  }, [businessSectorIds]);

  const normalizeDepartments = useCallback((): string[] => {
    if (!departments) {
      return [];
    }
    if (Array.isArray(departments)) {
      return departments as string[];
    }
    return [departments as string];
  }, [departments]);

  const queryParams: NetworkDirectoryQueryParams = {
    role,
    nudgeIds: (nudgeIds || []) as string[],
    businessSectorIds: normalizeBusinessSectorIds(),
    departments: normalizeDepartments(),
    contactTypes: (contactTypes || []) as ContactTypeEnum[],
    entity: entity
      ? (entity as NetworkDirectoryEntity)
      : NetworkDirectoryEntity.USER,
    ...(sort
      ? { sort: sort as NetworkDirectorySort }
      : { sort: NetworkDirectorySort.LAST_CONNECTION }),
    ...(isAvailable === 'true' ? { isAvailable: true } : {}),
  };

  if (search) {
    return { ...queryParams, search: search as string };
  }

  return queryParams;
}
