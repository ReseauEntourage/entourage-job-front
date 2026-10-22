import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getHelpGroupDraftsGeneration,
  readHelpGroupDraft,
  writeHelpGroupDraft,
} from '@/src/use-cases/help-groups';

const DRAFT_WRITE_DELAY_MS = 500;

/**
 * State kept as a browser draft under `key` (null: not kept), restored on
 * mount and whenever the key changes, and written with a debounce. A pending
 * write is flushed when the component unmounts or the page is hidden, so the
 * last keystrokes are never lost. `clear` resets the state and erases the
 * draft at once.
 */
export const useDraft = <T extends object>(
  key: string | null,
  emptyValue: T,
  isEmpty: (value: T) => boolean
) => {
  const read = (draftKey: string | null) =>
    (draftKey && readHelpGroupDraft<T>(draftKey)) || emptyValue;

  // The value is stored with the key it belongs to: on a key change (another
  // group or discussion), the new key's draft is loaded before anything is
  // written, never the previous key's text under the new key
  const [state, setState] = useState(() => ({ key, value: read(key) }));
  if (state.key !== key) {
    setState({ key, value: read(key) });
  }
  const value = state.key === key ? state.value : read(key);

  const pending = useRef<{
    key: string;
    value: T;
    generation: number;
  } | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
    if (pending.current) {
      const { key: draftKey, value: draftValue, generation } = pending.current;
      // Dropped when the drafts were purged (logout) in the meantime
      writeHelpGroupDraft(
        draftKey,
        isEmpty(draftValue) ? null : draftValue,
        generation
      );
      pending.current = null;
    }
    // `isEmpty` is a stable predicate given by the caller
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setValue = useCallback(
    (next: T | ((current: T) => T)) => {
      setState((current) => {
        const nextValue =
          typeof next === 'function'
            ? (next as (current: T) => T)(current.value)
            : next;
        if (current.key) {
          pending.current = {
            key: current.key,
            value: nextValue,
            generation: getHelpGroupDraftsGeneration(),
          };
          if (timeout.current) {
            clearTimeout(timeout.current);
          }
          timeout.current = setTimeout(flush, DRAFT_WRITE_DELAY_MS);
        }
        return { ...current, value: nextValue };
      });
    },
    [flush]
  );

  // A key change or an unmount writes what is still pending for the old key
  useEffect(() => flush, [key, flush]);

  useEffect(() => {
    window.addEventListener('pagehide', flush);
    return () => window.removeEventListener('pagehide', flush);
  }, [flush]);

  const clear = useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
    pending.current = null;
    if (key) {
      writeHelpGroupDraft(key, null);
    }
    setState({ key, value: emptyValue });
    // `emptyValue` is a constant given by the caller
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [value, setValue, clear] as const;
};
