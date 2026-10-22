import { act, renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { purgeHelpGroupDrafts } from '@/src/use-cases/help-groups';
import { useDraft } from '../useDraft';

type Draft = { content: string };
const EMPTY: Draft = { content: '' };
const isEmpty = ({ content }: Draft) => !content;

const stored = (key: string) => {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
};

describe('useDraft', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('restores the draft of the key and writes after the debounce', () => {
    localStorage.setItem('k1', JSON.stringify({ content: 'Brouillon' }));
    const { result } = renderHook(() => useDraft<Draft>('k1', EMPTY, isEmpty));
    expect(result.current[0]).toEqual({ content: 'Brouillon' });

    act(() => result.current[1]({ content: 'Suite' }));
    expect(stored('k1')).toEqual({ content: 'Brouillon' });
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(stored('k1')).toEqual({ content: 'Suite' });
  });

  it('loads the new key draft on a key change, never writing the old text under it', () => {
    localStorage.setItem('k2', JSON.stringify({ content: 'Groupe B' }));
    const { result, rerender } = renderHook(
      ({ draftKey }) => useDraft<Draft>(draftKey, EMPTY, isEmpty),
      { initialProps: { draftKey: 'k1' } }
    );
    act(() => result.current[1]({ content: 'Groupe A' }));

    rerender({ draftKey: 'k2' });
    expect(result.current[0]).toEqual({ content: 'Groupe B' });
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    // The pending text of the first key was flushed under its own key
    expect(stored('k1')).toEqual({ content: 'Groupe A' });
    expect(stored('k2')).toEqual({ content: 'Groupe B' });
  });

  it('flushes the last keystrokes on unmount, before the debounce', () => {
    const { result, unmount } = renderHook(() =>
      useDraft<Draft>('k1', EMPTY, isEmpty)
    );
    act(() => result.current[1]({ content: 'Tapé à l’instant' }));
    unmount();
    expect(stored('k1')).toEqual({ content: 'Tapé à l’instant' });
  });

  it('flushes when the page is hidden', () => {
    const { result } = renderHook(() => useDraft<Draft>('k1', EMPTY, isEmpty));
    act(() => result.current[1]({ content: 'Avant fermeture' }));
    act(() => {
      window.dispatchEvent(new Event('pagehide'));
    });
    expect(stored('k1')).toEqual({ content: 'Avant fermeture' });
  });

  it('never writes back a draft typed before a logout purge', () => {
    const { result, unmount } = renderHook(() =>
      useDraft<Draft>('help-groups:draft:u1:group:g1', EMPTY, isEmpty)
    );
    act(() => result.current[1]({ content: 'Texte privé' }));
    // Logout while the composer is still mounted, then the page unmounts
    purgeHelpGroupDrafts();
    unmount();
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(stored('help-groups:draft:u1:group:g1')).toBeNull();
  });

  it('drops a pending debounced write after a logout purge', () => {
    const { result } = renderHook(() =>
      useDraft<Draft>('help-groups:draft:u1:group:g1', EMPTY, isEmpty)
    );
    act(() => result.current[1]({ content: 'Texte privé' }));
    purgeHelpGroupDrafts();
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(stored('help-groups:draft:u1:group:g1')).toBeNull();
  });

  it('erases the draft on clear, cancelling a pending write', () => {
    localStorage.setItem('k1', JSON.stringify({ content: 'Brouillon' }));
    const { result } = renderHook(() => useDraft<Draft>('k1', EMPTY, isEmpty));
    act(() => result.current[1]({ content: 'Suite' }));
    act(() => result.current[2]());
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(stored('k1')).toBeNull();
    expect(result.current[0]).toEqual(EMPTY);
  });
});
