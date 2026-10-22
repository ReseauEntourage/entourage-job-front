import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Api } from '@/src/api';
import { Genders } from '@/src/constants/genders';
import { UserRoles } from '@/src/constants/users';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { CheckinFinalScreenHigh } from './CheckinFinalScreenHigh/CheckinFinalScreenHigh';
import { CheckinFinalScreenLow } from './CheckinFinalScreenLow/CheckinFinalScreenLow';
import { CheckinFinalScreenMedium } from './CheckinFinalScreenMedium/CheckinFinalScreenMedium';

jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
let mockStaffContact: { name: string } | null = null;
jest.mock('@/src/hooks/useCurrentUserStaffContact', () => ({
  useCurrentUserStaffContact: () => mockStaffContact,
}));
jest.mock('@/src/features/backoffice/StaffContactCard', () => ({
  StaffContactCard: () => <div data-testid="staff-card" />,
}));

const mockPostNote = Api.postCheckinNote as jest.Mock;
const mockContactRequest = Api.postCheckinContactRequest as jest.Mock;

describe('CheckinFinalScreenMedium', () => {
  [
    [UserRoles.CANDIDATE, 'coach', "Voir d'autres coachs"],
    [UserRoles.COACH, 'candidat', "Voir d'autres candidats"],
  ].forEach(([role, role2, label]) => {
    it(`proposes to discover ${role2}s to a ${role}`, () => {
      renderWithProviders(
        <CheckinFinalScreenMedium
          conversationId="c1"
          currentUserRole={role as UserRoles}
        />
      );

      const link = screen.getByText(label).closest('a');
      expect(link?.getAttribute('href')).toContain('/backoffice/annuaire?');
      expect(link?.getAttribute('href')).toContain(
        `role=${role === UserRoles.CANDIDATE ? UserRoles.COACH : UserRoles.CANDIDATE}`
      );
      expect(
        screen.getByText('Retour à la conversation').closest('a')
      ).toHaveAttribute('href', '/backoffice/messaging?conversationId=c1');
    });
  });
});

describe('CheckinFinalScreenHigh', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = (role = UserRoles.CANDIDATE) =>
    renderWithProviders(
      <CheckinFinalScreenHigh
        conversationId="c1"
        currentUserRole={role}
        otherFirstName="Marie"
      />
    );

  it('disables sending until a note is written', () => {
    setup();

    expect(screen.getByText('Envoyer le mot').closest('button')).toBeDisabled();
  });

  it('prefills the note from a suggestion badge, tailored to the role', () => {
    setup(UserRoles.COACH);
    fireEvent.click(screen.getByText('Merci pour votre confiance'));

    expect(screen.getByRole('textbox')).toHaveValue(
      'Merci pour votre confiance et votre motivation, Marie !'
    );
    expect(screen.getByText('Envoyer le mot').closest('button')).toBeEnabled();
  });

  it('uses the candidate wording for candidates', () => {
    setup(UserRoles.CANDIDATE);
    fireEvent.click(screen.getByText("Ce que ça m'a apporté"));

    expect(screen.getByRole('textbox')).toHaveValue(
      "Nos échanges m'aident vraiment à avancer, merci Marie !"
    );
  });

  it('sends the note and shows the confirmation', async () => {
    mockPostNote.mockResolvedValue({ data: {} });
    setup();
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Merci !' },
    });
    fireEvent.click(screen.getByText('Envoyer le mot'));

    expect(
      await screen.findByText('Votre mot est parti à Marie !')
    ).toBeInTheDocument();
    expect(mockPostNote).toHaveBeenCalledWith('c1', 'Merci !');
  });

  it('shows an error and keeps the form when sending fails', async () => {
    mockPostNote.mockRejectedValue(new Error('x'));
    setup();
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Merci !' },
    });
    fireEvent.click(screen.getByText('Envoyer le mot'));

    expect(
      await screen.findByText('Une erreur est survenue, veuillez réessayer.')
    ).toBeInTheDocument();
    expect(screen.getByText('Envoyer le mot')).toBeInTheDocument();
  });

  it('lets the user skip the note without calling the API', () => {
    setup();
    fireEvent.click(screen.getByText('Passer'));

    expect(
      screen.getByText('Votre mot est parti à Marie !')
    ).toBeInTheDocument();
    expect(mockPostNote).not.toHaveBeenCalled();
  });
});

describe('CheckinFinalScreenLow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStaffContact = null;
  });

  const setup = (gender = Genders.MALE, role = UserRoles.CANDIDATE) =>
    renderWithProviders(
      <CheckinFinalScreenLow
        conversationId="c1"
        currentUserRole={role}
        currentUserGender={gender}
        otherFirstName="Marie"
      />
    );

  it('asks to be recontacted by the referent, with the generic wording without a staff contact', () => {
    setup();

    expect(
      screen.getByText('Oui, être recontacté par mon référent')
    ).toBeInTheDocument();
    expect(screen.getByText(/Marie ne saura rien/)).toBeInTheDocument();
  });

  it('agrees the wording with a female user and names the staff contact', () => {
    mockStaffContact = { name: 'Sophie' };
    setup(Genders.FEMALE);

    expect(
      screen.getByText('Oui, être recontactée par Sophie')
    ).toBeInTheDocument();
  });

  it('requests the contact, then confirms it and proposes other profiles', async () => {
    mockStaffContact = { name: 'Sophie' };
    mockContactRequest.mockResolvedValue({ data: {} });
    setup();
    fireEvent.click(screen.getByText('Oui, être recontacté par Sophie'));

    expect(
      await screen.findByText(
        'Sophie va vous recontacter dans les meilleurs délais.'
      )
    ).toBeInTheDocument();
    expect(mockContactRequest).toHaveBeenCalledWith('c1');
    expect(screen.getByText("Voir d'autres coachs")).toBeInTheDocument();
  });

  it('shows an error when the contact request fails and stays on the question', async () => {
    mockContactRequest.mockRejectedValue(new Error('x'));
    setup();
    fireEvent.click(screen.getByText('Oui, être recontacté par mon référent'));

    expect(
      await screen.findByText('Une erreur est survenue, veuillez réessayer.')
    ).toBeInTheDocument();
    expect(screen.getByText('Non merci')).toBeInTheDocument();
  });

  it('declining skips the request and does not promise a callback', async () => {
    mockStaffContact = { name: 'Sophie' };
    setup(Genders.MALE, UserRoles.COACH);
    fireEvent.click(screen.getByText('Non merci'));

    await waitFor(() =>
      expect(screen.getByText("Voir d'autres candidats")).toBeInTheDocument()
    );
    expect(mockContactRequest).not.toHaveBeenCalled();
    expect(screen.queryByText(/va vous recontacter/)).not.toBeInTheDocument();
  });
});
