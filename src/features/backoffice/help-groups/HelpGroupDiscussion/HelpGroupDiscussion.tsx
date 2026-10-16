import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Section, Text } from '@/src/components/ui';
import { UserRoles } from '@/src/constants/users';
import { LoadingScreen } from '@/src/features/backoffice/LoadingScreen';
import { AppDispatch } from '@/src/store/store';
import { selectCurrentUser } from '@/src/use-cases/current-user';
import {
  HelpGroupsError,
  removeReply,
  useGetHelpGroupDiscussionQuery,
  useGetHelpGroupDiscussionRepliesInfiniteQuery,
  useGetHelpGroupQuery,
} from '@/src/use-cases/help-groups';
import { HelpGroupLoadError } from '../HelpGroupLoadError';
import { HelpGroupViewer } from '../HelpGroupMessage';
import { HelpGroupNotFound } from '../HelpGroupNotFound';
import { ModerationToast } from '../ModerationModals';
import {
  BACK_TO_GROUP_LABEL,
  DISCUSSION_GONE_LABEL,
} from '../help-groups-participation.labels';
import { HELP_GROUPS_LOAD_ERROR_LABELS } from '../help-groups.labels';
import { useDiscussionRealtime } from '../hooks/useDiscussionRealtime';
import { useMarkSeenOnScreen } from '../hooks/useMarkSeenOnScreen';
import { StyledDiscussionGone } from './HelpGroupDiscussion.styles';
import { HelpGroupDiscussionView } from './HelpGroupDiscussionView';
import { getReplyElementId, getReplyTargetState } from './replyTarget';
import { ModerationLinkAction, useModerationLink } from './useModerationLink';

// Distance to the bottom of the page under which the reader is "at the
// bottom": a new reply then scrolls into view
const AT_BOTTOM_THRESHOLD_PX = 40;

// The page is the only scroll of the discussion (the backoffice layout
// defines no scrolling container): the thread follows the window scroll
const getPageHeight = () => document.documentElement.scrollHeight;

const isPageAtBottom = () =>
  getPageHeight() - window.scrollY - window.innerHeight <
  AT_BOTTOM_THRESHOLD_PX;

const scrollPageTo = (top: number) => window.scrollTo?.({ top });

const scrollPageToBottom = () => scrollPageTo(getPageHeight());

interface HelpGroupDiscussionProps {
  slug: string;
  discussionId: string;
  // From `?replyId=`: the reply to scroll to and highlight
  replyId: string | null;
  // From `?moderation=`, set by the buttons of the Slack moderation alerts
  moderationAction?: ModerationLinkAction | null;
  // The moderation action was opened: drop it from the address
  onModerationActionConsumed?: () => void;
}

export function HelpGroupDiscussion({
  slug,
  discussionId,
  replyId,
  moderationAction = null,
  onModerationActionConsumed,
}: HelpGroupDiscussionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector(selectCurrentUser);
  const viewer: HelpGroupViewer = useMemo(
    () => ({
      id: currentUser?.id ?? null,
      firstName: currentUser?.firstName ?? '',
      isAdmin: currentUser?.role === UserRoles.ADMIN,
    }),
    [currentUser?.id, currentUser?.firstName, currentUser?.role]
  );

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
  // The viewer state (member, eLearning, charter) comes with the group page
  const {
    data: group,
    error: groupError,
    refetch: refetchGroup,
  } = useGetHelpGroupQuery(slug, { skip: !isReady });
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

  const [isGone, setIsGone] = useState(false);
  const [moderation, setModeration] = useState<{
    authorId: string | null;
  } | null>(null);
  const [hasNewReply, setHasNewReply] = useState(false);
  const [scrollToReplyId, setScrollToReplyId] = useState<string | null>(null);
  const shouldScrollToBottom = useRef(false);

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
      scrollPageTo(0);
    }
  }, [
    discussion,
    replyTargetState,
    replyId,
    isLoadingReplies,
    isRepliesError,
    isFetchingReplies,
  ]);

  // Keep loading pages while the page does not overflow the viewport: no
  // scroll event would ever fire there
  useEffect(() => {
    const pageHeight = getPageHeight();
    if (
      pageHeight > 0 &&
      hasNextPage &&
      !isFetchingReplies &&
      !isRepliesError &&
      pageHeight <= window.innerHeight
    ) {
      fetchNextPage();
    }
  }, [replies, hasNextPage, isFetchingReplies, isRepliesError, fetchNextPage]);

  // After a reload: follow a new reply when the reader was at the bottom,
  // and bring one's own reply into view
  useEffect(() => {
    if (shouldScrollToBottom.current) {
      shouldScrollToBottom.current = false;
      scrollPageToBottom();
    }
    if (scrollToReplyId && replies.some(({ id }) => id === scrollToReplyId)) {
      document
        .getElementById(getReplyElementId(scrollToReplyId))
        // Centered: aligned on the bottom of the viewport, it would sit
        // under the sticky reply area
        ?.scrollIntoView?.({ block: 'center' });
      setScrollToReplyId(null);
    }
  }, [replies, scrollToReplyId]);

  // Reaching the bottom of the page hides the "new reply" pill and loads
  // the next replies page
  const onPageScrollRef = useRef<() => void>(() => undefined);
  onPageScrollRef.current = () => {
    if (!isPageAtBottom()) {
      return;
    }
    setHasNewReply(false);
    if (hasNextPage && !isFetchingReplies && !isRepliesError) {
      fetchNextPage();
    }
  };
  useEffect(() => {
    const onScroll = () => onPageScrollRef.current();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const reloadReplies = useCallback(() => {
    refetchReplies();
  }, [refetchReplies]);

  useDiscussionRealtime(discussionId, !!discussion && !isGone, {
    isReplyLoaded: (id) => replies.some((reply) => reply.id === id),
    onReplyCreated: () => {
      if (isPageAtBottom()) {
        shouldScrollToBottom.current = true;
      } else {
        setHasNewReply(true);
      }
      reloadReplies();
      refetch();
    },
    onRepliesChanged: reloadReplies,
    onReplyDeleted: (deletedReplyId) => {
      dispatch(removeReply({ slug, discussionId }, deletedReplyId));
      refetch();
    },
    onDiscussionChanged: () => {
      refetch();
    },
    onDiscussionDeleted: () => setIsGone(true),
    onFallbackRefresh: () => {
      refetch();
      reloadReplies();
    },
  });

  // Displaying a notified reply (or a reacted message) makes it seen,
  // whatever the path that led here
  const seenRef = useMarkSeenOnScreen(!!viewer.id && !isGone);

  const onReplied = useCallback((newReplyId: string) => {
    setScrollToReplyId(newReplyId);
  }, []);
  const onDiscussionGone = useCallback(() => setIsGone(true), []);
  const dismissModeration = useCallback(() => setModeration(null), []);
  const onModerated = useCallback(
    (authorId: string | null) => setModeration({ authorId }),
    []
  );
  const consumeModerationAction = useCallback(
    () => onModerationActionConsumed?.(),
    [onModerationActionConsumed]
  );

  useModerationLink({
    action: moderationAction,
    isAdmin: viewer.isAdmin,
    slug,
    discussionId,
    replyId,
    discussion,
    replies,
    isTargetResolved:
      !replyId ||
      replyTargetState === 'found' ||
      (replyTargetState === 'notFound' && !isLoadingReplies),
    onModerated,
    onDiscussionGone,
    onConsumed: consumeModerationAction,
  });

  const moderationToast = moderation && (
    <ModerationToast
      authorId={moderation.authorId}
      onDismiss={dismissModeration}
    />
  );

  if (isGone) {
    return (
      <Section className="custom-page">
        <StyledDiscussionGone data-testid="discussion-gone">
          <Text size="large">{DISCUSSION_GONE_LABEL}</Text>
          <Button variant="secondary" href={`/backoffice/groupes/${slug}`}>
            {BACK_TO_GROUP_LABEL}
          </Button>
        </StyledDiscussionGone>
        {moderationToast}
      </Section>
    );
  }
  if (
    error === HelpGroupsError.NOT_FOUND ||
    groupError === HelpGroupsError.NOT_FOUND
  ) {
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
  // The viewer's rights come with the group: without them, nobody could
  // write, with no way to recover
  if (groupError) {
    return (
      <Section className="custom-page">
        <HelpGroupLoadError
          message={HELP_GROUPS_LOAD_ERROR_LABELS.group}
          onRetry={refetchGroup}
        />
      </Section>
    );
  }
  if (isLoading || !discussion) {
    return <LoadingScreen />;
  }

  return (
    <>
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
        viewerPermissions={group?.viewerPermissions}
        viewer={viewer}
        seenRef={seenRef}
        hasNewReply={hasNewReply}
        onNewReplyClick={() => {
          setHasNewReply(false);
          scrollPageToBottom();
        }}
        onReplied={onReplied}
        onDiscussionGone={onDiscussionGone}
        onModerated={onModerated}
      />
      {moderationToast}
    </>
  );
}
