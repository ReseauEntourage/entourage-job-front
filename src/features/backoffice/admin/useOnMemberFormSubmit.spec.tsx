import { act, renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { Api } from '@/src/api';
import { Actions } from '@/src/constants/utils';
import { CREATE_NEW_ORGANIZATION_VALUE } from '@/src/features/forms/schemas/formAddUser';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { useOnMemberFormSubmit } from './useOnMemberFormSubmit';

jest.mock('@/src/api');

const baseFields = {
  firstName: 'Awa',
  lastName: 'Diallo',
  gender: 1,
  zone: 'PARIS',
  phone: '0612345678',
  role: 'Candidat',
  email: 'awa@test.fr',
};

const setup = (apiCall: jest.Mock, action: any = Actions.CREATE) => {
  const store = createTestStore();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  const hook = renderHook(() => useOnMemberFormSubmit(apiCall, action), {
    wrapper,
  });
  const messages = () =>
    store.getState().notifications.notifications.map((n: any) => n.message);
  return { ...hook, messages };
};

describe('useOnMemberFormSubmit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('sends the member with the selected organization', async () => {
    const apiCall = jest.fn().mockResolvedValue({ data: { id: 'u1' } });
    const closeModal = jest.fn();
    const { result, messages } = setup(apiCall);
    let returned;
    await act(async () => {
      returned = await result.current.onSubmit(
        { ...baseFields, organizationId: { value: 'org-1' } } as any,
        closeModal
      );
    });
    expect(apiCall).toHaveBeenCalledWith({
      ...baseFields,
      OrganizationId: 'org-1',
    });
    expect(Api.postOrganization).not.toHaveBeenCalled();
    expect(returned).toEqual({ id: 'u1' });
    expect(closeModal).toHaveBeenCalled();
    expect(messages()).toEqual(['Le membre a bien été créé']);
  });

  it('omits the organization when none is selected', async () => {
    const apiCall = jest.fn().mockResolvedValue({ data: {} });
    const { result, messages } = setup(apiCall, Actions.UPDATE);
    await act(async () => {
      await result.current.onSubmit(baseFields as any, jest.fn());
    });
    expect(apiCall.mock.calls[0][0]).not.toHaveProperty('OrganizationId');
    expect(messages()).toEqual(['Le membre a bien été modifié']);
  });

  it('creates the organization first when asked to', async () => {
    (Api.postOrganization as jest.Mock).mockResolvedValue({
      data: { id: 'new-org' },
    });
    const apiCall = jest.fn().mockResolvedValue({ data: {} });
    const { result, messages } = setup(apiCall);
    await act(async () => {
      await result.current.onSubmit(
        {
          ...baseFields,
          organizationId: { value: CREATE_NEW_ORGANIZATION_VALUE },
          nameOrganization: 'Asso',
          addressOrganization: '1 rue X',
          zoneOrganization: 'PARIS',
          referentFirstNameOrganization: 'Ref',
          referentLastNameOrganization: 'Erent',
          referentPhoneOrganization: '0600000000',
          referentMailOrganization: 'ref@asso.fr',
        } as any,
        jest.fn()
      );
    });
    expect(Api.postOrganization).toHaveBeenCalledWith({
      name: 'Asso',
      address: '1 rue X',
      zone: 'PARIS',
      referentFirstName: 'Ref',
      referentLastName: 'Erent',
      referentPhone: '0600000000',
      referentMail: 'ref@asso.fr',
    });
    expect(apiCall).toHaveBeenCalledWith(
      expect.objectContaining({ OrganizationId: 'new-org' })
    );
    expect(messages()).toEqual([
      'La structure a bien été créée',
      'Le membre a bien été créé',
    ]);
  });

  it('stops when the organization cannot be created', async () => {
    (Api.postOrganization as jest.Mock).mockRejectedValue(new Error('x'));
    const apiCall = jest.fn();
    const { result, messages } = setup(apiCall);
    await act(async () => {
      await result.current.onSubmit(
        {
          ...baseFields,
          organizationId: { value: CREATE_NEW_ORGANIZATION_VALUE },
          nameOrganization: 'Asso',
        } as any,
        jest.fn()
      );
    });
    expect(apiCall).not.toHaveBeenCalled();
    expect(messages()).toEqual([
      "Une erreur s'est produite lors de la création de la structure",
    ]);
  });

  it('reports a duplicated email', async () => {
    const apiCall = jest.fn().mockRejectedValue({ response: { status: 409 } });
    const closeModal = jest.fn();
    const { result, messages } = setup(apiCall);
    await act(async () => {
      await result.current.onSubmit(
        { ...baseFields, organizationId: { value: 'org-1' } } as any,
        closeModal
      );
    });
    expect(messages()).toEqual(['Cette adresse email est déjà utilisée']);
    expect(closeModal).not.toHaveBeenCalled();
  });

  it('reports a generic failure', async () => {
    const apiCall = jest.fn().mockRejectedValue(new Error('x'));
    const { result, messages } = setup(apiCall);
    await act(async () => {
      await result.current.onSubmit(baseFields as any, jest.fn());
    });
    expect(messages()).toEqual([
      "Une erreur s'est produite lors de la création du membre",
    ]);
  });

  it('keeps the filled fields, with the created organization, when the member creation fails', async () => {
    (Api.postOrganization as jest.Mock).mockResolvedValue({
      data: { id: 'new-org' },
    });
    const apiCall = jest.fn().mockRejectedValue(new Error('x'));
    const closeModal = jest.fn();
    const { result } = setup(apiCall);
    await act(async () => {
      await result.current.onSubmit(
        {
          ...baseFields,
          organizationId: { value: CREATE_NEW_ORGANIZATION_VALUE },
          nameOrganization: 'Asso',
        } as any,
        closeModal
      );
    });
    expect(closeModal).toHaveBeenCalledTimes(1);
    expect(result.current.filledUserFields).toEqual({
      ...baseFields,
      organizationId: { value: 'new-org', label: 'Asso' },
    });
    act(() => result.current.setFilledUserFields({}));
    expect(result.current.filledUserFields).toEqual({});
  });
});
