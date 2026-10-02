import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Section } from '@/src/components/ui';
import { LoadingScreen } from '@/src/features/backoffice/LoadingScreen';
import {
  HelpGroupsError,
  useGetHelpGroupDiscussionQuery,
  useGetHelpGroupDiscussionRepliesInfiniteQuery,
} from '@/src/use-cases/help-groups';
import { HelpGroupLoadError } from '../HelpGroupLoadError';
import { HelpGroupNotFound } from '../HelpGroupNotFound';
import { HELP_GROUPS_LOAD_ERROR_LABELS } from '../help-groups.labels';
import { useLoadMoreOnScroll } from '../hooks/useLoadMoreOnScroll';
import { HelpGroupDiscussionView } from './HelpGroupDiscussionView';
import { getReplyElementId, getReplyTargetState } from './replyTarget';

interface HelpGroupDiscussionProps {
  slug: string;
  discussionId: string;
  // From `?replyId=`: the reply to scroll to and highlight
  replyId: string | null;
}

export function HelpGroupDiscussion({
  slug,
  discussionId,
  replyId,
}: HelpGroupDiscussionProps) {
  const isReady = !!slug && !!discussionId;
  const {
    data: discussion,
    isLoading,
    error,
    refetch,
  } = useGetHelpGroupDiscussionQuery(
    { slug, discussionId },
    { skip: !isReady }
  );
  const {
    data: repliesData,
    isLoading: isLoadingReplies,
    isFetching: isFetchingReplies,
    isFetchingNextPage,
    isError: isRepliesError,
    hasNextPage,
    fetchNextPage,
    refetch: refetchReplies,
  } = useGetHelpGroupDiscussionRepliesInfiniteQuery(
    { slug, discussionId },
    { skip: !discussion }
  );

  const replies = useMemo(
    () => repliesData?.pages.flatMap(({ items }) => items) ?? [],
    [repliesData]
  );

  const replyTargetState = getReplyTargetState({
    replyId,
    loadedReplyIds: replies.map(({ id }) => id),
    loadedPagesCount: repliesData?.pages.length ?? 0,
    hasNextPage,
  });

  // Load the replies pages until the designated reply is found (capped). A
  // failed page stops the loop: the reader retries from the error state.
  useEffect(() => {
    if (
      repliesData &&
      replyTargetState === 'loadMore' &&
      !isFetchingNextPage &&
      !isRepliesError
    ) {
      fetchNextPage();
    }
  }, [
    repliesData,
    replyTargetState,
    isFetchingNextPage,
    isRepliesError,
    fetchNextPage,
  ]);

  const [highlightedReplyId, setHighlightedReplyId] = useState<string | null>(
    null
  );
  const hasPositionedView = useRef(false);

  // Position the view once: on the designated reply when found, otherwise on
  // top of the original message (never on the last reply)
  useEffect(() => {
    if (!discussion || hasPositionedView.current) {
      return;
    }
    if (replyTargetState === 'found' && replyId) {
      hasPositionedView.current = true;
      setHighlightedReplyId(replyId);
      document
        .getElementById(getReplyElementId(replyId))
        ?.scrollIntoView?.({ block: 'center' });
      return;
    }
    if (
      replyTargetState === 'none' ||
      (replyTargetState === 'notFound' && !isLoadingReplies) ||
      (isRepliesError && !isFetchingReplies)
    ) {
      hasPositionedView.current = true;
      window.scrollTo?.({ top: 0 });
    }
  }, [
    discussion,
    replyTargetState,
    replyId,
    isLoadingReplies,
    isRepliesError,
    isFetchingReplies,
  ]);

  useLoadMoreOnScroll({
    hasNextPage,
    isFetching: isFetchingReplies,
    hasError: isRepliesError,
    fetchNextPage,
  });

  if (error === HelpGroupsError.NOT_FOUND) {
    return <HelpGroupNotFound />;
  }
  if (error) {
    return (
      <Section className="custom-page">
        <HelpGroupLoadError
          message={HELP_GROUPS_LOAD_ERROR_LABELS.discussion}
          onRetry={refetch}
        />
      </Section>
    );
  }
  if (isLoading || !discussion) {
    return <LoadingScreen />;
  }

  return (
    <HelpGroupDiscussionView
      discussion={discussion}
      replies={replies}
      highlightedReplyId={highlightedReplyId}
      isLoadingReplies={isLoadingReplies || isFetchingNextPage}
      repliesError={
        isRepliesError && !isFetchingReplies ? (
          <HelpGroupLoadError
            message={HELP_GROUPS_LOAD_ERROR_LABELS.replies}
            onRetry={replies.length === 0 ? refetchReplies : fetchNextPage}
          />
        ) : null
      }
    />
  );
}
