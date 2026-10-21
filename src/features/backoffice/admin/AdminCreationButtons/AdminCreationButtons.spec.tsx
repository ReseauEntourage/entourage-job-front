import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Api } from '@/src/api';
import { openModal } from '@/src/features/modals/Modal';
import { AdminCreationButtons } from './AdminCreationButtons';

jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('@/src/features/modals/Modal', () => ({ openModal: jest.fn() }));
let mockFilled: Record<string, unknown> = {};
const mockMemberSubmit = jest.fn();
const mockSetFilled = jest.fn();
let memberApiCall: (u: any) => Promise<any>;
jest.mock('@/src/features/backoffice/admin/useOnMemberFormSubmit', () => ({
  useOnMemberFormSubmit: (apiCall: any) => {
    memberApiCall = apiCall;
    return {
      onSubmit: mockMemberSubmit,
      filledUserFields: mockFilled,
      prevFilledUserFields: {},
      setFilledUserFields: mockSetFilled,
    };
  },
}));
const mockOrganizationSubmit = jest.fn();
let organizationApiCall: (o: any) => Promise<any>;
jest.mock('../useOnOrganizationFormSubmit', () => ({
  useOnOrganizationFormSubmit: (apiCall: any) => {
    organizationApiCall = apiCall;
    return { onSubmit: mockOrganizationSubmit };
  },
}));
jest.mock('@/src/features/modals/Modal/ModalGeneric/ModalEdit', () => ({
  ModalEdit: (props: any) => (
    <div data-testid="modal-edit" data-title={props.title}>
      <span data-testid="defaults">
        {JSON.stringify(props.defaultValues ?? null)}
      </span>
      <button onClick={() => props.onSubmit({ f: 1 }, 'close')}>submit</button>
      <button onClick={props.onCancel}>cancel</button>
    </div>
  ),
}));

const renderOpenedModal = () =>
  render((openModal as jest.Mock).mock.calls.at(-1)[0]);

describe('AdminCreationButtons', () => {
  const refreshList = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockFilled = {};
  });

  const openMenuItem = (label: string) => {
    fireEvent.click(screen.getByText('Créer'));
    fireEvent.click(screen.getByText(label));
  };

  it('opens the member creation modal, which creates the user via the API', async () => {
    render(<AdminCreationButtons refreshList={refreshList} />);
    openMenuItem('Nouveau membre');

    expect(openModal).toHaveBeenCalledTimes(1);
    const modal = renderOpenedModal();
    expect(screen.getByTestId('modal-edit')).toHaveAttribute(
      'data-title',
      'Ajouter un nouveau membre'
    );
    await memberApiCall({ firstName: 'A' });
    expect(Api.postUser).toHaveBeenCalledWith({ firstName: 'A' });
    modal.unmount();
  });

  it('submits the member, then refreshes the list', async () => {
    mockMemberSubmit.mockResolvedValue({});
    render(<AdminCreationButtons refreshList={refreshList} />);
    openMenuItem('Nouveau membre');
    renderOpenedModal();

    fireEvent.click(screen.getByText('submit'));

    await waitFor(() => expect(refreshList).toHaveBeenCalledTimes(1));
    expect(mockMemberSubmit).toHaveBeenCalledWith({ f: 1 }, 'close');
  });

  it('forgets the filled fields when the member creation is cancelled', () => {
    render(<AdminCreationButtons refreshList={refreshList} />);
    openMenuItem('Nouveau membre');
    renderOpenedModal();

    fireEvent.click(screen.getByText('cancel'));

    expect(mockSetFilled).toHaveBeenCalledWith({});
  });

  it('reopens the member form prefilled when a previous submission failed', () => {
    mockFilled = { firstName: 'Typed' };
    render(<AdminCreationButtons refreshList={refreshList} />);

    expect(openModal).toHaveBeenCalledTimes(1);
    expect(
      (openModal as jest.Mock).mock.calls[0][0].props.defaultValues
    ).toEqual({
      firstName: 'Typed',
    });
  });

  it('does not open any modal on mount when no field was filled', () => {
    render(<AdminCreationButtons refreshList={refreshList} />);

    expect(openModal).not.toHaveBeenCalled();
  });

  it('opens the organization creation modal, which creates it via the API', async () => {
    render(<AdminCreationButtons refreshList={refreshList} />);
    openMenuItem('Nouvelle structure');

    renderOpenedModal();
    expect(screen.getByTestId('modal-edit')).toHaveAttribute(
      'data-title',
      'Création de structure partenaire'
    );
    await organizationApiCall({ name: 'Asso' });
    expect(Api.postOrganization).toHaveBeenCalledWith({ name: 'Asso' });

    fireEvent.click(screen.getByText('submit'));
    expect(mockOrganizationSubmit).toHaveBeenCalledWith({ f: 1 }, 'close');
  });
});
