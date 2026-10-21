import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { GA_TAGS } from '@/src/constants/tags';
import { gaEvent } from '@/src/lib/gtag';
import { CandidatListPartial } from '../CandidatListPartial';
import { Decouvrir } from '../Decouvrir/Decouvrir';
import { Engagement } from '../Engagement/Engagement';
import { Rejoindre } from '../Rejoindre/Rejoindre';

jest.mock('@/src/lib/gtag', () => ({ gaEvent: jest.fn() }));
jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => true,
  useIsMobile: () => false,
}));
jest.mock('@/src/features/partials/CV/CVList', () => ({
  CVList: (props: { nb: number; filters: object; hideSearchBar: boolean }) => (
    <div
      data-testid="cv-list"
      data-nb={props.nb}
      data-filters={JSON.stringify(Object.keys(props.filters))}
    />
  ),
}));

describe('Rejoindre', () => {
  beforeEach(() => jest.clearAllMocks());

  it('offers to join as a candidate or as a coach and tracks each choice', () => {
    render(<Rejoindre />);
    const candidate = screen.getByRole('link', { name: /Devenir candidat/ });
    const coach = screen.getByRole('link', { name: /Devenir coach/ });
    expect(candidate).toHaveAttribute('href', '/candidat');
    expect(coach).toHaveAttribute('href', '/aider');

    fireEvent.click(candidate.firstElementChild as Element);
    expect(gaEvent).toHaveBeenCalledWith(GA_TAGS.HOME_REJOINDRE_CANDIDAT_CLICK);
    fireEvent.click(coach.firstElementChild as Element);
    expect(gaEvent).toHaveBeenCalledWith(GA_TAGS.HOME_REJOINDRE_COACH_CLICK);
  });
});

describe('Decouvrir', () => {
  beforeEach(() => jest.clearAllMocks());

  it('presents the mission and tracks the discover button', () => {
    render(<Decouvrir />);
    expect(
      screen.getByText(/facteur clé d'intégration et de réinsertion/)
    ).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'Découvrir' });
    expect(link).toHaveAttribute('href', '/candidat');
    fireEvent.click(link.firstElementChild as Element);
    expect(gaEvent).toHaveBeenCalledWith(GA_TAGS.HOME_DECOUVRIR_CTA_CLICK);
  });
});

describe('Engagement', () => {
  beforeEach(() => jest.clearAllMocks());

  it('lists the four engagement cards and tracks the candidates one', () => {
    render(<Engagement />);
    expect(screen.getByText('Engager ses collaborateurs')).toBeInTheDocument();
    expect(
      screen.getByText('Faire du mécénat de compétences')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Proposer du mécénat en nature')
    ).toBeInTheDocument();
    const candidates = screen.getByRole('link', {
      name: 'Découvrir les candidats',
    });
    expect(candidates).toHaveAttribute('href', '/candidats');
    fireEvent.click(candidates.firstElementChild as Element);
    expect(gaEvent).toHaveBeenCalledWith(
      GA_TAGS.HOME_ENGAGEMENT_ENTREPRISE_CANDIDATS
    );
  });
});

describe('CandidatListPartial', () => {
  const original = process.env.NEXT_PUBLIC_WOMENS_DAY;
  afterEach(() => {
    process.env.NEXT_PUBLIC_WOMENS_DAY = original;
  });

  it('shows the standard wording with an unfiltered list', () => {
    process.env.NEXT_PUBLIC_WOMENS_DAY = 'false';
    render(<CandidatListPartial />);
    expect(
      screen.getByText('Ils sont motivés pour travailler')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Découvrir les candidats' })
    ).toHaveAttribute('href', '/candidats');
    expect(screen.getByTestId('cv-list')).toHaveAttribute('data-filters', '[]');
    expect(screen.getByTestId('cv-list')).toHaveAttribute('data-nb', '9');
  });
});
