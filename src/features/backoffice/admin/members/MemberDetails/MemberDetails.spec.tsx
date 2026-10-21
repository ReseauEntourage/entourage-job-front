import '@testing-library/jest-dom';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import React from 'react';
import { Api } from '@/src/api';
import { MEMBER_TABS } from '@/src/constants';
import { UserRoles } from '@/src/constants/users';
import { openModal } from '@/src/features/modals/Modal';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useMemberId } from '@/src/hooks/queryParams/useMemberId';
import { useTab } from '@/src/hooks/queryParams/useTab';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { selectNotifications } from '@/src/use-cases/notifications';
import { EditMemberModal } from './EditMemberModal';
import { MemberDetails } from './MemberDetails';
import { MemberDetailsHeader } from './MemberDetailsHeader';
import { ParametersMemberTab } from './MemberTab/ParametersMemberTab';

jest.mock('@/src/api');
jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: jest.fn(),
}));
jest.mock('@/src/hooks/queryParams/useMemberId', () => ({
  useMemberId: jest.fn(),
}));
jest.mock('@/src/hooks/queryParams/useTab', () => ({ useTab: jest.fn() }));
jest.mock('@/src/features/modals/Modal', () => ({ openModal: jest.fn() }));
jest.mock('@/src/components/layouts/LayoutBackOffice', () => ({
  LayoutBackOffice: ({ title, children }: any) => (
    <div data-testid="layout" data-title={title}>
      {children}
    </div>
  ),
}));
jest.mock('@/src/components/ui/BackLink', () => ({
  BackLink: () => <span>back</span>,
}));
jest.mock('./MemberDetailsHeader', () => ({
  MemberDetailsHeader: jest.requireActual(
    './MemberDetailsHeader/MemberDetailsHeader'
  ).MemberDetailsHeader,
}));
jest.mock('./MemberTab', () => ({
  ParametersMemberTab: () => <div data-testid="parameters-tab" />,
}));
const mockSubmit = jest.fn();
const mockSetFilled = jest.fn();
let mockFilled: Record<string, unknown> = {};
jest.mock('@/src/features/backoffice/admin/useOnMemberFormSubmit', () => ({
  useOnMemberFormSubmit: () => ({
    onSubmit: mockSubmit,
    filledUserFields: mockFilled,
    prevFilledUserFields: {},
    setFilledUserFields: mockSetFilled,
  }),
}));
jest.mock('@/src/features/modals/Modal/ModalGeneric/ModalEdit', () => ({
  ModalEdit: (props: any) => (
    <div data-testid="modal-edit" data-title={props.title}>
      <span data-testid="defaults">
        {JSON.stringify(props.defaultValues ?? null)}
      </span>
      <button
        onClick={() =>
          props.onSubmit(props.fieldsToSubmit ?? { role: 'Coach' }, jest.fn())
        }
      >
        submit-edit
      </button>
      <button
        onClick={() => props.onSubmit({ role: 'Prescripteur' }, jest.fn())}
      >
        submit-role-change
      </button>
      <button
        onClick={() =>
          props.onSubmit({ confirmation: 'SUPPRIMER' }, mockCloseModal)
        }
      >
        confirm-delete
      </button>
      <button
        onClick={() => props.onSubmit({ confirmation: 'NOPE' }, mockCloseModal)}
      >
        wrong-delete
      </button>
      <button onClick={props.onCancel}>cancel</button>
    </div>
  ),
}));
const mockCloseModal = jest.fn();
jest.mock('@/src/features/modals/Modal/ModalGeneric/ModalConfirm', () => ({
  ModalConfirm: ({ text, onConfirm }: any) => (
    <button onClick={onConfirm}>{`confirm:${text}`}</button>
  ),
}));
jest.mock('@/src/features/backoffice/admin/members/MemberTable', () => ({
  MemberTable: ({ members, role }: any) => (
    <div data-testid="table" data-role={role}>
      {members}
    </div>
  ),
}));
jest.mock('@/src/features/backoffice/admin/members/MemberTable/Member', () => ({
  Member: ({ member, disableLink }: any) => (
    <span data-testid="member" data-disable-link={String(!!disableLink)}>
      {member.firstName}
    </span>
  ),
}));

const user = (overrides: Record<string, unknown> = {}) =>
  ({
    id: 'u1',
    firstName: 'Awa',
    lastName: 'Diallo',
    email: 'awa@test.fr',
    role: UserRoles.COACH,
    gender: 1,
    phone: '06',
    zone: 'PARIS',
    organization: null,
    referredCandidates: [],
    userProfile: { hasPicture: false },
    ...overrides,
  }) as any;

describe('MemberDetailsHeader', () => {
  beforeEach(() => {
    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      role: UserRoles.ADMIN,
    });
  });

  it('shows name, organization and capitalized zone', () => {
    renderWithProviders(
      <MemberDetailsHeader user={user({ organization: { name: 'Asso' } })} />
    );

    expect(screen.getByText('Awa Diallo - Asso')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
  });

  it('says the zone is not filled when missing', () => {
    renderWithProviders(<MemberDetailsHeader user={user({ zone: null })} />);

    expect(screen.getByText('Non renseignée')).toBeInTheDocument();
  });

  it('renders nothing without a connected user', () => {
    (useAuthenticatedUser as jest.Mock).mockReturnValue(null);
    const { container } = renderWithProviders(
      <MemberDetailsHeader user={user()} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  describe('referer role line', () => {
    it('says the referer has no candidate', () => {
      renderWithProviders(
        <MemberDetailsHeader user={user({ role: UserRoles.REFERER })} />
      );

      expect(screen.getByText(/d'aucun candidat/)).toBeInTheDocument();
    });

    it('counts the referred candidates (singular and plural)', () => {
      const { unmount } = renderWithProviders(
        <MemberDetailsHeader
          user={user({
            role: UserRoles.REFERER,
            referredCandidates: [{ id: 'a' }],
          })}
        />
      );
      expect(screen.getByText(/de 1 candidat$/)).toBeInTheDocument();
      unmount();

      renderWithProviders(
        <MemberDetailsHeader
          user={user({
            role: UserRoles.REFERER,
            referredCandidates: [{ id: 'a' }, { id: 'b' }],
          })}
        />
      );
      expect(screen.getByText(/de 2 candidats$/)).toBeInTheDocument();
    });

    it('does not show the role line for other roles', () => {
      renderWithProviders(<MemberDetailsHeader user={user()} />);

      expect(screen.queryByText(/candidat/)).not.toBeInTheDocument();
    });
  });
});

describe('MemberDetails', () => {
  it('titles the layout with the member name and shows the parameters tab by default', () => {
    (useTab as jest.Mock).mockReturnValue(undefined);
    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      role: UserRoles.ADMIN,
    });
    renderWithProviders(<MemberDetails user={user()} setUser={jest.fn()} />);

    expect(screen.getByTestId('layout')).toHaveAttribute(
      'data-title',
      'Awa - Gestion des membres'
    );
    expect(screen.getByTestId('parameters-tab')).toBeInTheDocument();
    expect(screen.getByText('Paramètres').closest('a')).toHaveAttribute(
      'href',
      '/backoffice/admin/membres/u1/parametres'
    );
  });

  it('shows the parameters tab when selected, and nothing for an unknown tab', () => {
    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      role: UserRoles.ADMIN,
    });
    (useTab as jest.Mock).mockReturnValue(MEMBER_TABS.PARAMETERS);
    const { unmount } = renderWithProviders(
      <MemberDetails user={user()} setUser={jest.fn()} />
    );
    expect(screen.getByTestId('parameters-tab')).toBeInTheDocument();
    unmount();

    (useTab as jest.Mock).mockReturnValue('other');
    renderWithProviders(<MemberDetails user={user()} setUser={jest.fn()} />);
    expect(screen.queryByTestId('parameters-tab')).not.toBeInTheDocument();
  });
});

describe('EditMemberModal', () => {
  const setUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockFilled = {};
  });

  it('is prefilled with the member data', () => {
    render(<EditMemberModal user={user()} setUser={setUser} />);

    expect(
      JSON.parse(screen.getByTestId('defaults').textContent ?? '')
    ).toEqual(
      expect.objectContaining({
        firstName: 'Awa',
        lastName: 'Diallo',
        email: 'awa@test.fr',
        role: UserRoles.COACH,
        zone: 'PARIS',
      })
    );
  });

  it('saves directly when the role is unchanged and updates the member in the parent', async () => {
    mockSubmit.mockResolvedValue({ id: 'u1', firstName: 'Updated' });
    render(<EditMemberModal user={user()} setUser={setUser} />);

    fireEvent.click(screen.getByText('submit-edit'));

    await waitFor(() =>
      expect(setUser).toHaveBeenCalledWith({ id: 'u1', firstName: 'Updated' })
    );
    expect(openModal).not.toHaveBeenCalled();
  });

  it('asks for confirmation before changing the role, and saves only when confirmed', async () => {
    mockSubmit.mockResolvedValue({ id: 'u1' });
    render(<EditMemberModal user={user()} setUser={setUser} />);

    fireEvent.click(screen.getByText('submit-role-change'));

    expect(setUser).not.toHaveBeenCalled();
    expect(openModal).toHaveBeenCalledTimes(1);
    const confirmModal = render((openModal as jest.Mock).mock.calls[0][0]);
    fireEvent.click(
      screen.getByText(
        /confirm:Attention, si vous modifiez le rôle d'un candidat/
      )
    );
    await waitFor(() => expect(setUser).toHaveBeenCalledWith({ id: 'u1' }));
    confirmModal.unmount();
  });

  it('clears the filled fields when the modal is cancelled', () => {
    render(<EditMemberModal user={user()} setUser={setUser} />);
    fireEvent.click(screen.getByText('cancel'));

    expect(mockSetFilled).toHaveBeenCalledWith({});
  });

  it('reopens the form prefilled with the fields the user had typed after a failed save', () => {
    mockFilled = { firstName: 'Typed' };
    render(<EditMemberModal user={user()} setUser={setUser} />);

    expect(openModal).toHaveBeenCalledTimes(1);
    const reopened = (openModal as jest.Mock).mock.calls[0][0];
    expect(reopened.props.defaultValues).toEqual({ firstName: 'Typed' });
  });
});

describe('ParametersMemberTab', () => {
  const replace = jest.fn();
  const setUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation();
    (useRouter as jest.Mock).mockReturnValue({ replace });
    (useMemberId as jest.Mock).mockReturnValue('u1');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const setup = (u = user()) =>
    renderWithProviders(<ParametersMemberTab user={u} setUser={setUser} />);

  const openDeleteModal = () => {
    fireEvent.click(screen.getByText("Supprimer l'utilisateur"));
    return render((openModal as jest.Mock).mock.calls[0][0]);
  };

  it('shows the member information table with the link disabled', () => {
    setup();

    expect(screen.getByText('Informations du coach')).toBeInTheDocument();
    expect(screen.getAllByTestId('member')).toHaveLength(1);
    expect(screen.getByTestId('member')).toHaveAttribute(
      'data-disable-link',
      'true'
    );
  });

  it('lists the referred candidates of a referer in their own table', () => {
    setup(
      user({
        role: UserRoles.REFERER,
        referredCandidates: [
          { id: 'c1', firstName: 'Cand1' },
          { id: 'c2', firstName: 'Cand2' },
        ],
      })
    );

    expect(
      screen.getByText('Informations des candidats orientés')
    ).toBeInTheDocument();
    expect(screen.getByText('Cand1')).toBeInTheDocument();
    expect(screen.getByText('Cand2')).toBeInTheDocument();
  });

  it('shows no referred table when there are no referred candidates', () => {
    setup();

    expect(screen.queryByText(/orientés/)).not.toBeInTheDocument();
  });

  it('opens the edit modal', () => {
    setup();
    fireEvent.click(screen.getByText('Modifier le membre'));

    expect(openModal).toHaveBeenCalledTimes(1);
  });

  it('deletes the member once confirmed with SUPPRIMER, notifies and goes back to the list', async () => {
    (Api.deleteUser as jest.Mock).mockResolvedValue({});
    const { store } = setup();
    openDeleteModal();

    await act(async () => {
      fireEvent.click(screen.getByText('confirm-delete'));
    });

    expect(Api.deleteUser).toHaveBeenCalledWith('u1');
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
    expect(selectNotifications(store.getState())[0]).toEqual(
      expect.objectContaining({ message: "L'utilisateur a bien été supprimé" })
    );
    expect(replace).toHaveBeenCalledWith(
      {
        pathname: '/backoffice/admin/membres',
        query: { role: UserRoles.COACH },
      },
      undefined,
      { shallow: true }
    );
  });

  it('refuses to delete without the exact confirmation word', async () => {
    const { store } = setup();
    openDeleteModal();

    await act(async () => {
      fireEvent.click(screen.getByText('wrong-delete'));
    });

    expect(Api.deleteUser).not.toHaveBeenCalled();
    expect(selectNotifications(store.getState())[0]).toEqual(
      expect.objectContaining({
        type: 'danger',
        message: 'Erreur de confirmation',
      })
    );
    expect(replace).not.toHaveBeenCalled();
  });

  it('notifies an error when the deletion fails', async () => {
    (Api.deleteUser as jest.Mock).mockRejectedValue(new Error('x'));
    const { store } = setup();
    openDeleteModal();

    await act(async () => {
      fireEvent.click(screen.getByText('confirm-delete'));
    });

    expect(selectNotifications(store.getState())[0]).toEqual(
      expect.objectContaining({
        type: 'danger',
        message: 'Une erreur est survenue',
      })
    );
    expect(replace).not.toHaveBeenCalled();
  });
});
