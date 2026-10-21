import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default, import-x/order
import expect from 'expect';
import { UserRoles } from '@/src/constants/users';
import { openModal } from '@/src/features/modals/Modal';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useCurrentUserCompany } from '@/src/hooks/current-user/useCurrentUserCompany';
import { useCurrentUserProfile } from '@/src/hooks/current-user/useCurrentUserProfile';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import { useUpdateUser } from '@/src/hooks/useUpdateUser';
import { gaEvent } from '@/src/lib/gtag';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { ModalEditUserInformation } from '../ModalEditUserInformation/ModalEditUserInformation';
import { useOpenCorrespondingModal } from '../ModalEditUserInformation/useOpenModal';
import { ParamProfessionalInformations } from '../ParamProfessionalInformations/ParamProfessionalInformations';
import { UserProfileAvailabilityCard } from '../UserProfileAvailabilityCard/UserProfileAvailabilityCard';

jest.mock('@/src/features/modals/Modal', () => ({ openModal: jest.fn() }));
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: jest.fn(),
}));
jest.mock('@/src/hooks/current-user/useCurrentUserProfile', () => ({
  useCurrentUserProfile: jest.fn(),
}));
jest.mock('@/src/hooks/current-user/useCurrentUserCompany', () => ({
  useCurrentUserCompany: jest.fn(),
}));
jest.mock('@/src/hooks/useUpdateProfile', () => ({
  useUpdateProfile: jest.fn(),
}));
jest.mock('@/src/hooks/useUpdateUser', () => ({ useUpdateUser: jest.fn() }));
jest.mock('@/src/lib/gtag', () => ({ gaEvent: jest.fn() }));
jest.mock('@/src/features/modals/FeedbackModal/FeedbackModal', () => ({
  FeedbackModal: () => null,
}));
jest.mock('@/src/features/modals/Modal/ModalGeneric/ModalEdit', () => ({
  ModalEdit: (props: unknown) => {
    mockModalEdit(props);
    return null;
  },
}));
jest.mock(
  '@/src/features/backoffice/parameters/ProfessionalInformationCard/ModalEditProfessionalInformation',
  () => ({ ModalEditProfessionalInformation: () => null })
);
jest.mock(
  '@/src/features/backoffice/profile/ProfileProfessionalInformationCard/ProfileCareerPathSentence',
  () => ({
    ProfileCareerPathSentence: ({ currentJob }: { currentJob?: string }) => (
      <p>career-sentence:{currentJob ?? 'none'}</p>
    ),
  })
);

const mockModalEdit = jest.fn();
const mockOpenModal = openModal as jest.Mock;
const updateUserProfile = jest.fn();
const updateUser = jest.fn();

const openedElement = () =>
  mockOpenModal.mock.calls[mockOpenModal.mock.calls.length - 1][0];

beforeEach(() => {
  jest.clearAllMocks();
  (useAuthenticatedUser as jest.Mock).mockReturnValue({
    id: 'me',
    role: UserRoles.CANDIDATE,
  });
  (useCurrentUserProfile as jest.Mock).mockReturnValue(null);
  (useCurrentUserCompany as jest.Mock).mockReturnValue(null);
  (useUpdateProfile as jest.Mock).mockReturnValue({
    updateUserProfile,
    closeModal: false,
  });
  (useUpdateUser as jest.Mock).mockReturnValue({
    updateUser,
    closeModal: false,
  });
});

describe('UserProfileAvailabilityCard', () => {
  it('shows a coach title and the available state', () => {
    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      id: 'me',
      role: UserRoles.COACH,
    });
    (useCurrentUserProfile as jest.Mock).mockReturnValue({
      unavailableAt: null,
    });
    renderWithProviders(<UserProfileAvailabilityCard />);
    expect(
      screen.getByText('Disponibilité pour accompagner un candidat')
    ).toBeInTheDocument();
    expect(screen.getByText('Je suis disponible')).toBeInTheDocument();
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('shows the candidate title and the unavailable state', () => {
    (useCurrentUserProfile as jest.Mock).mockReturnValue({
      unavailableAt: '2025-01-01',
    });
    renderWithProviders(<UserProfileAvailabilityCard />);
    expect(
      screen.getByText('Disponibilité pour recevoir des coups de pouces')
    ).toBeInTheDocument();
    expect(screen.getByText('Je ne suis pas disponible')).toBeInTheDocument();
    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('treats a missing profile as unavailable', () => {
    renderWithProviders(<UserProfileAvailabilityCard />);
    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('asks for feedback when switching to unavailable', () => {
    (useCurrentUserProfile as jest.Mock).mockReturnValue({
      unavailableAt: null,
    });
    renderWithProviders(<UserProfileAvailabilityCard />);
    fireEvent.click(screen.getByRole('switch'));
    expect(gaEvent).toHaveBeenCalledTimes(1);
    expect(mockOpenModal).toHaveBeenCalledTimes(1);
    expect(updateUserProfile).not.toHaveBeenCalled();
  });

  it('clears the unavailability when switching back to available', () => {
    (useCurrentUserProfile as jest.Mock).mockReturnValue({
      unavailableAt: '2025-01-01',
    });
    renderWithProviders(<UserProfileAvailabilityCard />);
    fireEvent.click(screen.getByRole('switch'));
    expect(updateUserProfile).toHaveBeenCalledWith({
      unavailableAt: null,
      unavailabilityReason: null,
    });
    expect(mockOpenModal).not.toHaveBeenCalled();
  });
});

describe('ParamProfessionalInformations', () => {
  it('shows the candidate fallback without sector', () => {
    renderWithProviders(
      <ParamProfessionalInformations sectorOccupations={[]} />
    );
    expect(
      screen.getByText(
        'Renseignez ici les secteurs et métiers que vous recherchez'
      )
    ).toBeInTheDocument();
  });

  it('shows the coach fallback without sector', () => {
    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      id: 'me',
      role: UserRoles.COACH,
    });
    renderWithProviders(
      <ParamProfessionalInformations sectorOccupations={[]} />
    );
    expect(
      screen.getByText('Renseignez ici votre métier et les secteurs')
    ).toBeInTheDocument();
  });

  it('shows the career sentence with the current job', () => {
    (useCurrentUserProfile as jest.Mock).mockReturnValue({
      currentJob: 'Plombier',
    });
    renderWithProviders(
      <ParamProfessionalInformations
        sectorOccupations={[{ id: '1' } as never]}
      />
    );
    expect(screen.getByText('career-sentence:Plombier')).toBeInTheDocument();
  });

  it('does nothing on CTA when the profile is not loaded', () => {
    renderWithProviders(
      <ParamProfessionalInformations isEditable sectorOccupations={[]} />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter' }));
    expect(mockOpenModal).not.toHaveBeenCalled();
  });

  it('opens the candidate modal and builds the values to send', () => {
    (useCurrentUserProfile as jest.Mock).mockReturnValue({
      sectorOccupations: [],
    });
    renderWithProviders(
      <ParamProfessionalInformations isEditable sectorOccupations={[]} />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter' }));
    const { props } = openedElement();
    expect(props.title).toBe('Renseignez votre projet professionnel');
    const toSend = props.getValuesToSend({
      businessSectorId0: { value: 'b0', label: 'BTP' },
      occupation0: 'Maçon',
      linkedinUrl: 'https://linkedin.com/in/x',
    });
    expect(toSend.linkedinUrl).toBe('https://linkedin.com/in/x');
    expect(toSend.sectorOccupations[0]).toMatchObject({
      businessSectorId: 'b0',
      order: 0,
    });
  });

  it('opens the coach modal and builds the values to send', () => {
    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      id: 'me',
      role: UserRoles.COACH,
    });
    (useCurrentUserProfile as jest.Mock).mockReturnValue({
      sectorOccupations: [],
      currentJob: 'Chef',
    });
    (useCurrentUserCompany as jest.Mock).mockReturnValue({ name: 'ACME' });
    renderWithProviders(
      <ParamProfessionalInformations
        isEditable
        sectorOccupations={[{ id: '1' } as never]}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Modifier' }));
    const { props } = openedElement();
    expect(props.title).toMatch(/Renseignez votre métier/);
    expect(props.defaultValues).toMatchObject({
      currentJob: 'Chef',
      companyName: { value: 'ACME', label: 'ACME' },
    });
    expect(
      props.getValuesToSend({
        currentJob: 'Chef',
        businessSectorIds: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ],
        companyName: { value: 'ACME', label: 'ACME' },
      })
    ).toEqual({
      currentJob: 'Chef',
      sectorOccupations: [
        { businessSectorId: 'a', order: 0 },
        { businessSectorId: 'b', order: 1 },
      ],
      companyName: 'ACME',
    });
    expect(
      props.getValuesToSend({ currentJob: 'x', businessSectorIds: [] })
        .companyName
    ).toBeNull();
  });
});

describe('ModalEditUserInformation', () => {
  const schema = {} as never;
  const lastProps = () =>
    mockModalEdit.mock.calls[mockModalEdit.mock.calls.length - 1][0];

  const submit = (values: Record<string, unknown>) => {
    const onClose = jest.fn();
    const requestError = jest.fn();
    lastProps().onSubmit(
      {
        firstName: 'Jean',
        lastName: 'Dupont',
        phone: '0600000000',
        oldEmail: '',
        newEmail0: '',
        newEmail1: '',
        department: { value: 'Paris (75)' },
        ...values,
      },
      onClose,
      requestError
    );
    return { requestError };
  };

  beforeEach(() => {
    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      id: 'me',
      role: UserRoles.CANDIDATE,
      firstName: 'Jean',
      lastName: 'Dupont',
      phone: '0600000000',
      email: 'jean@test.fr',
    });
    (useCurrentUserProfile as jest.Mock).mockReturnValue({
      department: 'Paris (75)',
    });
  });

  it('configures the generic edit modal', () => {
    render(<ModalEditUserInformation formSchema={schema} />);
    expect(lastProps().title).toBe('Édition - Informations personnelles');
    expect(lastProps().submitText).toBe('Sauvegarder');
    expect(lastProps().closeOnNextRender).toBe(false);
  });

  it('closes only when both user and profile updates are done', () => {
    (useUpdateUser as jest.Mock).mockReturnValue({
      updateUser,
      closeModal: true,
    });
    const { rerender } = render(
      <ModalEditUserInformation formSchema={schema} />
    );
    expect(lastProps().closeOnNextRender).toBe(false);
    (useUpdateProfile as jest.Mock).mockReturnValue({
      updateUserProfile,
      closeModal: true,
    });
    rerender(<ModalEditUserInformation formSchema={schema} />);
    expect(lastProps().closeOnNextRender).toBe(true);
  });

  it('sends nothing when nothing changed', () => {
    render(<ModalEditUserInformation formSchema={schema} />);
    submit({});
    expect(updateUser).toHaveBeenCalledWith({});
    expect(updateUserProfile).toHaveBeenCalledWith({});
  });

  it('sends the changed identity and department', () => {
    render(<ModalEditUserInformation formSchema={schema} />);
    submit({ firstName: 'Paul', department: { value: 'Rhône (69)' } });
    expect(updateUser).toHaveBeenCalledWith({
      firstName: 'Paul',
      lastName: 'Dupont',
      phone: '0600000000',
    });
    expect(updateUserProfile).toHaveBeenCalledWith({
      department: 'Rhône (69)',
    });
  });

  it('rejects a wrong old email', () => {
    render(<ModalEditUserInformation formSchema={schema} />);
    const { requestError } = submit({
      oldEmail: 'autre@test.fr',
      newEmail0: 'new@test.fr',
      newEmail1: 'new@test.fr',
    });
    expect(requestError).toHaveBeenCalledWith(
      "L'ancienne adresse email n'est pas valide"
    );
    expect(updateUser).not.toHaveBeenCalled();
  });

  it('rejects mismatching new emails', () => {
    render(<ModalEditUserInformation formSchema={schema} />);
    const { requestError } = submit({
      oldEmail: 'JEAN@test.fr',
      newEmail0: 'new@test.fr',
      newEmail1: 'other@test.fr',
    });
    expect(requestError).toHaveBeenCalledWith(
      'Les deux adresses email ne sont pas indentiques'
    );
    expect(updateUser).not.toHaveBeenCalled();
  });

  it('rejects an empty new email when the old one is given', () => {
    render(<ModalEditUserInformation formSchema={schema} />);
    const { requestError } = submit({ oldEmail: 'jean@test.fr' });
    expect(requestError).toHaveBeenCalledWith(
      'Les deux adresses email ne sont pas indentiques'
    );
  });

  it('saves a lowercased new email once validated', () => {
    render(<ModalEditUserInformation formSchema={schema} />);
    const { requestError } = submit({
      oldEmail: 'Jean@Test.fr',
      newEmail0: 'New@Test.fr',
      newEmail1: 'New@Test.fr',
    });
    expect(requestError).toHaveBeenCalledWith('');
    expect(updateUser).toHaveBeenCalledWith({ email: 'new@test.fr' });
  });

  it('also sends the gender for an admin and skips the department', () => {
    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      id: 'me',
      role: UserRoles.ADMIN,
      firstName: 'Jean',
      lastName: 'Dupont',
      phone: '0600000000',
      email: 'jean@test.fr',
    });
    render(<ModalEditUserInformation formSchema={schema} />);
    submit({ gender: 1, department: undefined });
    expect(updateUser).toHaveBeenCalledWith({ gender: 1 });
    expect(updateUserProfile).toHaveBeenCalledWith({});
  });
});

describe('useOpenCorrespondingModal', () => {
  const user = {
    id: 'me',
    firstName: 'Jean',
    lastName: 'Dupont',
    phone: '0600000000',
    gender: 0,
    zone: 'PARIS',
  };

  it('opens the candidate form with the user department', () => {
    (useCurrentUserProfile as jest.Mock).mockReturnValue({
      department: 'Paris (75)',
      description: 'Ma desc',
    });
    const { result } = renderHook(() =>
      useOpenCorrespondingModal({ ...user, role: UserRoles.CANDIDATE } as never)
    );
    result.current.openCorrespondingModal();
    const { props, type } = openedElement();
    expect(type).toBe(ModalEditUserInformation);
    expect(props.defaultValues).toMatchObject({
      firstName: 'Jean',
      description: 'Ma desc',
      department: { value: 'Paris (75)' },
    });
  });

  it('opens the coach form without department when the profile has none', () => {
    (useCurrentUserProfile as jest.Mock).mockReturnValue(null);
    const { result } = renderHook(() =>
      useOpenCorrespondingModal({ ...user, role: UserRoles.COACH } as never)
    );
    result.current.openCorrespondingModal();
    expect(openedElement().props.defaultValues.department).toBeUndefined();
    expect(openedElement().props.defaultValues.description).toBeUndefined();
  });

  it('opens the admin form with gender and zone', () => {
    const { result } = renderHook(() =>
      useOpenCorrespondingModal({ ...user, role: UserRoles.ADMIN } as never)
    );
    result.current.openCorrespondingModal();
    expect(openedElement().props.defaultValues).toEqual({
      firstName: 'Jean',
      lastName: 'Dupont',
      gender: 0,
      phone: '0600000000',
      zone: 'PARIS',
    });
  });

  it('opens nothing for another role', () => {
    const { result } = renderHook(() =>
      useOpenCorrespondingModal({ ...user, role: 'Unknown' } as never)
    );
    result.current.openCorrespondingModal();
    expect(mockOpenModal).not.toHaveBeenCalled();
  });
});
