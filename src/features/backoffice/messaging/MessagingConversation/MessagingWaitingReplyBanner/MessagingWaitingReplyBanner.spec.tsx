import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import/no-named-as-default
import expect from 'expect';
import React from 'react';
import '@testing-library/jest-dom';
import { UserRoles } from '@/src/constants/users';
import { MessagingWaitingReplyBanner } from './MessagingWaitingReplyBanner';

// The component barrel (@/src/components/ui) transitively imports the
// ESM-only @react-hook/window-size (cf. useEmailConfirmationPhase.spec.tsx).
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

describe('MessagingWaitingReplyBanner', () => {
  it("shows the recipient's first name in the title", () => {
    render(
      <MessagingWaitingReplyBanner
        recipientFirstName="Awa"
        currentUserRole={UserRoles.CANDIDATE}
      />
    );

    expect(screen.getByText('Message envoyé à Awa')).toBeInTheDocument();
  });

  it('shows the waiting-for-reply subtitle', () => {
    render(
      <MessagingWaitingReplyBanner
        recipientFirstName="Awa"
        currentUserRole={UserRoles.CANDIDATE}
      />
    );

    expect(
      screen.getByText(
        'Il recevra une notification et vous répondra ici même. En attendant, vous pouvez :'
      )
    ).toBeInTheDocument();
  });

  it('always shows a dashboard button linking to /backoffice/dashboard', () => {
    render(
      <MessagingWaitingReplyBanner
        recipientFirstName="Awa"
        currentUserRole={UserRoles.CANDIDATE}
      />
    );

    expect(
      screen.getByRole('link', { name: 'Voir mon tableau de bord' })
    ).toHaveAttribute('href', '/backoffice/dashboard');
  });

  it('shows a "Voir d\'autres coachs" button linking to coaches when the sender is a candidate', () => {
    render(
      <MessagingWaitingReplyBanner
        recipientFirstName="Awa"
        currentUserRole={UserRoles.CANDIDATE}
      />
    );

    expect(
      screen.getByRole('link', { name: "Voir d'autres coachs" })
    ).toHaveAttribute(
      'href',
      '/backoffice/annuaire?entity=user&sort=relevance&role=Coach'
    );
  });

  it('shows a "Voir d\'autres candidats" button linking to candidates when the sender is a coach', () => {
    render(
      <MessagingWaitingReplyBanner
        recipientFirstName="Karim"
        currentUserRole={UserRoles.COACH}
      />
    );

    expect(
      screen.getByRole('link', { name: "Voir d'autres candidats" })
    ).toHaveAttribute(
      'href',
      '/backoffice/annuaire?entity=user&sort=relevance&role=Candidat'
    );
  });

  it('shows a "Voir d\'autres candidats" button when the sender is a referer', () => {
    render(
      <MessagingWaitingReplyBanner
        recipientFirstName="Karim"
        currentUserRole={UserRoles.REFERER}
      />
    );

    expect(
      screen.getByRole('link', { name: "Voir d'autres candidats" })
    ).toHaveAttribute(
      'href',
      '/backoffice/annuaire?entity=user&sort=relevance&role=Candidat'
    );
  });
});
