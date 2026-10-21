import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default, import-x/order
import expect from 'expect';
import { Api } from '@/src/api';
import { UserRoles } from '@/src/constants/users';
import { openModal } from '@/src/features/modals/Modal';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useContactEligibility } from '@/src/hooks/useContactEligibility';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { currentUserActions } from '@/src/use-cases/current-user';
import { ProfileChangePassword } from '../ProfileChangePassword/ProfileChangePassword';
import { ProfileContactCard } from '../ProfileContactCard/ProfileContactCard';
import { ProfileDeleteAccount } from '../ProfileDeleteAccount/ProfileDeleteAccount';
import { ProfileDescription } from '../ProfileDescription/ProfileDescription';
import { ProfileLinkedInConnect } from '../ProfileLinkedInConnect/ProfileLinkedInConnect';
import { ProfileProfessionalInformations } from '../ProfileProfessionalInformations/ProfileProfessionalInformations';
import { ProfileStats } from '../ProfileStats/ProfileStats';

jest.mock('@/src/api');
jest.mock('@/src/features/modals/Modal', () => ({ openModal: jest.fn() }));
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: jest.fn(),
}));
jest.mock('@/src/hooks/useContactEligibility', () => ({
  useContactEligibility: jest.fn(),
}));
jest.mock(
  '@/src/features/modals/DeleteAccountModal/DeleteAccountModal',
  () => ({
    DeleteAccountModal: () => null,
  })
);
jest.mock(
  '@/src/features/headers/HeaderProfile/ProfileIntroduction/ModalEditProfileIntroduction',
  () => ({ ModalEditProfileDescription: () => null })
);
jest.mock('@/src/features/forms/FormWithValidation', () => ({
  FormWithValidation: (props: unknown) => {
    mockFormProps(props);
    return null;
  },
}));
jest.mock(
  '@/src/features/backoffice/profile/ProfileProfessionalInformationCard/ProfileCareerPathSentence',
  () => ({
    ProfileCareerPathSentence: ({ currentJob }: { currentJob?: string }) => (
      <p>career-sentence:{currentJob ?? 'none'}</p>
    ),
  })
);

const mockFormProps = jest.fn();
const mockedApi = Api as jest.Mocked<typeof Api>;
const mockOpenModal = openModal as jest.Mock;

const notifications = (store: { getState: () => unknown }) =>
  (
    store.getState() as {
      notifications: { notifications: { message: string }[] };
    }
  ).notifications.notifications.map(({ message }) => message);

const renderWithUser = (ui: React.ReactElement, id = 'me') => {
  const store = createTestStore();
  store.dispatch(
    currentUserActions.fetchUserSucceeded({
      id,
      role: UserRoles.CANDIDATE,
    } as never)
  );
  return renderWithProviders(ui, { store });
};

beforeEach(() => {
  jest.clearAllMocks();
  (useAuthenticatedUser as jest.Mock).mockReturnValue({
    id: 'me',
    role: UserRoles.COACH,
  });
});

describe('ProfileChangePassword', () => {
  const lastFormProps = () =>
    mockFormProps.mock.calls[mockFormProps.mock.calls.length - 1][0];

  it('submits the old and new password then confirms', async () => {
    mockedApi.putUserChangePwd.mockResolvedValue({} as never);
    const { store } = renderWithProviders(<ProfileChangePassword />);
    // The card starts collapsed: open it so the form mounts.
    fireEvent.click(screen.getByRole('button'));
    const setError = jest.fn();
    await act(async () => {
      await lastFormProps().onSubmit(
        { newPassword: 'new', oldPassword: 'old', confirmPassword: 'new' },
        setError
      );
    });
    expect(mockedApi.putUserChangePwd).toHaveBeenCalledWith({
      newPassword: 'new',
      oldPassword: 'old',
    });
    expect(notifications(store)).toContain('Nouveau mot de passe enregistré');
    expect(setError).toHaveBeenCalledWith('');
  });

  it('shows an error when the old password is rejected', async () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    mockedApi.putUserChangePwd.mockRejectedValue(new Error('401'));
    const { store } = renderWithProviders(<ProfileChangePassword />);
    // The card starts collapsed: open it so the form mounts.
    fireEvent.click(screen.getByRole('button'));
    const setError = jest.fn();
    await act(async () => {
      await lastFormProps().onSubmit(
        { newPassword: 'new', oldPassword: 'bad', confirmPassword: 'new' },
        setError
      );
    });
    expect(setError).toHaveBeenCalledWith(
      "L'ancien mot de passe n'est pas valide"
    );
    expect(notifications(store)).toHaveLength(0);
    consoleError.mockRestore();
  });
});

describe('ProfileContactCard', () => {
  const openConversationOrGate = jest.fn();
  const props = {
    userId: 'other',
    isAvailable: true,
    role: UserRoles.COACH,
    firstName: 'Max',
  };

  beforeEach(() => {
    (useContactEligibility as jest.Mock).mockReturnValue({
      openConversationOrGate,
    });
  });

  it('renders nothing on the own profile', () => {
    const { container } = renderWithUser(
      <ProfileContactCard {...props} userId="me" />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('invites to contact an available coach and opens the conversation', () => {
    renderWithUser(<ProfileContactCard {...props} />);
    expect(screen.getByText('Contacter Max')).toBeInTheDocument();
    expect(
      screen.getByText(/pour qu'il\/elle vous aide dans votre recherche/)
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Envoyer un message' }));
    expect(openConversationOrGate).toHaveBeenCalledWith('other');
  });

  it('uses the candidate wording for a candidate', () => {
    renderWithUser(
      <ProfileContactCard
        {...props}
        role={UserRoles.CANDIDATE}
        firstName="Léa"
      />
    );
    expect(
      screen.getByText(/pour l'aider dans sa recherche d'emploi/)
    ).toBeInTheDocument();
  });

  it('explains that an unavailable member cannot be contacted', () => {
    renderWithUser(<ProfileContactCard {...props} isAvailable={false} />);
    expect(
      screen.getByText(/n'est pas disponible pour le moment/)
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Envoyer un message' })
    ).toBeNull();
  });
});

describe('ProfileDeleteAccount', () => {
  it('opens the delete account modal', () => {
    renderWithProviders(<ProfileDeleteAccount />);
    // The card starts collapsed: open it first.
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }));
    expect(mockOpenModal).toHaveBeenCalledTimes(1);
  });
});

describe('ProfileDescription', () => {
  it('shows the description', () => {
    renderWithProviders(<ProfileDescription description="Bonjour à tous" />);
    expect(screen.getByText('Bonjour à tous')).toBeInTheDocument();
  });

  it('shows the fallback when there is no description', () => {
    renderWithProviders(<ProfileDescription description={null} />);
    expect(
      screen.getByText('Vous n’avez pas encore rédigé de présentation')
    ).toBeInTheDocument();
  });

  it('opens the edit modal for the current user', () => {
    renderWithProviders(<ProfileDescription description="Salut" isEditable />);
    fireEvent.click(screen.getByRole('button', { name: 'Modifier' }));
    expect(mockOpenModal.mock.calls[0][0].props.user).toMatchObject({
      id: 'me',
    });
  });
});

describe('ProfileLinkedInConnect', () => {
  it('renders nothing for a candidate', () => {
    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      id: 'me',
      role: UserRoles.CANDIDATE,
    });
    const { container } = renderWithProviders(<ProfileLinkedInConnect />);
    expect(container).toBeEmptyDOMElement();
  });

  it('requests the LinkedIn OAuth url and keeps the button disabled while redirecting', async () => {
    mockedApi.getLinkedinOAuthUrl.mockResolvedValue({
      data: { url: '#linkedin-oauth' },
    } as never);
    renderWithProviders(<ProfileLinkedInConnect />);
    const button = screen.getByRole('button', {
      name: 'Lier mon compte LinkedIn',
    });
    fireEvent.click(button);
    await waitFor(() => expect(button).toBeDisabled());
    expect(mockedApi.getLinkedinOAuthUrl).toHaveBeenCalledTimes(1);
    expect(window.location.hash).toBe('#linkedin-oauth');
  });

  it('notifies and re-enables the button when linking fails', async () => {
    mockedApi.getLinkedinOAuthUrl.mockRejectedValue(new Error('boom'));
    const { store } = renderWithProviders(<ProfileLinkedInConnect />);
    const button = screen.getByRole('button', {
      name: 'Lier mon compte LinkedIn',
    });
    fireEvent.click(button);
    await waitFor(() =>
      expect(notifications(store)).toContain(
        'Une erreur est survenue. Veuillez réessayer.'
      )
    );
    expect(button).toBeEnabled();
  });

  it('unlinks the account and refreshes the user', async () => {
    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      id: 'me',
      role: UserRoles.COACH,
      hasLinkedinLinked: true,
    });
    mockedApi.deleteLinkedinLink.mockResolvedValue({} as never);
    const store = createTestStore();
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    renderWithProviders(<ProfileLinkedInConnect />, { store });
    expect(
      screen.getByText(/Votre compte LinkedIn est lié/)
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole('button', { name: 'Délier mon compte LinkedIn' })
    );
    await waitFor(() =>
      expect(notifications(store)).toContain(
        'Compte LinkedIn délié avec succès.'
      )
    );
    expect(mockedApi.deleteLinkedinLink).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      currentUserActions.fetchUserRequested()
    );
  });

  it('notifies when unlinking fails', async () => {
    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      id: 'me',
      role: UserRoles.COACH,
      hasLinkedinLinked: true,
    });
    mockedApi.deleteLinkedinLink.mockRejectedValue(new Error('boom'));
    const { store } = renderWithProviders(<ProfileLinkedInConnect />);
    fireEvent.click(
      screen.getByRole('button', { name: 'Délier mon compte LinkedIn' })
    );
    await waitFor(() =>
      expect(notifications(store)).toContain(
        'Une erreur est survenue. Veuillez réessayer.'
      )
    );
  });
});

describe('ProfileProfessionalInformations', () => {
  const props = {
    userFirstName: 'Léa',
    sectorOccupations: [],
    description: '',
    skills: [],
    role: UserRoles.CANDIDATE,
    company: null,
  } as React.ComponentProps<typeof ProfileProfessionalInformations>;

  it('shows the fallback when nothing is filled', () => {
    renderWithProviders(<ProfileProfessionalInformations {...props} />);
    expect(
      screen.getByText(
        "Léa n'a pas encore renseigné ses informations professionnelles"
      )
    ).toBeInTheDocument();
  });

  it('shows the description and skills', () => {
    renderWithProviders(
      <ProfileProfessionalInformations
        {...props}
        description="Passionnée"
        skills={[{ name: 'Excel' }] as never}
      />
    );
    expect(screen.getByText('Passionnée')).toBeInTheDocument();
    expect(screen.getByText("J'ai des compétences dans :")).toBeInTheDocument();
    expect(screen.getByText('Excel')).toBeInTheDocument();
    expect(screen.queryByText(/career-sentence/)).toBeNull();
  });

  it('shows the career sentence when there is a sector or a company', () => {
    renderWithProviders(
      <ProfileProfessionalInformations
        {...props}
        sectorOccupations={[{ id: '1' }] as never}
        currentJob="Plombier"
      />
    );
    expect(screen.getByText('career-sentence:Plombier')).toBeInTheDocument();
  });

  it('shows the career sentence for a company alone', () => {
    renderWithProviders(
      <ProfileProfessionalInformations
        {...props}
        description="x"
        company={{ name: 'ACME' } as never}
      />
    );
    expect(screen.getByText('career-sentence:none')).toBeInTheDocument();
  });
});

describe('ProfileStats', () => {
  const baseProps = {
    createdAt: null,
    userRole: UserRoles.COACH,
    averageDelayResponse: null,
    lastConnection: '',
    responseRate: null,
    totalConversationWithMirrorRoleCount: null,
    availableMirrorRoleParticipantsCount: null,
    isOwnProfile: false,
  };

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders nothing when there is no stat', () => {
    renderWithProviders(<ProfileStats {...baseProps} />);
    expect(screen.queryByText(/./)).toBeNull();
  });

  it('shows the membership date in French', () => {
    renderWithProviders(
      <ProfileStats {...baseProps} createdAt="2024-03-05T12:00:00.000Z" />
    );
    expect(
      screen.getByText(/Membre depuis le 5 mars 2024/)
    ).toBeInTheDocument();
  });

  it('shows the last connection in days, today, and hides it on own profile', () => {
    jest.useFakeTimers().setSystemTime(new Date('2025-01-10T12:00:00Z'));
    const { rerender } = renderWithProviders(
      <ProfileStats {...baseProps} lastConnection="2025-01-10T08:00:00Z" />
    );
    expect(
      screen.getByText("Dernière connexion aujourd'hui")
    ).toBeInTheDocument();

    rerender(
      <ProfileStats {...baseProps} lastConnection="2025-01-09T08:00:00Z" />
    );
    expect(
      screen.getByText("Dernière connexion il y'a 1 jour")
    ).toBeInTheDocument();

    rerender(
      <ProfileStats {...baseProps} lastConnection="2025-01-05T08:00:00Z" />
    );
    expect(
      screen.getByText("Dernière connexion il y'a 5 jours")
    ).toBeInTheDocument();

    rerender(
      <ProfileStats
        {...baseProps}
        isOwnProfile
        lastConnection="2025-01-05T08:00:00Z"
      />
    );
    expect(screen.queryByText(/Dernière connexion/)).toBeNull();
  });

  it('shows the response rate, including 0%', () => {
    renderWithProviders(<ProfileStats {...baseProps} responseRate={0} />);
    expect(screen.getByText('Répond à 0% des messages')).toBeInTheDocument();
  });

  it('words the average response delay', () => {
    const { rerender } = renderWithProviders(
      <ProfileStats {...baseProps} averageDelayResponse={1} />
    );
    expect(screen.getByText("Répond en moins d'un jour")).toBeInTheDocument();
    rerender(<ProfileStats {...baseProps} averageDelayResponse={3} />);
    expect(screen.getByText('Répond en moins de 3 jours')).toBeInTheDocument();
  });

  it('counts supported candidates for a coach only', () => {
    const { rerender } = renderWithProviders(
      <ProfileStats {...baseProps} totalConversationWithMirrorRoleCount={1} />
    );
    expect(screen.getByText('1 candidat soutenu')).toBeInTheDocument();
    rerender(
      <ProfileStats {...baseProps} totalConversationWithMirrorRoleCount={4} />
    );
    expect(screen.getByText('4 candidats soutenus')).toBeInTheDocument();
    rerender(
      <ProfileStats
        {...baseProps}
        userRole={UserRoles.CANDIDATE}
        totalConversationWithMirrorRoleCount={4}
      />
    );
    expect(screen.queryByText(/soutenu/)).toBeNull();
  });

  it('counts the coaches beside a candidate only', () => {
    const { rerender } = renderWithProviders(
      <ProfileStats
        {...baseProps}
        userRole={UserRoles.CANDIDATE}
        availableMirrorRoleParticipantsCount={1}
      />
    );
    expect(screen.getByText('1 coach à ses côtés')).toBeInTheDocument();
    rerender(
      <ProfileStats
        {...baseProps}
        userRole={UserRoles.CANDIDATE}
        availableMirrorRoleParticipantsCount={2}
      />
    );
    expect(screen.getByText('2 coachs à ses côtés')).toBeInTheDocument();
    rerender(
      <ProfileStats {...baseProps} availableMirrorRoleParticipantsCount={2} />
    );
    expect(screen.queryByText(/à ses côtés/)).toBeNull();
  });
});
