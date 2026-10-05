import { useCallback, useEffect, useRef } from 'react';
import { useMarkNotificationsSeenMutation } from '@/src/use-cases/notifications-center';

// Share of a message that must be on the screen for it to count as seen
export const SEEN_VISIBILITY_THRESHOLD = 0.5;

/**
 * Delay before the displayed messages are sent, to group them. It must stay
 * far below the 60 s delay of the notification emails: a reply read live is
 * then never emailed.
 */
export const SEEN_FLUSH_DELAY_MS = 1000;

/**
 * Marks seen the notifications announcing the messages actually displayed on
 * the screen: a message counts once half of it is visible. Returns a ref
 * factory to put on each rendered message (discussion or reply). Each message
 * id is sent once per page.
 */
export const useMarkSeenOnScreen = (enabled: boolean) => {
  const [markSeen] = useMarkNotificationsSeenMutation();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef(new Map<string, Element>());
  const pendingRef = useRef(new Set<string>());
  const sentRef = useRef(new Set<string>());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(() => {
    timerRef.current = null;
    const messageIds = Array.from(pendingRef.current);
    pendingRef.current.clear();
    if (messageIds.length > 0) {
      messageIds.forEach((id) => sentRef.current.add(id));
      markSeen(messageIds);
    }
  }, [markSeen]);

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).dataset.seenId;
          if (
            !id ||
            !entry.isIntersecting ||
            entry.intersectionRatio < SEEN_VISIBILITY_THRESHOLD ||
            sentRef.current.has(id)
          ) {
            return;
          }
          pendingRef.current.add(id);
          observer.unobserve(entry.target);
        });
        if (pendingRef.current.size > 0 && !timerRef.current) {
          timerRef.current = setTimeout(flush, SEEN_FLUSH_DELAY_MS);
        }
      },
      { threshold: SEEN_VISIBILITY_THRESHOLD }
    );
    observerRef.current = observer;
    elementsRef.current.forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      observerRef.current = null;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        // What was displayed is still sent when leaving the page
        flush();
      }
    };
  }, [enabled, flush]);

  return useCallback(
    (messageId: string) => (element: HTMLElement | null) => {
      const previous = elementsRef.current.get(messageId);
      if (previous && previous !== element) {
        observerRef.current?.unobserve(previous);
        elementsRef.current.delete(messageId);
      }
      if (!element) {
        return;
      }
      element.dataset.seenId = messageId;
      elementsRef.current.set(messageId, element);
      if (!sentRef.current.has(messageId)) {
        observerRef.current?.observe(element);
      }
    },
    []
  );
};
