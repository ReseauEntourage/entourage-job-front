jest.mock('@/src/api');
jest.mock('next/router', () => ({ useRouter: jest.fn() }));

import { renderHook } from '@testing-library/react';

import { act } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { companyActions } from '@/src/use-cases/company';
import { useSelectedCompany } from './useSelectedCompany';

const mockedApi = getMockedApi();
const mockUseRouter = useRouter as jest.Mock;

function setup(store = createTestStore()) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  return { store, ...renderHook(() => useSelectedCompany(), { wrapper }) };
}

describe('useSelectedCompany', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('does nothing without a companyId in the url', async () => {
    mockUseRouter.mockReturnValue({ query: {} });
    const { result, store } = setup();
    await act(flushPromises);

    expect(mockedApi.getCompanyById).not.toHaveBeenCalled();
    expect(store.getState().company.selectedCompanyId).toBeNull();
    expect(result.current.companyId).toBeUndefined();
    expect(result.current.selectedCompany).toBeNull();
  });

  it('stores the id, fetches the company and returns it', async () => {
    mockUseRouter.mockReturnValue({ query: { companyId: 'c1' } });
    mockedApi.getCompanyById.mockResolvedValue({
      data: { id: 'c1', name: 'ACME' },
    } as never);
    const { result, store } = setup();
    await act(flushPromises);

    expect(store.getState().company.selectedCompanyId).toBe('c1');
    expect(mockedApi.getCompanyById).toHaveBeenCalledWith('c1');
    expect(result.current.companyId).toBe('c1');
    expect(result.current.selectedCompany).toEqual({ id: 'c1', name: 'ACME' });
    expect(result.current.isFetchCompanyRequested).toBe(false);
  });

  it('does not refetch when the selected company already matches the url', async () => {
    mockUseRouter.mockReturnValue({ query: { companyId: 'c1' } });
    const store = createTestStore();
    store.dispatch(
      companyActions.fetchSelectedCompanySucceeded({ id: 'c1' } as never)
    );
    setup(store);
    await act(flushPromises);

    expect(mockedApi.getCompanyById).not.toHaveBeenCalled();
  });
});
