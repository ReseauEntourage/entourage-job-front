import { renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import { ContactTypeEnum } from '@/src/constants/contactTypes';
import {
  NetworkDirectoryEntity,
  NetworkDirectorySort,
} from '@/src/constants/network-directory';
import { UserRoles } from '@/src/constants/users';
import { useNetworkDirectoryEntity } from '../useNetworkDirectoryEntity';
import { useNetworkDirectoryQueryParams } from '../useNetworkDirectoryQueryParams';
import { useNetworkDirectoryRole } from '../useNetworkDirectoryRole';
import { useNetworkDirectorySort } from '../useNetworkDirectorySort';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));

const mockQuery = (query: Record<string, unknown>) =>
  (useRouter as jest.Mock).mockReturnValue({ query });

describe('network directory query param hooks', () => {
  it('defaults the role to coach, and takes the first role of an array', () => {
    mockQuery({});
    expect(renderHook(() => useNetworkDirectoryRole()).result.current).toBe(
      UserRoles.COACH
    );
    mockQuery({ role: [UserRoles.CANDIDATE, UserRoles.COACH] });
    expect(renderHook(() => useNetworkDirectoryRole()).result.current).toBe(
      UserRoles.CANDIDATE
    );
  });

  it('defaults the entity to user', () => {
    mockQuery({});
    expect(renderHook(() => useNetworkDirectoryEntity()).result.current).toBe(
      NetworkDirectoryEntity.USER
    );
    mockQuery({ entity: 'company' });
    expect(renderHook(() => useNetworkDirectoryEntity()).result.current).toBe(
      NetworkDirectoryEntity.COMPANY
    );
  });

  it('defaults the sort to relevance', () => {
    mockQuery({});
    expect(renderHook(() => useNetworkDirectorySort()).result.current).toBe(
      NetworkDirectorySort.RELEVANCE
    );
    mockQuery({ sort: 'lastConnection' });
    expect(renderHook(() => useNetworkDirectorySort()).result.current).toBe(
      NetworkDirectorySort.LAST_CONNECTION
    );
  });
});

describe('useNetworkDirectoryQueryParams', () => {
  it('returns safe defaults on an empty URL', () => {
    mockQuery({});
    const { result } = renderHook(() => useNetworkDirectoryQueryParams());
    expect(result.current).toEqual({
      role: UserRoles.COACH,
      nudgeIds: [],
      businessSectorIds: [],
      departments: [],
      contactTypes: [],
      entity: NetworkDirectoryEntity.USER,
      sort: NetworkDirectorySort.RELEVANCE,
    });
  });

  it('wraps single string params in arrays and keeps arrays as is', () => {
    mockQuery({
      businessSectorIds: 'sector-1',
      departments: ['Paris (75)', 'Nord (59)'],
      nudgeIds: ['n1'],
      contactTypes: ContactTypeEnum.REMOTE,
    });
    const { result } = renderHook(() => useNetworkDirectoryQueryParams());
    expect(result.current.businessSectorIds).toEqual(['sector-1']);
    expect(result.current.departments).toEqual(['Paris (75)', 'Nord (59)']);
    expect(result.current.nudgeIds).toEqual(['n1']);
    expect(result.current.contactTypes).toBe(ContactTypeEnum.REMOTE);
  });

  it('only sets the boolean filters when they equal "true"', () => {
    mockQuery({ isAvailable: 'true', hasSuperCoachBadge: 'true' });
    expect(
      renderHook(() => useNetworkDirectoryQueryParams()).result.current
    ).toMatchObject({ isAvailable: true, hasSuperCoachBadge: true });

    mockQuery({ isAvailable: 'false', hasSuperCoachBadge: 'nope' });
    const { result } = renderHook(() => useNetworkDirectoryQueryParams());
    expect(result.current).not.toHaveProperty('isAvailable');
    expect(result.current).not.toHaveProperty('hasSuperCoachBadge');
  });

  it('includes the search only when not empty', () => {
    mockQuery({ search: 'cuisine' });
    expect(
      renderHook(() => useNetworkDirectoryQueryParams()).result.current
    ).toMatchObject({ search: 'cuisine' });
    mockQuery({ search: '' });
    expect(
      renderHook(() => useNetworkDirectoryQueryParams()).result.current
    ).not.toHaveProperty('search');
  });

  it('reflects role, entity and sort of the URL', () => {
    mockQuery({
      role: UserRoles.CANDIDATE,
      entity: 'company',
      sort: 'lastConnection',
    });
    expect(
      renderHook(() => useNetworkDirectoryQueryParams()).result.current
    ).toMatchObject({
      role: UserRoles.CANDIDATE,
      entity: NetworkDirectoryEntity.COMPANY,
      sort: NetworkDirectorySort.LAST_CONNECTION,
    });
  });
});
