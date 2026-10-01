import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LoadingScreen } from '@/src/features/backoffice/LoadingScreen';
import {
  HelpGroupsError,
  useGetHelpGroupDiscussionQuery,
  useGetHelpGroupDiscussionRepliesInfiniteQuery,
} from '@/src/use-cases/help-groups';
import { HelpGroupNotFound } from '../HelpGroupNotFound';
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
  } = useGetHelpGroupDiscussionQuery(
    { slug, discussionId },
    { skip: !isReady }
  );
  const {
    data: repliesData,
    isLoading: isLoadingReplies,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
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

  // Load the replies pages until the designated reply is found (capped)
  useEffect(() => {
    if (repliesData && replyTargetState === 'loadMore' && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [repliesData, replyTargetState, isFetchingNextPage, fetchNextPage]);

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
      (replyTargetState === 'notFound' && !isLoadingReplies)
    ) {
      hasPositionedView.current = true;
      window.scrollTo?.({ top: 0 });
    }
  }, [discussion, replyTargetState, replyId, isLoadingReplies]);

  useLoadMoreOnScroll({
    hasNextPage,
    isFetching: isFetchingNextPage,
    fetchNextPage,
  });

  if (error === HelpGroupsError.NOT_FOUND) {
    return <HelpGroupNotFound />;
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
    />
  );
}
