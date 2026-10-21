import '@testing-library/jest-dom';
import { fireEvent, render, screen, within } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { GA_TAGS } from '@/src/constants/tags';
import { gaEvent } from '@/src/lib/gtag';
import { Footer } from '../Footer';

const mockPathname = jest.fn();
jest.mock('next/router', () => ({
  useRouter: () => ({ pathname: mockPathname() }),
}));
jest.mock('@/src/lib/gtag', () => ({ gaEvent: jest.fn() }));
jest.mock('@/src/features/modals/Modal', () => ({ openModal: jest.fn() }));
jest.mock(
  '@/src/features/modals/Modal/ModalGeneric/StepperModal/ModalInterestLinkedOut',
  () => ({ ModalInterestLinkedOut: () => null })
);
jest.mock('@/src/features/partials/AppVersion', () => ({
  AppVersion: () => <span>app-version</span>,
}));
jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => true,
}));

describe('Footer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPathname.mockReturnValue('/');
  });

  it('shows the legal links and the app version', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(within(footer).getByText('Mentions légales')).toHaveAttribute(
      'href',
      '/legal-notice'
    );
    expect(
      within(footer).getByText("Conditions Générales d'Utilisation")
    ).toHaveAttribute('href', '/cgu');
    expect(
      within(footer).getByText('Politique de confidentialité')
    ).toHaveAttribute('href', '/data-privacy');
    expect(within(footer).getByText('Politique de cookies')).toHaveAttribute(
      'href',
      '/cookies'
    );
    expect(within(footer).getByText('Gestion des cookies')).toHaveAttribute(
      'href',
      '#cookies'
    );
    expect(screen.getByText('app-version')).toBeInTheDocument();
  });

  it('renders the site map twice (mobile and desktop layouts)', () => {
    render(<Footer />);
    expect(screen.getAllByText('Pourquoi Entourage Pro ?')).toHaveLength(2);
    expect(
      screen.getAllByRole('link', { name: /Espace coach & candidat/ })
    ).toHaveLength(2);
  });

  it('opens partner pages in a new tab and tracks clicks', () => {
    render(<Footer />);
    const [partners] = screen.getAllByText('Nos partenaires');
    expect(partners).toHaveAttribute('target', '_blank');
    fireEvent.click(partners);
    expect(gaEvent).toHaveBeenCalledWith(GA_TAGS.FOOTER_VOIR_PARTENAIRES_CLIC);
  });

  it('tracks internal link clicks', () => {
    render(<Footer />);
    fireEvent.click(screen.getAllByText('Pourquoi Entourage Pro ?')[0]);
    expect(gaEvent).toHaveBeenCalledWith(
      GA_TAGS.FOOTER_POURQUOI_LINKEDOUT_CLIC
    );
  });

  it('lists the nested enterprise links', () => {
    render(<Footer />);
    expect(screen.getAllByText('Engager mon entreprise')[0]).toHaveAttribute(
      'href',
      '/entreprises/s-engager'
    );
    expect(screen.getAllByText('Recruter inclusif').length).toBeGreaterThan(0);
  });

  it('shows the association section except on enterprise pages', () => {
    const { unmount } = render(<Footer />);
    expect(screen.getByText("A propos d'Entourage")).toBeInTheDocument();
    unmount();

    mockPathname.mockReturnValue('/entreprises/recruter-inclusif');
    render(<Footer />);
    expect(screen.queryByText("A propos d'Entourage")).not.toBeInTheDocument();
  });
});
