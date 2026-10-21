import { act, renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { NetworkDirectoryEntity } from '@/src/constants/network-directory';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { companyActions } from '@/src/use-cases/company';
import { profilesActions } from '@/src/use-cases/profiles';
import { useNetworkDirectory } from '../useNetworkDirectory';

let mockParams: any;
jest.mock('../useNetworkDirectoryQueryParams', () => ({
  useNetworkDirectoryQueryParams: () => mockParams,
}));

let mockAtBottom: () => void = () => {};
jest.mock('@/src/hooks/useIsAtBottom', () => ({
  useIsAtBottom: (callback: () => void) => {
    mockAtBottom = callback;
  },
}));

const userParams = { entity: NetworkDirectoryEntity.USER, role: 'Coach' };
const companyParams = { entity: NetworkDirectoryEntity.COMPANY, role: 'Coach' };

const setup = () => {
  const store = createTestStore();
  const dispatchSpy = jest.spyOn(store, 'dispatch');
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  const hook = renderHook(() => useNetworkDirectory(), { wrapper });
  const dispatchedTypes = () =>
    dispatchSpy.mock.calls.map(([action]: any) => action?.type);
  return { store, dispatchSpy, dispatchedTypes, ...hook };
};

describe('useNetworkDirectory', () => {
  it('fetches profiles for the user entity, and exposes the params', () => {
    mockParams = userParams;
    const { dispatchSpy, result, dispatchedTypes } = setup();
    expect(dispatchSpy).toHaveBeenCalledWith(
      profilesActions.fetchProfilesWithFilters(userParams as any)
    );
    expect(dispatchedTypes()).not.toContain(
      companyActions.fetchCompaniesWithFilters.type
    );
    expect(result.current.directoryFiltersParams).toBe(userParams);
    expect(result.current.profiles).toEqual([]);
  });

  it('fetches companies with a referent for the company entity', () => {
    mockParams = companyParams;
    const { dispatchSpy, dispatchedTypes } = setup();
    expect(dispatchSpy).toHaveBeenCalledWith(
      companyActions.fetchCompaniesWithFilters({
        ...companyParams,
        onlyWithReferent: true,
      } as any)
    );
    expect(dispatchedTypes()).not.toContain(
      profilesActions.fetchProfilesWithFilters.type
    );
  });

  it('refetches only when the filters really change', () => {
    mockParams = userParams;
    const { rerender, dispatchedTypes } = setup();
    const count = () =>
      dispatchedTypes().filter(
        (type) => type === profilesActions.fetchProfilesWithFilters.type
      ).length;
    expect(count()).toBe(1);
    mockParams = { ...userParams };
    rerender();
    expect(count()).toBe(1);
    mockParams = { ...userParams, search: 'x' };
    rerender();
    expect(count()).toBe(2);
  });

  it('does not paginate while the first page is loading', () => {
    mockParams = userParams;
    const { dispatchedTypes } = setup();
    act(() => mockAtBottom());
    expect(dispatchedTypes()).not.toContain(
      profilesActions.fetchProfilesNextPage.type
    );
  });

  it('resets both offsets on unmount', () => {
    mockParams = userParams;
    const { unmount, dispatchedTypes } = setup();
    unmount();
    expect(dispatchedTypes()).toEqual(
      expect.arrayContaining([
        profilesActions.resetProfilesOffset.type,
        companyActions.resetCompaniesOffset.type,
      ])
    );
  });
});
