import { useCallback, useRef, useState } from 'react';
import { HelpGroupTitleSource } from '@/src/api/types';
import { useSuggestHelpGroupTitleMutation } from '@/src/use-cases/help-groups';
import {
  TITLE_SUGGESTION_MAX_RETRIES,
  TITLE_SUGGESTION_MIN_LENGTH,
} from '../help-groups-participation.labels';

/**
 * - `none`: empty title, never touched,
 * - `suggested`: proposed title, not touched since,
 * - `edited`: proposed title then retouched by the member,
 * - `manual`: title written by the member.
 */
export type TitleOrigin = 'none' | 'suggested' | 'edited' | 'manual';

export const toTitleSource = (origin: TitleOrigin): HelpGroupTitleSource => {
  if (origin === 'suggested') {
    return 'AI_ACCEPTED';
  }
  if (origin === 'edited') {
    return 'AI_EDITED';
  }
  return 'MANUAL';
};

/**
 * Proposals already made for this draft. Kept with the draft in the browser,
 * so that coming back to it does not reset the 5 retries limit.
 */
export interface TitleSuggestionHistory {
  previousTitles: string[];
  retriesCount: number;
}

export const EMPTY_TITLE_SUGGESTION_HISTORY: TitleSuggestionHistory = {
  previousTitles: [],
  retriesCount: 0,
};

/**
 * - `suggested`: a title was proposed and applied to the draft,
 * - `failed`: no title could be proposed, the proposals are now unavailable,
 * - `cancelled`: the member typed meanwhile, the response was dropped.
 */
export type TitleRequestOutcome = 'suggested' | 'failed' | 'cancelled';

interface UseTitleSuggestionParams {
  slug: string;
  content: string;
  history: TitleSuggestionHistory;
  onHistoryChange: (
    update: (history: TitleSuggestionHistory) => TitleSuggestionHistory
  ) => void;
  // Applies a proposed title to the draft
  onSuggested: (title: string) => void;
}

/**
 * Title proposal from the message, only when the member asks for it. Never
 * blocks: a failure leaves the title untouched. A response arriving after any
 * edit of the message or of the title is ignored (request number), so that it
 * never overwrites the member's typing.
 *
 * A failed or refused request (service down, quota exceeded) makes the
 * proposals unavailable for the rest of the writing: until `reset` (cancel or
 * publication) or the page is reloaded. That state is not kept with the draft.
 */
export const useTitleSuggestion = ({
  slug,
  content,
  history,
  onHistoryChange,
  onSuggested,
}: UseTitleSuggestionParams) => {
  const [suggestTitle] = useSuggestHelpGroupTitleMutation();
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);
  // The discreet message: cleared by the first keystroke, unlike the
  // unavailability itself
  const [hasFailed, setHasFailed] = useState(false);
  const requestNumber = useRef(0);
  const { previousTitles, retriesCount } = history;

  const trimmedContent = content.trim();
  const isLongEnough = trimmedContent.length >= TITLE_SUGGESTION_MIN_LENGTH;
  const hasProposed = previousTitles.length > 0;

  const canRequest =
    isLongEnough &&
    !isSuggesting &&
    !isUnavailable &&
    retriesCount < TITLE_SUGGESTION_MAX_RETRIES;

  /**
   * « Proposer un titre avec l'IA », then « Proposer un autre titre »: the
   * first request is free, each following one counts, 5 at most per draft
   */
  const run = useCallback(async (): Promise<TitleRequestOutcome> => {
    requestNumber.current += 1;
    const current = requestNumber.current;
    if (hasProposed) {
      onHistoryChange((previous) => ({
        ...previous,
        retriesCount: previous.retriesCount + 1,
      }));
    }
    setHasFailed(false);
    setIsSuggesting(true);
    const result = await suggestTitle({
      slug,
      content: trimmedContent,
      previousTitles,
    });
    if (current !== requestNumber.current) {
      return 'cancelled';
    }
    setIsSuggesting(false);
    const title = 'data' in result ? result.data?.title : null;
    if (title) {
      onHistoryChange((previous) => ({
        ...previous,
        previousTitles: [...previous.previousTitles, title],
      }));
      onSuggested(title);
      return 'suggested';
    }
    setIsUnavailable(true);
    setHasFailed(true);
    return 'failed';
  }, [
    slug,
    trimmedContent,
    previousTitles,
    hasProposed,
    suggestTitle,
    onSuggested,
    onHistoryChange,
  ]);

  // Guarded: an unavailable or exhausted request does nothing
  const request = useCallback(
    async (): Promise<TitleRequestOutcome> =>
      canRequest ? run() : 'cancelled',
    [canRequest, run]
  );

  /** Any typing makes the pending proposal stale and clears the message */
  const cancelPending = useCallback(() => {
    requestNumber.current += 1;
    setIsSuggesting(false);
    setHasFailed(false);
  }, []);

  /** Cancel or publication: the history is erased with the draft */
  const reset = useCallback(() => {
    cancelPending();
    setIsUnavailable(false);
  }, [cancelPending]);

  return {
    isSuggesting,
    hasProposed,
    hasFailed,
    canRequest,
    request,
    cancelPending,
    reset,
  };
};
