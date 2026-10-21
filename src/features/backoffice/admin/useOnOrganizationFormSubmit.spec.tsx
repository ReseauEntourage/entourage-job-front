import { renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { Actions } from '@/src/constants/utils';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { useOnOrganizationFormSubmit } from './useOnOrganizationFormSubmit';

const setup = (apiCall: jest.Mock, action: any) => {
  const store = createTestStore();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  const { result } = renderHook(
    () => useOnOrganizationFormSubmit(apiCall, action),
    { wrapper }
  );
  const messages = () =>
    store.getState().notifications.notifications.map((n: any) => ({
      type: n.type,
      message: n.message,
    }));
  return { result, messages };
};

describe('useOnOrganizationFormSubmit', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('creates, closes the modal, notifies and returns the data', async () => {
    const apiCall = jest.fn().mockResolvedValue({ data: { id: 'o1' } });
    const closeModal = jest.fn();
    const { result, messages } = setup(apiCall, Actions.CREATE);
    const fields = { name: 'Asso' } as any;
    await expect(result.current.onSubmit(fields, closeModal)).resolves.toEqual({
      id: 'o1',
    });
    expect(apiCall).toHaveBeenCalledWith(fields);
    expect(closeModal).toHaveBeenCalledTimes(1);
    expect(messages()).toEqual([
      { type: 'success', message: 'La structure a bien été créée' },
    ]);
  });

  it('words the update confirmation accordingly', async () => {
    const { result, messages } = setup(
      jest.fn().mockResolvedValue({ data: {} }),
      Actions.UPDATE
    );
    await result.current.onSubmit({} as any, jest.fn());
    expect(messages()[0].message).toBe('La structure a bien été modifiée');
  });

  it('keeps the modal open and reports the failure', async () => {
    const closeModal = jest.fn();
    const { result, messages } = setup(
      jest.fn().mockRejectedValue(new Error('x')),
      Actions.UPDATE
    );
    await expect(
      result.current.onSubmit({} as any, closeModal)
    ).resolves.toBeUndefined();
    expect(closeModal).not.toHaveBeenCalled();
    expect(messages()).toEqual([
      {
        type: 'danger',
        message:
          "Une erreur s'est produite lors de la modification de la structure",
      },
    ]);
  });
});
