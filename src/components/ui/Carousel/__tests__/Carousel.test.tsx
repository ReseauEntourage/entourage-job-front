import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { GA_TAGS } from '@/src/constants/tags';
import { gaEvent } from '@/src/lib/gtag';
import { Carousel } from '../Carousel';

const mockAsPath = jest.fn();
const mockSlidePrev = jest.fn();
const mockSlideNext = jest.fn();
const mockSwiperProps = jest.fn();

jest.mock('next/router', () => ({
  useRouter: () => ({ asPath: mockAsPath() }),
}));
jest.mock('@/src/lib/gtag', () => ({ gaEvent: jest.fn() }));
// Swiper ships ESM-only builds that Jest cannot parse
jest.mock('swiper/modules', () => ({ Autoplay: {} }));
jest.mock('swiper/react', () => ({
  Swiper: (props: {
    children: React.ReactNode;
    onSwiper: (swiper: unknown) => void;
  }) => {
    mockSwiperProps(props);
    props.onSwiper({ slidePrev: mockSlidePrev, slideNext: mockSlideNext });
    return <div data-testid="swiper">{props.children}</div>;
  },
  SwiperSlide: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="slide">{children}</div>
  ),
}));
jest.mock('swiper/css', () => ({}), { virtual: true });

const renderCarousel = (asPath = '/') => {
  mockAsPath.mockReturnValue(asPath);
  return render(
    <Carousel style="default">
      <div>Premier</div>
      <div>Second</div>
    </Carousel>
  );
};

describe('Carousel', () => {
  beforeEach(() => jest.clearAllMocks());

  it('puts each child in its own slide, one slide per view', () => {
    renderCarousel();
    expect(screen.getAllByTestId('slide')).toHaveLength(2);
    expect(screen.getByText('Premier')).toBeInTheDocument();
    expect(mockSwiperProps).toHaveBeenCalledWith(
      expect.objectContaining({ slidesPerView: 1, loop: true })
    );
  });

  it('advances every 2 seconds, paused while the pointer is over it', () => {
    renderCarousel();
    expect(mockSwiperProps).toHaveBeenCalledWith(
      expect.objectContaining({
        autoplay: {
          delay: 2000,
          pauseOnMouseEnter: true,
          disableOnInteraction: false,
        },
      })
    );
  });

  it('moves to the previous and next slides with the arrows', () => {
    renderCarousel();
    fireEvent.click(screen.getByTestId('carousel-previous'));
    expect(mockSlidePrev).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByTestId('carousel-next'));
    expect(mockSlideNext).toHaveBeenCalledTimes(1);
  });

  it('does not track navigation clicks on untracked pages', () => {
    renderCarousel('/autre');
    fireEvent.click(screen.getByTestId('carousel-next'));
    expect(gaEvent).not.toHaveBeenCalled();
  });

  (
    [
      ['/recruter', GA_TAGS.PAGE_RECRUTER_CARROUSEL_CLIC],
      ['/candidat', GA_TAGS.PAGE_TRAVAILLER_CARROUSEL_CLIC],
      ['/orienter', GA_TAGS.PAGE_ORIENTER_CARROUSEL_CLIC],
      ['/entreprises', GA_TAGS.PAGE_ENTREPRISES_CARROUSEL_CLIC],
    ] as [string, unknown][]
  ).forEach(([path, tag]) => {
    it(`tracks navigation clicks on ${path}`, () => {
      renderCarousel(path);
      fireEvent.click(screen.getByTestId('carousel-previous'));
      fireEvent.click(screen.getByTestId('carousel-next'));
      expect(gaEvent).toHaveBeenCalledTimes(2);
      expect(gaEvent).toHaveBeenCalledWith(tag);
    });
  });
});
