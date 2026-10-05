import { useCallback, useEffect, useRef, useState } from 'react';
import {
  readHelpGroupDraft,
  writeHelpGroupDraft,
} from '@/src/use-cases/help-groups';

const DRAFT_WRITE_DELAY_MS = 500;

/**
 * State kept as a browser draft under `key` (null: not kept), restored on
 * mount and written with a debounce. `clear` resets the state and erases the
 * draft at once.
 */
export const useDraft = <T extends object>(
  key: string | null,
  emptyValue: T,
  isEmpty: (value: T) => boolean
) => {
  const [value, setValue] = useState<T>(
    () => (key && readHelpGroupDraft<T>(key)) || emptyValue
  );
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!key) {
      return undefined;
    }
    timeout.current = setTimeout(() => {
      writeHelpGroupDraft(key, isEmpty(value) ? null : value);
    }, DRAFT_WRITE_DELAY_MS);
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
    // `isEmpty` is a stable predicate given by the caller
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, value]);

  const clear = useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    if (key) {
      writeHelpGroupDraft(key, null);
    }
    setValue(emptyValue);
    // `emptyValue` is a constant given by the caller
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [value, setValue, clear] as const;
};
