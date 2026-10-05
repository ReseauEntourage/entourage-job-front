import { act, render } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import {
  SEEN_FLUSH_DELAY_MS,
  useMarkSeenOnScreen,
} from '../useMarkSeenOnScreen';

const mockMarkSeen = jest.fn();

jest.mock('@/src/use-cases/notifications-center', () => ({
  useMarkNotificationsSeenMutation: () => [mockMarkSeen],
}));

type ObserverCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

let observerCallback: ObserverCallback;
const observed = new Set<Element>();

class MockIntersectionObserver {
  constructor(callback: ObserverCallback) {
    observerCallback = callback;
  }

  observe = (element: Element) => observed.add(element);

  unobserve = (element: Element) => observed.delete(element);

  disconnect = () => observed.clear();
}

const Messages = ({ ids }: { ids: string[] }) => {
  const seenRef = useMarkSeenOnScreen(true);
  return (
    <>
      {ids.map((id) => (
        <div key={id} ref={seenRef(id)} data-testid={id} />
      ))}
    </>
  );
};

const show = (element: Element, intersectionRatio: number) =>
  act(() => {
    observerCallback([
      {
        target: element,
        isIntersecting: intersectionRatio > 0,
        intersectionRatio,
      },
    ]);
  });

describe('useMarkSeenOnScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockMarkSeen.mockReturnValue({ unwrap: () => Promise.resolve() });
    observed.clear();
    window.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('observes every rendered message', () => {
    render(<Messages ids={['discussion-1', 'reply-1']} />);
    expect(observed.size).toBe(2);
  });

  it('does not mark a reply which is off screen, or less than half visible', () => {
    const { getByTestId } = render(<Messages ids={['reply-1']} />);
    show(getByTestId('reply-1'), 0);
    show(getByTestId('reply-1'), 0.3);
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(mockMarkSeen).not.toHaveBeenCalled();
  });

  it('marks a visible reply seen in less than two seconds, far below the 60 s of the emails', () => {
    const { getByTestId } = render(<Messages ids={['reply-1', 'reply-2']} />);
    show(getByTestId('reply-1'), 0.6);
    show(getByTestId('reply-2'), 1);
    expect(mockMarkSeen).not.toHaveBeenCalled();
    act(() => {
      jest.advanceTimersByTime(SEEN_FLUSH_DELAY_MS);
    });
    expect(SEEN_FLUSH_DELAY_MS).toBeLessThan(2000);
    expect(mockMarkSeen).toHaveBeenCalledTimes(1);
    expect(mockMarkSeen).toHaveBeenCalledWith(['reply-1', 'reply-2']);
  });

  it('sends a message once only', () => {
    const { getByTestId } = render(<Messages ids={['reply-1']} />);
    show(getByTestId('reply-1'), 1);
    act(() => {
      jest.advanceTimersByTime(SEEN_FLUSH_DELAY_MS);
    });
    show(getByTestId('reply-1'), 1);
    act(() => {
      jest.advanceTimersByTime(SEEN_FLUSH_DELAY_MS);
    });
    expect(mockMarkSeen).toHaveBeenCalledTimes(1);
  });

  it('still sends what was displayed when leaving the page before the delay', () => {
    const { getByTestId, unmount } = render(<Messages ids={['reply-1']} />);
    show(getByTestId('reply-1'), 1);
    unmount();
    expect(mockMarkSeen).toHaveBeenCalledWith(['reply-1']);
  });

  it('observes a message again after a failure, and retries it once only', async () => {
    mockMarkSeen.mockReturnValue({
      unwrap: () => Promise.reject(new Error('Network error')),
    });
    const { getByTestId } = render(<Messages ids={['reply-1']} />);
    const element = getByTestId('reply-1');
    show(element, 1);
    expect(observed.has(element)).toBe(false);
    await act(async () => {
      jest.advanceTimersByTime(SEEN_FLUSH_DELAY_MS);
    });
    expect(observed.has(element)).toBe(true);

    show(element, 1);
    await act(async () => {
      jest.advanceTimersByTime(SEEN_FLUSH_DELAY_MS);
    });
    expect(mockMarkSeen).toHaveBeenCalledTimes(2);
    // No third attempt
    expect(observed.has(element)).toBe(false);
  });
});
