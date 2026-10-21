import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import UIkit from 'uikit';
import { GA_TAGS } from '@/src/constants/tags';
import { gaEvent } from '@/src/lib/gtag';
import { Carousel } from '../Carousel';

const mockAsPath = jest.fn();
jest.mock('next/router', () => ({
  useRouter: () => ({ asPath: mockAsPath() }),
}));
jest.mock('uikit', () => ({
  __esModule: true,
  default: { slider: jest.fn() },
}));
jest.mock('@/src/lib/gtag', () => ({ gaEvent: jest.fn() }));

const renderCarousel = (asPath: string) => {
  mockAsPath.mockReturnValue(asPath);
  return render(
    <Carousel containerClasses="x">
      <li>Slide</li>
    </Carousel>
  );
};

describe('Carousel', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders its slides and initialises the slider on mount', () => {
    renderCarousel('/');
    expect(screen.getByText('Slide')).toBeInTheDocument();
    expect(UIkit.slider).toHaveBeenCalledTimes(1);
  });

  it('does not track navigation clicks on untracked pages', () => {
    const { container } = renderCarousel('/autre');
    fireEvent.click(container.querySelector('[data-uk-slider-item="next"]')!);
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
      const { container } = renderCarousel(path);
      container
        .querySelectorAll('[data-uk-slider-item]')
        .forEach((arrow) => fireEvent.click(arrow));
      expect(gaEvent).toHaveBeenCalledTimes(4);
      expect(gaEvent).toHaveBeenCalledWith(tag);
    });
  });
});
