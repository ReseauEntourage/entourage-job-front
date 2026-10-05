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

interface UseTitleSuggestionParams {
  slug: string;
  content: string;
  titleOrigin: TitleOrigin;
  // Applies a proposed title to the draft
  onSuggested: (title: string) => void;
}

/**
 * Title proposal from the message. Never blocks: a failure leaves the title
 * field empty. A response arriving after any edit of the message or of the
 * title is ignored (request number), so that it never overwrites the
 * member's typing.
 */
export const useTitleSuggestion = ({
  slug,
  content,
  titleOrigin,
  onSuggested,
}: UseTitleSuggestionParams) => {
  const [suggestTitle] = useSuggestHelpGroupTitleMutation();
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [retriesCount, setRetriesCount] = useState(0);
  const previousTitles = useRef<string[]>([]);
  const lastSuggestedContent = useRef<string | null>(null);
  const requestNumber = useRef(0);

  const trimmedContent = content.trim();
  const isLongEnough = trimmedContent.length >= TITLE_SUGGESTION_MIN_LENGTH;

  const request = useCallback(async () => {
    requestNumber.current += 1;
    const current = requestNumber.current;
    lastSuggestedContent.current = trimmedContent;
    setIsSuggesting(true);
    const result = await suggestTitle({
      slug,
      content: trimmedContent,
      previousTitles: previousTitles.current,
    });
    if (current !== requestNumber.current) {
      return;
    }
    setIsSuggesting(false);
    const title = 'data' in result ? result.data?.title : null;
    if (title) {
      previousTitles.current = [...previousTitles.current, title];
      onSuggested(title);
    }
  }, [slug, trimmedContent, suggestTitle, onSuggested]);

  /** Leaving the message field: propose, unless the member owns the title */
  const onMessageBlur = useCallback(() => {
    const canReplaceTitle =
      titleOrigin === 'none' || titleOrigin === 'suggested';
    if (
      isLongEnough &&
      canReplaceTitle &&
      trimmedContent !== lastSuggestedContent.current
    ) {
      request();
    }
  }, [isLongEnough, titleOrigin, trimmedContent, request]);

  /** "Proposer un autre titre", limited per draft */
  const retry = useCallback(() => {
    if (
      titleOrigin !== 'suggested' ||
      retriesCount >= TITLE_SUGGESTION_MAX_RETRIES ||
      !isLongEnough
    ) {
      return;
    }
    setRetriesCount((count) => count + 1);
    request();
  }, [titleOrigin, retriesCount, isLongEnough, request]);

  /** Any typing makes the pending proposal stale */
  const cancelPending = useCallback(() => {
    requestNumber.current += 1;
    setIsSuggesting(false);
  }, []);

  const reset = useCallback(() => {
    cancelPending();
    setRetriesCount(0);
    previousTitles.current = [];
    lastSuggestedContent.current = null;
  }, [cancelPending]);

  return {
    isSuggesting,
    // Only while the title is still the proposal: never over a retouched or
    // written title
    canRetry:
      titleOrigin === 'suggested' &&
      isLongEnough &&
      !isSuggesting &&
      retriesCount < TITLE_SUGGESTION_MAX_RETRIES &&
      previousTitles.current.length > 0,
    onMessageBlur,
    retry,
    cancelPending,
    reset,
  };
};
