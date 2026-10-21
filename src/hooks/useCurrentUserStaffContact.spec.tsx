jest.mock('@/src/api');

import { renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { seedAccessToken } from '@/src/store/testUtils/seedAccessToken';
import { useCurrentUserStaffContact } from './useCurrentUserStaffContact';

const mockedApi = getMockedApi();
const wrap = (store: ReturnType<typeof createTestStore>) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  };

describe('useCurrentUserStaffContact', () => {
  beforeEach(() => seedAccessToken('token'));
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('fetches the staff contact once and returns it', async () => {
    mockedApi.getCurrentStaffContact.mockResolvedValue({
      data: { id: 's1', firstName: 'Staff' },
    } as never);
    const store = createTestStore();

    const first = renderHook(() => useCurrentUserStaffContact(), {
      wrapper: wrap(store),
    });
    await flushPromises();
    expect(first.result.current).toEqual({ id: 's1', firstName: 'Staff' });
    first.unmount();

    renderHook(() => useCurrentUserStaffContact(), { wrapper: wrap(store) });
    await flushPromises();

    expect(mockedApi.getCurrentStaffContact).toHaveBeenCalledTimes(1);
  });

  it('returns null before the contact is loaded', () => {
    mockedApi.getCurrentStaffContact.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useCurrentUserStaffContact(), {
      wrapper: wrap(createTestStore()),
    });
    expect(result.current).toBeNull();
  });
});
