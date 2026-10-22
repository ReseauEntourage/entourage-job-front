import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { GA_TAGS } from '@/src/constants/tags';
import { gaEvent } from '@/src/lib/gtag';
import { Partners } from '../../common/Partners/Partners';
import { LogoList } from '../LogoList/LogoList';

jest.mock('@/src/lib/gtag', () => ({ gaEvent: jest.fn() }));
jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => true,
}));
jest.mock('@/src/components/ui/CarouselSwiper', () => ({
  CarouselSwiper: ({
    slides,
    slidesPerView,
  }: {
    slides: React.ReactNode[];
    slidesPerView: number;
  }) => (
    <div data-testid="carousel" data-per-view={slidesPerView}>
      {slides}
    </div>
  ),
}));

const logos = (n: number) =>
  Array.from({ length: n }).map((_, i) => ({
    key: `p${i}`,
    link: `https://p${i}.test`,
  }));

describe('LogoList', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders a link and an image per logo', () => {
    render(<LogoList logos={logos(3)} background padding />);
    expect(screen.getAllByRole('link')).toHaveLength(3);
    expect(screen.getByAltText('p1')).toBeInTheDocument();
  });

  it('tracks partner clicks', () => {
    render(<LogoList logos={logos(2)} />);
    fireEvent.click(screen.getAllByRole('link')[0]);
    expect(gaEvent).toHaveBeenCalledWith(GA_TAGS.FOOTER_PARTENAIRE_CLIC);
  });

  it('shows the logos in a carousel with up to 5 per view for long lists', () => {
    render(<LogoList logos={logos(13)} carousel />);
    expect(screen.getByTestId('carousel')).toHaveAttribute(
      'data-per-view',
      '5'
    );
  });

  it('computes the number of logos per view from the list length', () => {
    render(<LogoList logos={logos(6)} carousel />);
    expect(screen.getByTestId('carousel')).toHaveAttribute(
      'data-per-view',
      '3'
    );
  });
});

describe('Partners', () => {
  beforeEach(() => jest.clearAllMocks());

  const list = [
    { name: 'Acme', logo: '/acme.png', width: 100, height: 50 },
    { name: 'Globex', logo: '/globex.png', width: 100, height: 50 },
  ];

  it('shows the title, the partner logos and a tracked link to all partners', () => {
    render(
      <Partners
        title="Ils nous soutiennent"
        list={list}
        displayCta
        tag={GA_TAGS.FOOTER_VOIR_PARTENAIRES_CLIC}
      />
    );
    expect(screen.getByText('Ils nous soutiennent')).toBeInTheDocument();
    expect(screen.getByAltText('Acme')).toBeInTheDocument();
    expect(screen.getByAltText('Globex')).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole('button', { name: 'Voir tous les partenaires' })
    );
    expect(gaEvent).toHaveBeenCalledWith(GA_TAGS.FOOTER_VOIR_PARTENAIRES_CLIC);
  });

  it('does not track without a tag and can hide the link', () => {
    const { rerender } = render(<Partners title="T" list={list} displayCta />);
    fireEvent.click(
      screen.getByRole('button', { name: 'Voir tous les partenaires' })
    );
    expect(gaEvent).not.toHaveBeenCalled();
    rerender(<Partners title="T" list={list} displayCta={false} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
