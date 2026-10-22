import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default, import-x/order
import expect from 'expect';
import { openModal } from '@/src/features/modals/Modal';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import { ProfileInterests } from '../ProfileInterests/ProfileInterests';
import { ProfileLanguages } from '../ProfileLanguages/ProfileLanguages';
import { ProfileSkills } from '../ProfileSkills/ProfileSkills';

jest.mock('@/src/features/modals/Modal', () => ({ openModal: jest.fn() }));
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: jest.fn(),
}));
jest.mock('@/src/hooks/useUpdateProfile', () => ({
  useUpdateProfile: jest.fn(),
}));
jest.mock('@/src/features/modals/Modal/ModalGeneric/ModalEdit', () => ({
  ModalEdit: () => null,
}));

const mockOpenModal = openModal as jest.Mock;
const updateUserProfile = jest.fn();

const openedProps = () =>
  mockOpenModal.mock.calls[mockOpenModal.mock.calls.length - 1][0].props;

beforeEach(() => {
  jest.clearAllMocks();
  (useAuthenticatedUser as jest.Mock).mockReturnValue({ id: 'u1' });
  (useUpdateProfile as jest.Mock).mockReturnValue({ updateUserProfile });
});

describe('ProfileSkills', () => {
  it('lists the skills', () => {
    render(
      <ProfileSkills skills={[{ name: 'React' }, { name: 'Node' }] as never} />
    );
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node')).toBeInTheDocument();
  });

  it('shows the fallback when there is no skill', () => {
    render(<ProfileSkills />);
    expect(
      screen.getByText("Vous n'avez pas encore renseigné vos compétences")
    ).toBeInTheDocument();
  });

  it('opens the edit modal and saves the skills as names', () => {
    render(<ProfileSkills isEditable skills={[]} />);
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter' }));
    openedProps().dispatchOnSubmit({
      skills: [
        { value: 'TS', label: 'TS' },
        { value: 'Go', label: 'Go' },
      ],
    });
    expect(updateUserProfile).toHaveBeenCalledWith({
      skills: [{ name: 'TS' }, { name: 'Go' }],
    });
  });
});

describe('ProfileInterests', () => {
  it('renders nothing when empty and not editable', () => {
    const { container } = render(<ProfileInterests />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the fallback when empty and editable', () => {
    render(<ProfileInterests isEditable />);
    expect(
      screen.getByText(/pas encore renseigné vos centres d'intérêt/)
    ).toBeInTheDocument();
  });

  it('lists the interests without a CTA when not editable', () => {
    render(
      <ProfileInterests interests={[{ id: '1', name: 'Football' } as never]} />
    );
    expect(screen.getByText('Football')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Modifier' })).toBeNull();
  });

  it('saves interests with their order', () => {
    render(
      <ProfileInterests
        isEditable
        interests={[{ id: '1', name: 'Football' } as never]}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Modifier' }));
    expect(openedProps().interests).toHaveLength(1);
    openedProps().dispatchOnSubmit({
      interests: [
        { value: 'A', label: 'A' },
        { value: 'B', label: 'B' },
      ],
    });
    expect(updateUserProfile).toHaveBeenCalledWith({
      interests: [
        { name: 'A', order: 0 },
        { name: 'B', order: 1 },
      ],
    });
  });
});

describe('ProfileLanguages', () => {
  it('renders nothing when empty and not editable', () => {
    const { container } = render(<ProfileLanguages />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows languages with their level label', () => {
    render(
      <ProfileLanguages
        userProfileLanguages={
          [
            { id: '1', level: 'FLUENT', language: { name: 'Anglais' } },
            { id: '2', language: { name: 'Arabe' } },
          ] as never
        }
      />
    );
    expect(screen.getByText('Anglais (Niveau courant)')).toBeInTheDocument();
    expect(screen.getByText('Arabe')).toBeInTheDocument();
  });

  it('saves languages by id', () => {
    render(<ProfileLanguages isEditable />);
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter' }));
    openedProps().dispatchOnSubmit({
      languages: [{ value: 'fr', label: 'Français' }],
    });
    expect(updateUserProfile).toHaveBeenCalledWith({
      userProfileLanguages: [{ languageId: 'fr' }],
    });
  });
});
