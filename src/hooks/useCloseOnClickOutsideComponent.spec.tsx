import { act, renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useCloseOnClickOutsideComponent } from './useCloseOnClickOutsideComponent';

describe('useCloseOnClickOutsideComponent', () => {
  let container: HTMLDivElement;
  let outside: HTMLButtonElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'menu-container';
    const inner = document.createElement('span');
    inner.id = 'inner';
    container.appendChild(inner);
    outside = document.createElement('button');
    document.body.append(container, outside);
  });

  afterEach(() => {
    container.remove();
    outside.remove();
  });

  it('exposes the container id and starts closed', () => {
    const { result } = renderHook(() =>
      useCloseOnClickOutsideComponent('menu')
    );
    expect(result.current.componentId).toBe('menu-container');
    expect(result.current.isOpen).toBe(false);
  });

  it('closes when clicking outside the container', () => {
    const { result } = renderHook(() =>
      useCloseOnClickOutsideComponent('menu')
    );
    act(() => result.current.setIsOpen(true));
    expect(result.current.isOpen).toBe(true);

    act(() => outside.click());
    expect(result.current.isOpen).toBe(false);
  });

  it('stays open when clicking inside the container', () => {
    const { result } = renderHook(() =>
      useCloseOnClickOutsideComponent('menu')
    );
    act(() => result.current.setIsOpen(true));

    act(() => (container.querySelector('#inner') as HTMLElement).click());
    expect(result.current.isOpen).toBe(true);
  });

  it('prevents the default action of document clicks', () => {
    renderHook(() => useCloseOnClickOutsideComponent('menu'));
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    outside.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('registers no listener without an id and removes it on unmount', () => {
    const add = jest.spyOn(document, 'addEventListener');
    const remove = jest.spyOn(document, 'removeEventListener');

    renderHook(() => useCloseOnClickOutsideComponent(''));
    expect(add.mock.calls.filter(([type]) => type === 'click')).toHaveLength(0);

    const { unmount } = renderHook(() =>
      useCloseOnClickOutsideComponent('menu')
    );
    expect(add.mock.calls.filter(([type]) => type === 'click')).toHaveLength(1);
    unmount();
    expect(remove.mock.calls.filter(([type]) => type === 'click')).toHaveLength(
      1
    );

    add.mockRestore();
    remove.mockRestore();
  });
});
