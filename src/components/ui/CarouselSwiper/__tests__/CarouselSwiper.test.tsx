import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { CarouselSwiper } from '../CarouselSwiper';

// Swiper ships ESM-only builds that Jest cannot parse
jest.mock('swiper/modules', () => ({
  Pagination: {},
  Autoplay: {},
  Navigation: {},
}));
jest.mock('swiper/react', () => ({
  Swiper: ({
    children,
    slidesPerView,
  }: {
    children: React.ReactNode;
    slidesPerView: number;
  }) => (
    <div data-testid="swiper" data-per-view={slidesPerView}>
      {children}
    </div>
  ),
}));
jest.mock('swiper/css', () => ({}), { virtual: true });
jest.mock('swiper/css/pagination', () => ({}), { virtual: true });
jest.mock('swiper/css/navigation', () => ({}), { virtual: true });
jest.mock('../CarouselSwiper.styles', () => ({
  StyledSwiperContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  StyledSwiperSlide: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="slide">{children}</div>
  ),
}));

describe('CarouselSwiper', () => {
  it('renders nothing without slides', () => {
    const { container } = render(<CarouselSwiper slides={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders each slide, one per view by default', () => {
    render(<CarouselSwiper slides={['Un', 'Deux']} />);
    expect(screen.getAllByTestId('slide')).toHaveLength(2);
    expect(screen.getByText('Deux')).toBeInTheDocument();
    expect(screen.getByTestId('swiper')).toHaveAttribute('data-per-view', '1');
  });

  it('honours slidesPerView', () => {
    render(<CarouselSwiper slides={['Un']} slidesPerView={3} />);
    expect(screen.getByTestId('swiper')).toHaveAttribute('data-per-view', '3');
  });
});
