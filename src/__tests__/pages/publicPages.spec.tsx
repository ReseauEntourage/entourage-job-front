import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { GA_TAGS } from '@/src/constants/tags';
import { openModal } from '@/src/features/modals/Modal';
import { gaEvent } from '@/src/lib/gtag';
import AiderPage from '@/src/pages/aider';
import CandidatPage from '@/src/pages/candidat';
import EntreprisesRecruterInclusif from '@/src/pages/entreprises/recruter-inclusif';
import EntreprisesSEngager from '@/src/pages/entreprises/s-engager';
import Index from '@/src/pages/index';
import OrienterPage from '@/src/pages/orienter';
import PartenairesPage from '@/src/pages/partenaires';

jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
// swiper is ESM-only and imports CSS: stub the wrapper component itself.
jest.mock('@/src/components/ui/CarouselSwiper', () => ({
  CarouselSwiper: ({ slides }: any) => <div>{slides}</div>,
}));
jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {},
    push: jest.fn(),
    pathname: '/',
    asPath: '/',
  }),
}));
jest.mock('@/src/components/layouts/Layout', () => ({
  Layout: ({ title, children }: any) => (
    <div data-testid="layout" data-title={title}>
      {children}
    </div>
  ),
}));
jest.mock('@/src/hooks/queryParams/useUTM', () => ({ useUtm: jest.fn() }));
jest.mock('@/src/lib/gtag', () => ({
  gaEvent: jest.fn(),
  gaEventWithUser: jest.fn(),
  pageview: jest.fn(),
}));
jest.mock('@/src/lib/fb', () => ({ fbEvent: jest.fn() }));
jest.mock('@/src/lib/lintrk', () => ({ linkEvent: jest.fn() }));
jest.mock('@/src/features/modals/Modal', () => ({ openModal: jest.fn() }));
// Heavy data-fetching partials are not what these page specs are about.
jest.mock('@/src/features/partials/common/NewsletterPartial', () => ({
  NewsletterPartial: () => <div data-testid="newsletter" />,
}));
jest.mock('@/src/features/partials/pages/HomePage', () => ({
  CandidatListPartial: () => <div data-testid="candidat-list" />,
}));
jest.mock(
  '@/src/features/partials/pages/Entreprises/EntreprisesCVList',
  () => ({
    EntreprisesCVList: () => <div data-testid="cv-list" />,
  })
);
jest.mock('@/src/features/partials/utils/PageHero', () => ({
  PageHero: ({ title, cta }: any) => {
    const ctas = Array.isArray(cta) ? cta : [cta];
    return (
      <div data-testid="hero">
        {title}
        {ctas.filter(Boolean).map((c: any) => (
          <button key={c.label} onClick={c.onClick}>
            {c.label}
          </button>
        ))}
      </div>
    );
  },
}));

const mockGaEvent = gaEvent as jest.Mock;
const mockOpenModal = openModal as jest.Mock;

describe('public pages', () => {
  const originalTitle = process.env.NEXT_PUBLIC_PINNED_COMMUNICATION_TITLE;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    jest.useRealTimers();
    process.env.NEXT_PUBLIC_PINNED_COMMUNICATION_TITLE = originalTitle;
  });

  it('home page renders its layout and tracks the hero CTAs', () => {
    render(<Index />);

    expect(screen.getByTestId('layout')).toBeInTheDocument();
    fireEvent.click(screen.getAllByText('Devenir candidat(e)')[0]);
    fireEvent.click(screen.getAllByText('Devenir coach')[0]);

    expect(mockGaEvent).toHaveBeenCalledWith(
      GA_TAGS.HOME_BANNER_CANDIDAT_CLICK
    );
    expect(mockGaEvent).toHaveBeenCalledWith(GA_TAGS.HOME_BANNER_COACH_CLICK);
  });

  [
    ['home page', Index],
    ['aider page', AiderPage],
  ].forEach(([name, Page]: any) => {
    describe(`${name} pinned communication`, () => {
      it('opens the pinned communication modal after a delay when configured and not closed yet', () => {
        process.env.NEXT_PUBLIC_PINNED_COMMUNICATION_TITLE = 'Hello';
        render(<Page />);

        expect(mockOpenModal).not.toHaveBeenCalled();
        act(() => {
          jest.advanceTimersByTime(1500);
        });
        expect(mockOpenModal).toHaveBeenCalledTimes(1);
      });

      it('does not open it when it was already closed', () => {
        process.env.NEXT_PUBLIC_PINNED_COMMUNICATION_TITLE = 'Hello';
        const { STORAGE_KEYS } = jest.requireActual('@/src/constants');
        localStorage.setItem(STORAGE_KEYS.PINNED_COMMUNICATION_CLOSED, 'true');
        render(<Page />);
        act(() => {
          jest.advanceTimersByTime(2000);
        });

        expect(mockOpenModal).not.toHaveBeenCalled();
      });

      it('does not open it when no title is configured', () => {
        delete process.env.NEXT_PUBLIC_PINNED_COMMUNICATION_TITLE;
        render(<Page />);
        act(() => {
          jest.advanceTimersByTime(2000);
        });

        expect(mockOpenModal).not.toHaveBeenCalled();
      });
    });
  });

  it('aider page tracks the coach CTAs', () => {
    render(<AiderPage />);

    // The first match is the hero CTA, a later one the "who are candidates" CTA.
    const ctas = screen.getAllByText('Je deviens coach');
    fireEvent.click(ctas[0]);
    expect(mockGaEvent).toHaveBeenCalledWith(
      GA_TAGS.PAGE_AIDER_CTA_BANNER_CLICK
    );
    ctas.forEach((c) => fireEvent.click(c));
    expect(mockGaEvent).toHaveBeenCalledWith(
      GA_TAGS.PAGE_AIDER_INSCRIPTION_COACH_CLIC
    );
  });

  it('orienter page tracks sign-up and opens the contact modal', () => {
    render(<OrienterPage />);

    expect(screen.getByTestId('layout')).toHaveAttribute(
      'data-title',
      'Orienter - Entourage Pro'
    );
    fireEvent.click(screen.getByText("Je m'inscris"));
    expect(mockGaEvent).toHaveBeenCalledWith(
      GA_TAGS.PAGE_ORIENTER_INSCRIPTION_CLIC
    );

    fireEvent.click(screen.getByTestId('button-contact'));
    expect(mockGaEvent).toHaveBeenCalledWith(
      GA_TAGS.PAGE_ORIENTER_CONTACT_CLIC
    );
    expect(mockOpenModal).toHaveBeenCalledTimes(1);
  });

  it('candidat page renders its hero and tracked CTAs', () => {
    render(<CandidatPage />);

    expect(screen.getByTestId('layout')).toBeInTheDocument();
    screen.getAllByRole('button').forEach((b) => fireEvent.click(b));
    expect(mockGaEvent).toHaveBeenCalled();
  });

  it('companies pages render and track registration / contact CTAs', () => {
    render(<EntreprisesRecruterInclusif />);
    screen.getAllByRole('button').forEach((b) => fireEvent.click(b));
    expect(mockGaEvent).toHaveBeenCalled();

    jest.clearAllMocks();
    render(<EntreprisesSEngager />);
    screen.getAllByRole('button').forEach((b) => fireEvent.click(b));
    expect(mockGaEvent).toHaveBeenCalled();
  });

  it('partenaires page renders its sections', () => {
    render(<PartenairesPage />);

    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });
});
