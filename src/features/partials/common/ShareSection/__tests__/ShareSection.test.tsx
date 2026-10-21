import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { GA_TAGS } from '@/src/constants/tags';
import { gaEvent } from '@/src/lib/gtag';
import { ShareSection } from '../ShareSection';

const mockAsPath = jest.fn();
jest.mock('next/router', () => ({
  useRouter: () => ({ asPath: mockAsPath() }),
}));
jest.mock('@/src/lib/gtag', () => ({ gaEvent: jest.fn() }));
jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => true,
}));

describe('ShareSection', () => {
  beforeEach(() => jest.clearAllMocks());

  it('links to the four social networks in new tabs', () => {
    mockAsPath.mockReturnValue('/');
    render(<ShareSection />);
    const hrefs = screen
      .getAllByRole('link')
      .map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual([
      expect.stringContaining('instagram.com'),
      expect.stringContaining('facebook.com'),
      expect.stringContaining('youtube.com'),
      expect.stringContaining('linkedin.com'),
    ]);
    screen.getAllByRole('link').forEach((a) => {
      expect(a).toHaveAttribute('target', '_blank');
      expect(a).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('tracks home page clicks', () => {
    mockAsPath.mockReturnValue('/');
    render(<ShareSection />);
    fireEvent.click(
      screen.getAllByRole('link')[0].firstElementChild as Element
    );
    expect(gaEvent).toHaveBeenCalledWith(
      GA_TAGS.HOME_SUIVRE_SUR_INSTAGRAM_CLIC
    );
    fireEvent.click(
      screen.getAllByRole('link')[3].firstElementChild as Element
    );
    expect(gaEvent).toHaveBeenCalledWith(GA_TAGS.HOME_SUIVRE_SUR_LINKEDIN_CLIC);
  });

  it('tracks CV page clicks with their own events', () => {
    mockAsPath.mockReturnValue('/cv/marie');
    render(<ShareSection />);
    fireEvent.click(
      screen.getAllByRole('link')[1].firstElementChild as Element
    );
    expect(gaEvent).toHaveBeenCalledWith(
      GA_TAGS.PAGE_CV_SUIVRE_SUR_FACEBOOK_CLIC
    );
    fireEvent.click(
      screen.getAllByRole('link')[2].firstElementChild as Element
    );
    expect(gaEvent).toHaveBeenCalledWith(
      GA_TAGS.PAGE_CV_SUIVRE_SUR_YOUTUBE_CLIC
    );
  });
});
