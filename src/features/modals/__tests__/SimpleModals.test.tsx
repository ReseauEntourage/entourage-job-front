import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default, import-x/order
import expect from 'expect';
import { Api } from '@/src/api';
import { STORAGE_KEYS } from '@/src/constants';
import { UserRoles } from '@/src/constants/users';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import { useIsDesktop } from '@/src/hooks/utils';
import { fbEvent } from '@/src/lib/fb';
import { gaEvent } from '@/src/lib/gtag';
import { linkEvent } from '@/src/lib/lintrk';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { authenticationActions } from '@/src/use-cases/authentication';
import { companyActions } from '@/src/use-cases/company';
import { AchievementProgressionModal } from '../AchievementProgressionModal/AchievementProgressionModal';
import { CompanyInviteCollaboratorsModal } from '../CompanyInviteCollaboratorsModal/CompanyInviteCollaboratorsModal';
import { DeleteAccountModal } from '../DeleteAccountModal/DeleteAccountModal';
import { ElearningGateModal } from '../ElearningGateModal/ElearningGateModal';
import { ElearningSkipConfirmationModal } from '../ElearningSkipConfirmationModal/ElearningSkipConfirmationModal';
import { FeedbackModal } from '../FeedbackModal/FeedbackModal';
import { LinkedInPostWhatsAppInviteModal } from '../LinkedInPostWhatsAppInviteModal/LinkedInPostWhatsAppInviteModal';
import { ModalContext } from '../Modal/ModalContext';
import { CompanyContactModal } from '../Modal/ModalGeneric/CompanyContactModal/CompanyContactModal';
import { ModalInterestLinkedOut } from '../Modal/ModalGeneric/StepperModal/ModalInterestLinkedOut/ModalInterestLinkedOut';
import { ModalShareCV } from '../Modal/ModalGeneric/StepperModal/ModalShareCV/ModalShareCV';
import { PinnedCommunicationModale } from '../PopupModal/PinnedCommunicationModale';
import { PrettyModal } from '../PrettyModal/PrettyModal';
import { SuccessModalContent } from '../SuccessModalContent';

jest.mock('@/src/api');
jest.mock('@/src/lib/gtag', () => ({ gaEvent: jest.fn() }));
jest.mock('@/src/lib/fb', () => ({ fbEvent: jest.fn() }));
jest.mock('@/src/lib/lintrk', () => ({ linkEvent: jest.fn() }));
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: jest.fn(),
}));
jest.mock('@/src/hooks/useUpdateProfile', () => ({
  useUpdateProfile: jest.fn(),
}));
jest.mock('@/src/hooks/utils', () => ({
  ...jest.requireActual('@/src/hooks/utils'),
  useIsDesktop: jest.fn(),
}));
jest.mock('next/image', () => ({
  __esModule: true,

  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

const mockForm = jest.fn();
jest.mock('@/src/features/forms/FormWithValidation', () => ({
  FormWithValidation: (props: { onCancel?: () => void }) => {
    mockForm(props);
    return (
      <button type="button" onClick={props.onCancel}>
        cancel-form
      </button>
    );
  },
}));

const mockedApi = Api as jest.Mocked<typeof Api>;
const lastForm = () => mockForm.mock.calls[mockForm.mock.calls.length - 1][0];

const notifications = (store: { getState: () => unknown }) =>
  (
    store.getState() as {
      notifications: { notifications: { message: string; type: string }[] };
    }
  ).notifications.notifications;

// Store whose dispatch is recorded, and swallowed so no listener runs.
const createStubbedStore = () => {
  const store = createTestStore();
  const dispatchSpy = jest
    .spyOn(store, 'dispatch')
    .mockImplementation(((action: unknown) => action) as never);
  return { store, dispatchSpy };
};

const renderInModal = (
  ui: React.ReactElement,
  onClose = jest.fn(),
  store?: ReturnType<typeof createTestStore>
) => {
  const utils = renderWithProviders(
    <ModalContext.Provider value={{ onClose }}>{ui}</ModalContext.Provider>,
    { store }
  );
  return { onClose, ...utils };
};

beforeEach(() => {
  jest.clearAllMocks();
  Element.prototype.scrollTo = jest.fn();
  (useIsDesktop as jest.Mock).mockReturnValue(true);
  (useAuthenticatedUser as jest.Mock).mockReturnValue({
    id: 'me',
    role: UserRoles.COACH,
  });
});

describe('SuccessModalContent', () => {
  it('shows the text and closes', () => {
    const closeModal = jest.fn();
    render(<SuccessModalContent text="Bravo" closeModal={closeModal} />);
    expect(screen.getByText('Bravo')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('success-close-modal'));
    expect(closeModal).toHaveBeenCalledTimes(1);
  });
});

describe('PrettyModal', () => {
  it('renders title, subtitle, children and the default CTA', () => {
    renderInModal(
      <PrettyModal id="pm" title="Titre" subtitle="Sous-titre">
        <p>Contenu</p>
      </PrettyModal>
    );
    expect(screen.getByText('Titre')).toBeInTheDocument();
    expect(screen.getByText('Sous-titre')).toBeInTheDocument();
    expect(screen.getByText('Contenu')).toBeInTheDocument();
    expect(screen.getByTestId('pm-submit-btn')).toHaveTextContent('Envoyer');
  });

  it('awaits onSubmit then closes', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const { onClose } = renderInModal(
      <PrettyModal
        id="pm"
        title="Titre"
        onSubmit={onSubmit}
        submitBtnTxt="Ok"
      />
    );
    fireEvent.click(screen.getByTestId('pm-submit-btn'));
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('disables the CTA and shows the secondary action', () => {
    renderInModal(
      <PrettyModal
        id="pm"
        title="Titre"
        submitDisabled
        secondaryAction={<button>Plus tard</button>}
      />
    );
    expect(screen.getByTestId('pm-submit-btn')).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Plus tard' })
    ).toBeInTheDocument();
  });
});

describe('ElearningGateModal', () => {
  it('explains the requirement and links to the trainings', () => {
    const { onClose } = renderInModal(<ElearningGateModal />);
    expect(screen.getByText('Formation requise')).toBeInTheDocument();
    const link = screen.getByTestId('elearning-gate-formations-link');
    expect(link.closest('a')).toHaveAttribute(
      'href',
      '/backoffice/ressources/formations'
    );
    fireEvent.click(link);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes from the close button', () => {
    const { onClose } = renderInModal(<ElearningGateModal />);
    fireEvent.click(screen.getByTestId('elearning-gate-close-btn'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('ElearningSkipConfirmationModal', () => {
  it('addresses coaches to candidates', () => {
    renderInModal(
      <ElearningSkipConfirmationModal
        userRole={UserRoles.COACH}
        onConfirmSkip={jest.fn()}
      />
    );
    expect(screen.getByText(/écrire aux candidats/)).toBeInTheDocument();
  });

  it('addresses candidates to coaches', () => {
    renderInModal(
      <ElearningSkipConfirmationModal
        userRole={UserRoles.CANDIDATE}
        onConfirmSkip={jest.fn()}
      />
    );
    expect(screen.getByText(/écrire aux coachs/)).toBeInTheDocument();
  });

  it('skips on demand and closes', () => {
    const onConfirmSkip = jest.fn();
    const { onClose } = renderInModal(
      <ElearningSkipConfirmationModal
        userRole={UserRoles.COACH}
        onConfirmSkip={onConfirmSkip}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /Passer quand même/ }));
    expect(onConfirmSkip).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('only closes when continuing the training', async () => {
    const onConfirmSkip = jest.fn();
    const { onClose } = renderInModal(
      <ElearningSkipConfirmationModal
        userRole={UserRoles.COACH}
        onConfirmSkip={onConfirmSkip}
      />
    );
    fireEvent.click(screen.getByText('Continuer ma formation'));
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(onConfirmSkip).not.toHaveBeenCalled();
  });
});

describe('DeleteAccountModal', () => {
  it('deletes the account then logs out', async () => {
    mockedApi.deleteUser.mockResolvedValue({} as never);
    const { store, dispatchSpy } = createStubbedStore();
    const { onClose } = renderInModal(<DeleteAccountModal />, jest.fn(), store);
    expect(
      screen.getByText(/Êtes-vous sur de vouloir supprimer votre compte/)
    ).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('modal-confirm-confirm'));
    await waitFor(() =>
      expect(dispatchSpy).toHaveBeenCalledWith(
        authenticationActions.logoutRequested()
      )
    );
    expect(mockedApi.deleteUser).toHaveBeenCalledWith('me');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('can be cancelled without calling the API', () => {
    const { onClose } = renderInModal(<DeleteAccountModal />);
    fireEvent.click(screen.getByTestId('modal-confirm-cancel'));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(mockedApi.deleteUser).not.toHaveBeenCalled();
  });
});

describe('CompanyContactModal', () => {
  const submitForm = async () => {
    const closeModal = jest.fn();
    await act(async () => {
      await lastForm().onSubmit({ email: 'a@b.fr' }, jest.fn());
    });
    return closeModal;
  };

  it('sends the contact request, tracks it and thanks the user', async () => {
    mockedApi.postContactCompany.mockResolvedValue({} as never);
    const { store, onClose } = renderInModal(<CompanyContactModal />);
    await submitForm();
    expect(mockedApi.postContactCompany).toHaveBeenCalledWith({
      email: 'a@b.fr',
    });
    expect(gaEvent).toHaveBeenCalledTimes(1);
    expect(fbEvent).toHaveBeenCalledTimes(1);
    expect(linkEvent).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(notifications(store)[0]).toMatchObject({ type: 'success' });
  });

  it('notifies an error and keeps the modal open on failure', async () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    mockedApi.postContactCompany.mockRejectedValue(new Error('boom'));
    const { store, onClose } = renderInModal(<CompanyContactModal />);
    await submitForm();
    expect(onClose).not.toHaveBeenCalled();
    expect(gaEvent).not.toHaveBeenCalled();
    expect(notifications(store)[0]).toMatchObject({ type: 'danger' });
    consoleError.mockRestore();
  });
});

describe('ModalInterestLinkedOut', () => {
  it('moves to the success step after sending, then closes', async () => {
    mockedApi.postContactContactUs.mockResolvedValue({} as never);
    const { onClose } = renderInModal(<ModalInterestLinkedOut />);
    await act(async () => {
      await lastForm().onSubmit({ email: 'a@b.fr' }, jest.fn());
    });
    await waitFor(() =>
      expect(screen.getByText('Merci pour votre message !')).toBeInTheDocument()
    );
    fireEvent.click(screen.getByTestId('success-close-modal'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows an error and stays on the form when sending fails', async () => {
    mockedApi.postContactContactUs.mockRejectedValue(new Error('boom'));
    renderInModal(<ModalInterestLinkedOut />);
    const setError = jest.fn();
    await act(async () => {
      await lastForm().onSubmit({}, setError);
    });
    expect(setError).toHaveBeenCalledWith("Une erreur s'est produite");
    expect(screen.queryByText('Merci pour votre message !')).toBeNull();
  });

  it('closes when the form is cancelled', () => {
    const { onClose } = renderInModal(<ModalInterestLinkedOut />);
    fireEvent.click(screen.getByText('cancel-form'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('ModalShareCV', () => {
  it('thanks the sharer by first name and subscribes the email', async () => {
    mockedApi.postNewsletter.mockResolvedValue({} as never);
    renderInModal(<ModalShareCV firstName="Léa" />);
    expect(screen.getByText(/Pour Léa, votre action/)).toBeInTheDocument();
    await act(async () => {
      await lastForm().onSubmit({ email: 'a@b.fr' });
    });
    expect(mockedApi.postNewsletter).toHaveBeenCalledWith({ email: 'a@b.fr' });
    expect(gaEvent).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(screen.getByText(/porté par l'association/)).toBeInTheDocument()
    );
  });

  it('notifies an error when the subscription fails', async () => {
    mockedApi.postNewsletter.mockRejectedValue(new Error('boom'));
    const { store } = renderInModal(<ModalShareCV firstName="Léa" />);
    await act(async () => {
      await lastForm().onSubmit({ email: 'a@b.fr' });
    });
    expect(notifications(store)[0]).toMatchObject({ type: 'danger' });
    expect(screen.queryByText(/porté par l'association/)).toBeNull();
  });

  const goToLastStep = async () => {
    mockedApi.postNewsletter.mockResolvedValue({} as never);
    const utils = renderInModal(<ModalShareCV firstName="Léa" />);
    await act(async () => {
      await lastForm().onSubmit({ email: 'a@b.fr' });
    });
    await waitFor(() => screen.getByText('En savoir plus'));
    return utils;
  };

  it('tracks the external link click and closes', async () => {
    const { onClose } = await goToLastStep();
    fireEvent.click(screen.getByText('En savoir plus'));
    expect(gaEvent).toHaveBeenCalledTimes(2);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes from the close button of the last step', async () => {
    const { onClose } = await goToLastStep();
    fireEvent.click(screen.getByText('Fermer'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('PinnedCommunicationModale', () => {
  const env = process.env;

  beforeEach(() => {
    process.env = { ...env };
    localStorage.clear();
  });

  afterAll(() => {
    process.env = env;
  });

  it('renders nothing without image or link configured', () => {
    delete process.env.NEXT_PUBLIC_PINNED_COMMUNICATION_IMAGE_URL;
    delete process.env.NEXT_PUBLIC_PINNED_COMMUNICATION_URL;
    const { container } = renderInModal(<PinnedCommunicationModale />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the communication as a link and remembers the closing', () => {
    process.env.NEXT_PUBLIC_PINNED_COMMUNICATION_TITLE = 'Nouveauté';
    process.env.NEXT_PUBLIC_PINNED_COMMUNICATION_IMAGE_URL = '/img.png';
    process.env.NEXT_PUBLIC_PINNED_COMMUNICATION_URL =
      'https://example.org/news';
    const { onClose } = renderInModal(<PinnedCommunicationModale />);
    expect(screen.getByText('Nouveauté')).toBeInTheDocument();
    expect(screen.getByAltText('Communication épinglée')).toHaveAttribute(
      'src',
      '/img.png'
    );
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      'https://example.org/news'
    );
    fireEvent.click(screen.getByTestId('generic-close-modal'));
    expect(localStorage.getItem(STORAGE_KEYS.PINNED_COMMUNICATION_CLOSED)).toBe(
      'true'
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('FeedbackModal', () => {
  const updateUserProfile = jest.fn();

  beforeEach(() => {
    (useUpdateProfile as jest.Mock).mockReturnValue({ updateUserProfile });
  });

  it('records the availability change with the chosen reason', () => {
    const { onClose } = renderInModal(<FeedbackModal />);
    lastForm().onSubmit({ unavailabilityReason: 'vacation' });
    expect(updateUserProfile).toHaveBeenCalledWith({
      unavailableAt: expect.any(String),
      unavailabilityReason: 'vacation',
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('still records the unavailability when the modal is dismissed', () => {
    const { onClose } = renderInModal(<FeedbackModal />);
    fireEvent.click(screen.getByTestId('generic-close-modal'));
    expect(updateUserProfile).toHaveBeenCalledWith({
      unavailableAt: expect.any(String),
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows no form without a role', () => {
    (useAuthenticatedUser as jest.Mock).mockReturnValue({ id: 'me' });
    renderInModal(<FeedbackModal />);
    expect(mockForm).not.toHaveBeenCalled();
  });
});

describe('LinkedInPostWhatsAppInviteModal', () => {
  const props = {
    firstName: 'Léa',
    linkedinPostUrl: 'https://linkedin.com/post/1',
  };

  it('shows the post link and lets the user postpone', () => {
    const { onClose } = renderInModal(
      <LinkedInPostWhatsAppInviteModal {...props} />
    );
    expect(screen.getByDisplayValue(props.linkedinPostUrl)).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('linkedin-whatsapp-invite-later'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('opens WhatsApp with the prefilled message then closes', () => {
    const windowOpen = jest
      .spyOn(window, 'open')
      .mockImplementation(() => null);
    const { onClose } = renderInModal(
      <LinkedInPostWhatsAppInviteModal {...props} />
    );
    fireEvent.click(screen.getByTestId('linkedin-whatsapp-invite-share'));
    const [url, target] = windowOpen.mock.calls[0];
    expect(String(url)).toMatch(/^https:\/\/wa\.me\/\?text=/);
    expect(decodeURIComponent(String(url))).toContain('profil de Léa');
    expect(decodeURIComponent(String(url))).toContain(props.linkedinPostUrl);
    expect(target).toBe('_blank');
    expect(onClose).toHaveBeenCalledTimes(1);
    windowOpen.mockRestore();
  });
});

describe('CompanyInviteCollaboratorsModal', () => {
  it('starts with the preamble and closes from it', () => {
    const { onClose } = renderInModal(
      <CompanyInviteCollaboratorsModal companyId="c1" />
    );
    expect(screen.getByText('La mission de coach')).toBeInTheDocument();
    expect(mockForm).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('Fermer'));
    expect(onClose).toHaveBeenCalled();
  });

  it('moves on to the form and dispatches the invited emails, then closes', () => {
    const { store, dispatchSpy } = createStubbedStore();
    const { onClose } = renderInModal(
      <CompanyInviteCollaboratorsModal companyId="c1" />,
      jest.fn(),
      store
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Inviter des collaborateurs' })
    );
    expect(screen.queryByText('La mission de coach')).toBeNull();
    act(() => {
      lastForm().onSubmit({
        emails: [{ value: 'a@b.fr' }, { value: 'c@d.fr' }],
      });
    });
    expect(dispatchSpy).toHaveBeenCalledWith(
      companyActions.inviteCollaboratorsRequested({
        companyId: 'c1',
        emails: ['a@b.fr', 'c@d.fr'],
      })
    );
    expect(onClose).toHaveBeenCalled();
  });
});

describe('AchievementProgressionModal', () => {
  const criteria = [
    {
      key: 'conversationCount',
      label: 'Conversations',
      threshold: 5,
      currentValue: 2.4,
      isPercentage: false,
    },
    {
      key: 'responseRate',
      label: 'Taux de réponse',
      threshold: 80,
      currentValue: 90,
      isPercentage: true,
    },
  ];
  const achievementEntry = (hasAchievement: boolean) =>
    ({
      type: 'super_engaged_coach',
      label: 'Super engagé',
      hasAchievement,
      criteria,
    }) as never;

  it('shows each criterion with its progression', () => {
    renderInModal(
      <AchievementProgressionModal
        entry={achievementEntry(false)}
        changedCriterionKey="conversationCount"
      />
    );
    expect(screen.getByText('Conversations')).toBeInTheDocument();
    expect(screen.getByText('2 / 5')).toBeInTheDocument();
    expect(screen.getByText('90% / 80%')).toBeInTheDocument();
    expect(
      screen.getByText('Vous avez aidé 2 candidats !')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('achievement-progression-modal-submit-btn')
    ).toHaveTextContent("C'est noté, merci !");
  });

  it('celebrates an obtained badge', () => {
    renderInModal(
      <AchievementProgressionModal
        entry={achievementEntry(true)}
        changedCriterionKey={null}
      />
    );
    expect(
      screen.getByText('Badge "Super engagé" obtenu !')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('achievement-progression-modal-submit-btn')
    ).toHaveTextContent('Super !');
  });

  it('closes when acknowledged', async () => {
    const { onClose } = renderInModal(
      <AchievementProgressionModal
        entry={achievementEntry(false)}
        changedCriterionKey="responseRate"
      />
    );
    fireEvent.click(
      screen.getByTestId('achievement-progression-modal-submit-btn')
    );
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('works on mobile (no tooltip)', () => {
    (useIsDesktop as jest.Mock).mockReturnValue(false);
    renderInModal(
      <AchievementProgressionModal
        entry={achievementEntry(false)}
        changedCriterionKey="responseRate"
      />
    );
    expect(screen.getByText(/Progression vers le badge/)).toBeInTheDocument();
  });
});
