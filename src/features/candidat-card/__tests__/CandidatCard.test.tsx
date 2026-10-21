import { fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import React from 'react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default, import-x/order
import expect from 'expect';
import { GA_TAGS } from '@/src/constants/tags';
import { gaEvent } from '@/src/lib/gtag';
import { CandidatCard } from '../CandidatCard';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('@/src/lib/gtag', () => ({ gaEvent: jest.fn() }));

const push = jest.fn();

const baseProps = {
  url: 'marie-1234',
  firstName: 'Marie',
  businessSectors: [],
  occupations: [],
  locations: [],
};

const renderCard = (
  props: Partial<React.ComponentProps<typeof CandidatCard>> = {},
  asPath = '/'
) => {
  (useRouter as jest.Mock).mockReturnValue({ asPath, push });
  return render(<CandidatCard {...baseProps} {...props} />);
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('CandidatCard', () => {
  it('shows the first name and the first occupation', () => {
    renderCard({
      occupations: [{ name: 'Plombière' }, { name: 'Autre' }] as never,
    });
    expect(screen.getAllByText('Marie').length).toBeGreaterThan(0);
    expect(screen.getByText('Plombière')).toBeInTheDocument();
    expect(screen.queryByText('Autre')).toBeNull();
  });

  it('falls back to an open message without occupation', () => {
    renderCard();
    expect(
      screen.getByText("A l'écoute de toutes les opportunités")
    ).toBeInTheDocument();
    expect(screen.queryByText('Je recherche un emploi dans :')).toBeNull();
  });

  it('shows at most two distinct business sectors', () => {
    renderCard({
      businessSectors: [
        { id: 'a', name: 'BTP' },
        { id: 'a', name: 'BTP' },
        { id: 'c', name: 'Santé' },
      ] as never,
    });
    expect(
      screen.getByText('Je recherche un emploi dans :')
    ).toBeInTheDocument();
    expect(screen.getAllByText('BTP')).toHaveLength(1);
    expect(screen.queryByText('Santé')).toBeNull();
  });

  it('shows two different sectors', () => {
    renderCard({
      businessSectors: [
        { id: 'a', name: 'BTP' },
        { id: 'b', name: 'Santé' },
      ] as never,
    });
    expect(screen.getByText('BTP')).toBeInTheDocument();
    expect(screen.getByText('Santé')).toBeInTheDocument();
  });

  it('shows the location with the lowest order', () => {
    renderCard({
      locations: [
        { name: 'Lyon', order: 2 },
        { name: 'Paris', order: 1 },
      ],
    });
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.queryByText('Lyon')).toBeNull();
  });

  it('uses the given picture, or the default one', () => {
    const { rerender } = renderCard({ imgSrc: '/photo.jpg' });
    expect(screen.getByAltText('Marie')).toHaveAttribute(
      'src',
      expect.stringContaining('photo.jpg')
    );
    rerender(<CandidatCard {...baseProps} />);
    expect(screen.getByAltText('Marie')).toHaveAttribute(
      'src',
      expect.stringContaining('arthur.jpg')
    );
  });

  it('opens the CV and tracks the click from the home page', () => {
    renderCard({}, '/');
    fireEvent.click(screen.getByText("A l'écoute de toutes les opportunités"));
    expect(gaEvent).toHaveBeenCalledWith(GA_TAGS.HOME_CV_CLIC);
    expect(push).toHaveBeenCalledWith('/cv/marie-1234');
  });

  it('tracks the gallery click on the candidates page, from the picture too', () => {
    renderCard({}, '/candidats');
    fireEvent.click(screen.getByAltText('Marie'));
    expect(gaEvent).toHaveBeenCalledWith(GA_TAGS.PAGE_GALERIE_CV_CLIC);
    expect(push).toHaveBeenCalledWith('/cv/marie-1234');
  });
});
