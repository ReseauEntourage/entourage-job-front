import '@testing-library/jest-dom';
import { act, fireEvent, render } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { BackToTop } from '../BackToTop';

describe('BackToTop', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  const setScroll = (y: number) => {
    Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
  };

  it('becomes visible after scrolling down 300px and hides again', () => {
    const { container } = render(<BackToTop />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).not.toHaveClass('visible');
    setScroll(400);
    expect(root).toHaveClass('visible');
    setScroll(100);
    expect(root).not.toHaveClass('visible');
  });

  it('scrolls smoothly to the top when clicked', () => {
    const { container } = render(<BackToTop />);
    fireEvent.click(container.firstElementChild as HTMLElement);
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  });

  it('stops listening to scroll once unmounted', () => {
    const remove = jest.spyOn(window, 'removeEventListener');
    const { unmount } = render(<BackToTop />);
    unmount();
    expect(remove).toHaveBeenCalledWith('scroll', expect.any(Function));
    remove.mockRestore();
  });
});
