import { fireEvent, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import React from 'react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default, import-x/order
import expect from 'expect';
import { Api } from '@/src/api';
import { UserRoles } from '@/src/constants/users';
import { openModal } from '@/src/features/modals/Modal';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import { gaEvent } from '@/src/lib/gtag';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { currentUserActions } from '@/src/use-cases/current-user';
import { ProfileCustomNudges } from '../ProfileCustomNudges/ProfileCustomNudges';
import { ProfileDocuments } from '../ProfileDocuments/ProfileDocuments';
import { ProfileExperiences } from '../ProfileExperiences/ProfileExperiences';
import { ProfileFormations } from '../ProfileFormations/ProfileFormations';

jest.mock('@/src/api');
jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('@/src/features/modals/Modal', () => ({ openModal: jest.fn() }));
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: jest.fn(),
}));
jest.mock('@/src/hooks/useUpdateProfile', () => ({
  useUpdateProfile: jest.fn(),
}));
jest.mock('@/src/lib/gtag', () => ({ gaEvent: jest.fn() }));
jest.mock('@/src/features/modals/Modal/ModalGeneric/ModalEdit', () => ({
  ModalEdit: () => null,
}));

const mockOpenModal = openModal as jest.Mock;
const updateUserProfile = jest.fn();
const push = jest.fn();

const openedProps = () =>
  mockOpenModal.mock.calls[mockOpenModal.mock.calls.length - 1][0].props;

// The card header always has a collapse chevron: only keep action buttons.
const actionButtons = () =>
  screen
    .queryAllByRole('button')
    .filter(
      (b) => !b.querySelector('svg.lucide-chevron-up, svg.lucide-chevron-down')
    );

const renderWithCurrentUser = (
  ui: React.ReactElement,
  currentUserId = 'me'
) => {
  const store = createTestStore();
  store.dispatch(
    currentUserActions.fetchUserSucceeded({
      id: currentUserId,
      role: UserRoles.CANDIDATE,
    } as never)
  );
  return renderWithProviders(ui, { store });
};

// Spies (and stubs) dispatch before render so the component captures the spy.
const renderSpyingDispatch = (ui: React.ReactElement) => {
  const store = createTestStore();
  store.dispatch(
    currentUserActions.fetchUserSucceeded({
      id: 'me',
      role: UserRoles.CANDIDATE,
    } as never)
  );
  const dispatchSpy = jest
    .spyOn(store, 'dispatch')
    .mockImplementation(((action: unknown) => action) as never);
  renderWithProviders(ui, { store });
  return { dispatchSpy };
};

beforeEach(() => {
  jest.clearAllMocks();
  (useRouter as jest.Mock).mockReturnValue({ push });
  (useAuthenticatedUser as jest.Mock).mockReturnValue({
    id: 'me',
    role: UserRoles.CANDIDATE,
  });
  (useUpdateProfile as jest.Mock).mockReturnValue({ updateUserProfile });
});

const experience = {
  id: 'e1',
  title: 'Dev',
  company: 'ACME',
  description: 'Built things',
  skills: [],
};

describe('ProfileExperiences', () => {
  it('lists experiences on a visited profile without CTA when completed', () => {
    renderWithCurrentUser(
      <ProfileExperiences
        userId="other"
        userFirstName="Léa"
        userRole={UserRoles.CANDIDATE}
        experiences={[experience] as never}
      />
    );
    expect(screen.getByText('Dev')).toBeInTheDocument();
    expect(actionButtons()).toHaveLength(0);
  });

  it('invites a visitor to talk to a candidate who has no experience', () => {
    renderWithCurrentUser(
      <ProfileExperiences
        userId="other"
        userFirstName="Léa"
        userRole={UserRoles.CANDIDATE}
      />
    );
    expect(
      screen.getByText("Léa n'a pas encore renseigné ses expériences")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Échanger avec Léa' }));
    expect(push).toHaveBeenCalledWith('/backoffice/messaging?userId=other');
  });

  it('shows no CTA for a visitor on a coach without experience', () => {
    renderWithCurrentUser(
      <ProfileExperiences
        userId="other"
        userFirstName="Max"
        userRole={UserRoles.COACH}
      />
    );
    expect(actionButtons()).toHaveLength(0);
  });

  it('shows the candidate fallback and an "Ajouter" CTA on the own editable profile', () => {
    renderWithCurrentUser(
      <ProfileExperiences
        userId="me"
        userFirstName="Moi"
        userRole={UserRoles.CANDIDATE}
        isEditable
      />
    );
    expect(
      screen.getByText(/Elle est essentielle pour nos coachs/)
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter' }));
    expect(mockOpenModal).toHaveBeenCalledTimes(1);
  });

  it('shows the coach fallback without the coach sentence', () => {
    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      id: 'me',
      role: UserRoles.COACH,
    });
    renderWithCurrentUser(
      <ProfileExperiences
        userId="me"
        userFirstName="Moi"
        userRole={UserRoles.COACH}
        isEditable
      />
    );
    expect(
      screen.queryByText(/Elle est essentielle pour nos coachs/)
    ).toBeNull();
    expect(
      screen.getByText(/nous vous invitons à la partager/)
    ).toBeInTheDocument();
  });

  it('saves the new experience list after adding one', () => {
    renderWithCurrentUser(
      <ProfileExperiences
        userId="me"
        userFirstName="Moi"
        userRole={UserRoles.CANDIDATE}
        experiences={[experience] as never}
        isEditable
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter' }));
    openedProps().dispatchOnSubmit({
      title: 'Nouveau',
      location: '',
      company: '',
      startDate: '',
      endDate: '',
      description: '',
      skills: [],
    });
    const saved = updateUserProfile.mock.calls[0][0].experiences;
    expect(saved).toHaveLength(2);
    expect(saved[1].title).toBe('Nouveau');
  });

  it('deletes an experience through the timeline tool', () => {
    renderWithCurrentUser(
      <ProfileExperiences
        userId="me"
        userFirstName="Moi"
        userRole={UserRoles.CANDIDATE}
        experiences={[experience] as never}
        isEditable
      />
    );
    // buttons: edit, delete (timeline) then the "Ajouter" CTA
    const buttons = actionButtons();
    fireEvent.click(buttons[1]);
    expect(updateUserProfile).toHaveBeenCalledWith({ experiences: [] });
  });

  it('opens the edit modal on the existing experience', () => {
    renderWithCurrentUser(
      <ProfileExperiences
        userId="me"
        userFirstName="Moi"
        userRole={UserRoles.CANDIDATE}
        experiences={[experience] as never}
        isEditable
      />
    );
    fireEvent.click(actionButtons()[0]);
    expect(openedProps().experience).toMatchObject({ id: 'e1' });
  });
});

describe('ProfileFormations', () => {
  const formation = {
    id: 'f1',
    title: 'Master',
    institution: 'Univ',
    skills: [],
  };

  it('lists formations', () => {
    renderWithCurrentUser(
      <ProfileFormations
        userId="other"
        userFirstName="Léa"
        userRole={UserRoles.CANDIDATE}
        formations={[formation] as never}
      />
    );
    expect(screen.getByText('Master')).toBeInTheDocument();
    expect(screen.getByText('Univ')).toBeInTheDocument();
  });

  it('shows the visitor fallback and the discussion CTA', () => {
    renderWithCurrentUser(
      <ProfileFormations
        userId="other"
        userFirstName="Léa"
        userRole={UserRoles.CANDIDATE}
      />
    );
    expect(
      screen.getByText("Léa n'a pas encore renseigné ses formations")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Échanger avec Léa' }));
    expect(push).toHaveBeenCalledWith('/backoffice/messaging?userId=other');
  });

  it('shows the owner fallback and saves a new formation', () => {
    renderWithCurrentUser(
      <ProfileFormations
        userId="me"
        userFirstName="Moi"
        userRole={UserRoles.CANDIDATE}
        isEditable
      />
    );
    expect(
      screen.getByText('Vous n’avez pas encore renseigné vos formations')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter' }));
    openedProps().dispatchOnSubmit({
      title: 'BTS',
      location: '',
      institution: 'Lycée',
      startDate: '',
      endDate: '',
      description: '',
      skills: [],
    });
    expect(updateUserProfile).toHaveBeenCalledWith({
      formations: [
        expect.objectContaining({ title: 'BTS', institution: 'Lycée' }),
      ],
    });
  });

  it('edits and deletes an existing formation', () => {
    renderWithCurrentUser(
      <ProfileFormations
        userId="me"
        userFirstName="Moi"
        userRole={UserRoles.CANDIDATE}
        formations={[formation] as never}
        isEditable
      />
    );
    const buttons = actionButtons();
    fireEvent.click(buttons[0]);
    expect(openedProps().formation).toMatchObject({ id: 'f1' });
    fireEvent.click(buttons[1]);
    expect(updateUserProfile).toHaveBeenCalledWith({ formations: [] });
  });
});

describe('ProfileDocuments', () => {
  const mockedApi = Api as jest.Mocked<typeof Api>;
  let windowOpen: jest.SpyInstance;

  beforeEach(() => {
    windowOpen = jest.spyOn(window, 'open').mockImplementation(() => null);
  });

  afterEach(() => {
    windowOpen.mockRestore();
  });

  it('renders nothing on a profile view without LinkedIn url', () => {
    const { container } = renderWithCurrentUser(
      <ProfileDocuments userId="me" hasExternalCv />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('opens the LinkedIn profile from the profile view and hides the CV', () => {
    renderWithCurrentUser(
      <ProfileDocuments
        userId="me"
        linkedinUrl="https://linkedin.com/in/x"
        hasExternalCv
      />
    );
    expect(screen.queryByText('Mon CV perso')).toBeNull();
    fireEvent.click(screen.getByText('Mon profil LinkedIn'));
    expect(windowOpen).toHaveBeenCalledWith(
      'https://linkedin.com/in/x',
      '_blank'
    );
  });

  it('shows the empty fallback when editable without documents', () => {
    renderWithCurrentUser(<ProfileDocuments userId="me" isEditable />);
    expect(
      screen.getByText(/pas encore ajouté votre lien LinkedIn/)
    ).toBeInTheDocument();
  });

  it('removes the LinkedIn url when editable', () => {
    renderWithCurrentUser(
      <ProfileDocuments
        userId="me"
        isEditable
        linkedinUrl="https://linkedin.com/in/x"
      />
    );
    // The X button is the only icon-only action (the CTA has a label).
    const removal = actionButtons().find((b) => !b.textContent);
    fireEvent.click(removal as HTMLElement);
    expect(updateUserProfile).toHaveBeenCalledWith({ linkedinUrl: null });
  });

  it('fetches and opens the external CV, tracking the click', async () => {
    mockedApi.getExternalCvByUser.mockResolvedValue({
      data: { url: 'https://cdn/cv.pdf' },
    } as never);
    renderWithCurrentUser(
      <ProfileDocuments userId="me" isEditable hasExternalCv />
    );
    fireEvent.click(screen.getByText('Mon CV perso'));
    await waitFor(() =>
      expect(windowOpen).toHaveBeenCalledWith('https://cdn/cv.pdf', '_blank')
    );
    expect(mockedApi.getExternalCvByUser).toHaveBeenCalledWith('me');
    expect(gaEvent).toHaveBeenCalledTimes(1);
  });

  it('only updates the profile when the LinkedIn url changed', () => {
    renderWithCurrentUser(
      <ProfileDocuments
        userId="me"
        isEditable
        linkedinUrl="https://old.example"
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Modifier' }));
    expect(openedProps().linkedinUrl).toBe('https://old.example');

    openedProps().dispatchOnSubmit({ linkedinUrl: 'https://old.example' });
    expect(updateUserProfile).not.toHaveBeenCalled();

    openedProps().dispatchOnSubmit({ linkedinUrl: 'https://new.example' });
    expect(updateUserProfile).toHaveBeenCalledWith({
      linkedinUrl: 'https://new.example',
    });

    openedProps().dispatchOnSubmit({ linkedinUrl: '' });
    expect(updateUserProfile).toHaveBeenLastCalledWith({ linkedinUrl: null });
  });

  it('dispatches the external CV upload when a file is provided', () => {
    const { dispatchSpy } = renderSpyingDispatch(
      <ProfileDocuments userId="me" isEditable />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter' }));
    const file = new File(['x'], 'cv.pdf');
    openedProps().dispatchOnSubmit({
      linkedinUrl: undefined,
      externalCv: [file],
    });
    const action = dispatchSpy.mock.calls[0][0] as {
      type: string;
      payload: { formData: FormData };
    };
    expect(action.type).toBe(currentUserActions.uploadExternalCvRequested.type);
    expect(action.payload.formData.get('file')).toBe(file);
  });

  it('dispatches the external CV deletion', () => {
    const { dispatchSpy } = renderSpyingDispatch(
      <ProfileDocuments userId="me" isEditable hasExternalCv />
    );
    const removal = actionButtons().find((b) => !b.textContent);
    fireEvent.click(removal as HTMLElement);
    expect(dispatchSpy).toHaveBeenCalledWith(
      currentUserActions.deleteExternalCvRequested()
    );
  });
});

describe('ProfileCustomNudges', () => {
  const nudges = [
    { id: 'n1', content: 'Relire mon CV' },
    { id: 'n2', content: 'Préparer un entretien' },
  ] as never[];

  it('uses the candidate title on the own editable profile', () => {
    renderWithCurrentUser(
      <ProfileCustomNudges
        userId="me"
        firstName="Moi"
        role={UserRoles.CANDIDATE}
        customNudges={[]}
        isEditable
        ownProfile
      />
    );
    expect(screen.getByText('Détaillez vos besoins')).toBeInTheDocument();
    expect(
      screen.getByText(/Détaillez précisément vos besoins/)
    ).toBeInTheDocument();
  });

  it('uses the first name in the title of a visited candidate', () => {
    renderWithCurrentUser(
      <ProfileCustomNudges
        userId="other"
        firstName="Léa"
        role={UserRoles.CANDIDATE}
        customNudges={nudges}
      />
    );
    expect(screen.getByText('Demandes de Léa')).toBeInTheDocument();
  });

  it('uses the offers title for a coach', () => {
    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      id: 'me',
      role: UserRoles.COACH,
    });
    renderWithCurrentUser(
      <ProfileCustomNudges
        userId="me"
        firstName="Moi"
        role={UserRoles.COACH}
        customNudges={[]}
        isEditable
      />
    );
    expect(screen.getByText('Détaillez vos offres')).toBeInTheDocument();
    expect(
      screen.getByText(/coups de pouce que vous pouvez offrir/)
    ).toBeInTheDocument();
  });

  it('lets a visitor reply to a request', () => {
    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      id: 'visitor',
      role: UserRoles.COACH,
    });
    renderWithCurrentUser(
      <ProfileCustomNudges
        userId="other"
        firstName="Léa"
        role={UserRoles.CANDIDATE}
        customNudges={nudges}
      />,
      'visitor'
    );
    const replies = screen.getAllByRole('button', { name: 'Répondre' });
    expect(replies).toHaveLength(2);
    fireEvent.click(replies[0]);
    expect(push).toHaveBeenCalledWith('/backoffice/messaging?userId=other');
  });

  it('offers no reply on the own profile', () => {
    renderWithCurrentUser(
      <ProfileCustomNudges
        userId="me"
        firstName="Moi"
        role={UserRoles.CANDIDATE}
        customNudges={nudges}
      />
    );
    expect(screen.queryByRole('button', { name: 'Répondre' })).toBeNull();
  });

  it('adds a nudge from the CTA', () => {
    renderWithCurrentUser(
      <ProfileCustomNudges
        userId="me"
        firstName="Moi"
        role={UserRoles.CANDIDATE}
        customNudges={nudges}
        isEditable
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter' }));
    expect(openedProps().customNudge).toBeUndefined();
    openedProps().dispatchOnSubmit({ content: 'Nouveau' });
    expect(updateUserProfile).toHaveBeenCalledWith({
      customNudges: [...nudges, { id: undefined, content: 'Nouveau' }],
    });
  });

  it('edits and deletes an existing nudge', () => {
    renderWithCurrentUser(
      <ProfileCustomNudges
        userId="me"
        firstName="Moi"
        role={UserRoles.CANDIDATE}
        customNudges={nudges}
        isEditable
      />
    );
    // Per nudge: pencil then trash.
    const buttons = actionButtons();
    fireEvent.click(buttons[0]);
    expect(openedProps().customNudge).toBe(nudges[0]);
    openedProps().dispatchOnSubmit({ content: 'Modifié' });
    expect(updateUserProfile).toHaveBeenCalledWith({
      customNudges: [nudges[1], { id: 'n1', content: 'Modifié' }],
    });

    fireEvent.click(buttons[1]);
    expect(updateUserProfile).toHaveBeenLastCalledWith({
      customNudges: [nudges[1]],
    });
  });
});
