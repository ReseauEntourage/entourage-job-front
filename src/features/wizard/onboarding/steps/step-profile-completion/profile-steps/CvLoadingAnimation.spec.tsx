jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock(
  '@/src/features/profile/ai/ProfileGenerationLoadingIndicator',
  () => ({
    ProfileGenerationLoadingIndicator: ({ text }: any) => (
      <div data-testid="loading-text">{text}</div>
    ),
  })
);

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { CvLoadingAnimation } from './CvLoadingAnimation';
import {
  CV_GENERATION_ESTIMATED_DURATION_MS,
  CV_GENERATION_TIMEOUT_MS,
} from './cvLoading.constants';

describe('CvLoadingAnimation', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    cleanup();
    jest.useRealTimers();
  });

  it('starts with the first message and an estimation of the duration', () => {
    render(<CvLoadingAnimation onManualFallback={jest.fn()} />);
    expect(screen.getByTestId('loading-text')).toHaveTextContent(
      'Analyse de votre CV…'
    );
    expect(
      screen.getByText(/Cela prend environ 30 secondes/)
    ).toBeInTheDocument();
    expect(screen.queryByText('Remplir mon profil moi-même')).toBeNull();
  });

  it('goes through the messages and stays on the last one', () => {
    render(<CvLoadingAnimation onManualFallback={jest.fn()} />);
    const step = CV_GENERATION_ESTIMATED_DURATION_MS / 4;
    const expected = [
      'Extraction de vos expériences…',
      'Extraction de vos compétences…',
      'Identification de vos langues…',
      'Identification de vos langues…',
    ];
    expected.forEach((message) => {
      act(() => {
        jest.advanceTimersByTime(step);
      });
      expect(screen.getByTestId('loading-text')).toHaveTextContent(message);
    });
  });

  it('proposes to fill the profile manually once the timeout is reached', () => {
    const onManualFallback = jest.fn();
    render(<CvLoadingAnimation onManualFallback={onManualFallback} />);
    act(() => {
      jest.advanceTimersByTime(CV_GENERATION_TIMEOUT_MS);
    });
    expect(screen.getByText(/plus de temps que prévu/)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Remplir mon profil moi-même'));
    expect(onManualFallback).toHaveBeenCalledTimes(1);
  });

  it('clears its timers on unmount', () => {
    const { unmount } = render(
      <CvLoadingAnimation onManualFallback={jest.fn()} />
    );
    unmount();
    expect(jest.getTimerCount()).toBe(0);
  });
});
