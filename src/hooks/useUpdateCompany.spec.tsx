import { act, renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { companyActions } from '@/src/use-cases/company';
import { useUpdateCompany } from './useUpdateCompany';

function setup() {
  const store = createTestStore();
  // Replace the dispatch so the update listener does not hit the network.
  const dispatch = jest
    .spyOn(store, 'dispatch')
    .mockImplementation(((a) => a) as never);
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  return { dispatch, ...renderHook(() => useUpdateCompany(), { wrapper }) };
}

describe('useUpdateCompany', () => {
  it('dispatches updateCompanyRequested with the new data', () => {
    const { dispatch, result } = setup();
    act(() => result.current.updateCompany({ name: 'ACME' }));

    expect(dispatch).toHaveBeenCalledWith(
      companyActions.updateCompanyRequested({ companyData: { name: 'ACME' } })
    );
    expect(result.current.closeModal).toBe(false);
  });

  it('closes the modal without dispatching when there is nothing to update', () => {
    const { dispatch, result } = setup();
    act(() => result.current.updateCompany({}));

    expect(dispatch).not.toHaveBeenCalled();
    expect(result.current.closeModal).toBe(true);
  });
});
