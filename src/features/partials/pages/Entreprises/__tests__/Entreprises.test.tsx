import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { FB_TAGS, GA_TAGS, LINK_TAGS } from '@/src/constants/tags';
import { openModal } from '@/src/features/modals/Modal';
import { fbEvent } from '@/src/lib/fb';
import { gaEvent } from '@/src/lib/gtag';
import { linkEvent } from '@/src/lib/lintrk';
import { EntreprisesActions } from '../EntreprisesActions/EntreprisesActions';
import { EntreprisesCVList } from '../EntreprisesCVList/EntreprisesCVLIst';
import { EntreprisesEnSavoirPlus } from '../EntreprisesEnSavoirPlus/EntreprisesEnSavoirPlus';

jest.mock('@/src/lib/gtag', () => ({ gaEvent: jest.fn() }));
jest.mock('@/src/lib/fb', () => ({ fbEvent: jest.fn() }));
jest.mock('@/src/lib/lintrk', () => ({ linkEvent: jest.fn() }));
jest.mock('@/src/features/modals/Modal', () => ({ openModal: jest.fn() }));
jest.mock(
  '@/src/features/modals/Modal/ModalGeneric/CompanyContactModal',
  () => ({ CompanyContactModal: () => null })
);
jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => true,
  useIsMobile: () => false,
}));
jest.mock('@/src/features/partials/CV/CVList', () => ({
  CVList: ({ nb }: { nb: number }) => (
    <div data-testid="cv-list" data-nb={nb} />
  ),
}));

describe('EntreprisesActions', () => {
  it('proposes registering and team building actions with their links', () => {
    render(<EntreprisesActions />);
    expect(
      screen.getByText('Engagez vos collaborateurs à devenir coachs bénévoles')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Proposez un Team Building solidaire à vos équipes')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: "S'inscrire" }).getAttribute('href')
    ).toContain('/wizard?flow=');
    expect(
      screen.getByRole('button', { name: 'En savoir plus' })
    ).toBeInTheDocument();
  });
});

describe('EntreprisesCVList', () => {
  it('shows three candidates and tracks the link to all of them', () => {
    render(<EntreprisesCVList />);
    expect(screen.getByTestId('cv-list')).toHaveAttribute('data-nb', '3');
    const link = screen.getByRole('link', { name: 'Découvrir nos candidats' });
    expect(link).toHaveAttribute('href', '/candidats');
    fireEvent.click(link.firstElementChild as Element);
    expect(gaEvent).toHaveBeenCalledWith(GA_TAGS.PAGE_ENTREPRISES_ALL_CV_CLICK);
  });
});

describe('EntreprisesEnSavoirPlus', () => {
  it('tracks the contact request on every channel and opens the contact modal', () => {
    render(<EntreprisesEnSavoirPlus />);
    fireEvent.click(screen.getByTestId('button-contact-company-last-section'));
    expect(gaEvent).toHaveBeenCalledWith(
      GA_TAGS.PAGE_ENTREPRISES_CONTACTER_REFERENT_CLIC
    );
    expect(fbEvent).toHaveBeenCalledWith(FB_TAGS.COMPANY_CONTACT_OPEN);
    expect(linkEvent).toHaveBeenCalledWith(LINK_TAGS.COMPANY_CONTACT_OPEN);
    expect(openModal).toHaveBeenCalledTimes(1);
  });
});
