import React from 'react';
import {
  HelpGroupDiscussionView as HelpGroupDiscussionViewData,
  HelpGroupReplyView,
  HelpGroupViewerPermissions,
  isHelpGroupHiddenMessage,
} from '@/src/api/types';
import { Section, Text } from '@/src/components/ui';
import { Breadcrumb } from '@/src/components/ui/Breadcrumb';
import { Spinner } from '@/src/components/ui/Spinner';
import { AuthorCard } from '../AuthorCard';
import {
  HelpGroupMessage,
  HelpGroupViewer,
  HiddenHelpGroupMessage,
} from '../HelpGroupMessage';
import { UNPUBLISHED_MENTION } from '../HelpGroupPage/HelpGroupHeader';
import { StyledUnpublishedMention } from '../HelpGroupPage/HelpGroupPage.styles';
import { ReplyComposer } from '../ReplyComposer';
import {
  FirstResponderInvite,
  shouldShowFirstResponderInvite,
} from '../WelcomeInvite';
import { WriteInvitation } from '../WriteInvitation';
import {
  NEW_REPLY_PILL_LABEL,
  UNDER_REVIEW_MENTION,
} from '../help-groups-participation.labels';
import { formatRepliesLabel } from '../help-groups.labels';
import {
  StyledDiscussionPanel,
  StyledHelpGroupDiscussion,
  StyledHelpGroupDiscussionColumns,
  StyledHelpGroupDiscussionMain,
  StyledNewReplyPill,
  StyledOriginalMessage,
  StyledReplies,
  StyledReply,
  StyledThread,
} from './HelpGroupDiscussion.styles';
import { getReplyElementId } from './replyTarget';

interface HelpGroupDiscussionViewProps {
  // Reduced to a neutral mention when hidden after reports for the viewer
  discussion: HelpGroupDiscussionViewData;
  replies: HelpGroupReplyView[];
  highlightedReplyId: string | null;
  isLoadingReplies: boolean;
  // Shown below the loaded replies when a replies page failed
  repliesError?: React.ReactNode;
  // Absent while the group page (and so the viewer state) is loading
  viewerPermissions?: HelpGroupViewerPermissions;
  viewer: HelpGroupViewer;
  threadRef?: React.Ref<HTMLDivElement>;
  onThreadScroll?: () => void;
  hasNewReply?: boolean;
  onNewReplyClick?: () => void;
  onReplied?: (replyId: string) => void;
  onDiscussionGone?: () => void;
  onModerated?: (authorId: string | null) => void;
}

/**
 * Discussion in a fixed height panel, like a conversation: the original
 * message and the replies scroll together, the reply area (or the
 * invitation replacing it) stays at the bottom.
 */
export function HelpGroupDiscussionView({
  discussion,
  replies,
  highlightedReplyId,
  isLoadingReplies,
  repliesError = null,
  viewerPermissions,
  viewer,
  threadRef,
  onThreadScroll,
  hasNewReply = false,
  onNewReplyClick,
  onReplied = () => undefined,
  onDiscussionGone = () => undefined,
  onModerated,
}: HelpGroupDiscussionViewProps) {
  const repliesLabel = formatRepliesLabel(discussion.repliesCount);
  const { group } = discussion;
  // No write action at all in an unpublished group (admin preview)
  const state = group.isPublished ? viewerPermissions?.state : undefined;
  const canWrite = state === 'canWrite';
  const isHidden = isHelpGroupHiddenMessage(discussion);
  const author = isHidden ? null : discussion.author;
  const isAuthor = !!viewer.id && author?.id === viewer.id;

  return (
    <Section className="custom-page">
      <StyledHelpGroupDiscussion>
        <Breadcrumb
          items={[
            { label: 'Groupes', href: '/backoffice/groupes' },
            { label: group.name, href: `/backoffice/groupes/${group.slug}` },
            {
              label: isHidden ? UNDER_REVIEW_MENTION : (discussion.title ?? ''),
            },
          ]}
        />
        <StyledHelpGroupDiscussionColumns>
          <StyledHelpGroupDiscussionMain>
            <StyledDiscussionPanel data-testid="discussion-panel">
              <StyledThread
                ref={threadRef}
                onScroll={onThreadScroll}
                data-testid="discussion-thread"
              >
                <StyledOriginalMessage data-testid="original-message">
                  {!group.isPublished && (
                    <StyledUnpublishedMention>
                      {UNPUBLISHED_MENTION}
                    </StyledUnpublishedMention>
                  )}
                  {isHidden ? (
                    <HiddenHelpGroupMessage />
                  ) : (
                    <HelpGroupMessage
                      kind="discussion"
                      message={discussion}
                      slug={group.slug}
                      discussionId={discussion.id}
                      viewer={viewer}
                      canReact={canWrite}
                      canManage={group.isPublished}
                      onDiscussionDeleted={onDiscussionGone}
                      onModerated={onModerated}
                    />
                  )}
                </StyledOriginalMessage>
                {repliesLabel && <Text weight="semibold">{repliesLabel}</Text>}
                {author &&
                  shouldShowFirstResponderInvite({
                    canWrite,
                    isAuthor,
                    // The server count, not the loaded replies: a page still
                    // loading or failed must not read as "no reply"
                    repliesCount: Math.max(
                      discussion.repliesCount,
                      replies.length
                    ),
                    authorFirstName: author.firstName,
                  }) && (
                    <FirstResponderInvite
                      authorFirstName={author.firstName as string}
                    />
                  )}
                <StyledReplies>
                  {replies.map((reply) => (
                    <StyledReply
                      key={reply.id}
                      id={getReplyElementId(reply.id)}
                      $isHighlighted={reply.id === highlightedReplyId}
                      data-testid="discussion-reply"
                      data-highlighted={reply.id === highlightedReplyId}
                    >
                      {isHelpGroupHiddenMessage(reply) ? (
                        <HiddenHelpGroupMessage />
                      ) : (
                        <HelpGroupMessage
                          kind="reply"
                          message={reply}
                          slug={group.slug}
                          discussionId={discussion.id}
                          viewer={viewer}
                          canReact={canWrite}
                          canManage={group.isPublished}
                          onModerated={onModerated}
                        />
                      )}
                    </StyledReply>
                  ))}
                </StyledReplies>
                {isLoadingReplies && <Spinner />}
                {repliesError}
              </StyledThread>
              {hasNewReply && (
                <StyledNewReplyPill
                  type="button"
                  onClick={onNewReplyClick}
                  data-testid="new-reply-pill"
                >
                  {NEW_REPLY_PILL_LABEL}
                </StyledNewReplyPill>
              )}
              {canWrite && viewerPermissions && (
                <ReplyComposer
                  key={discussion.id}
                  slug={group.slug}
                  discussionId={discussion.id}
                  authorFirstName={author?.firstName ?? null}
                  charterAccepted={viewerPermissions.charterAccepted}
                  onReplied={onReplied}
                  onDiscussionGone={onDiscussionGone}
                />
              )}
              {state && state !== 'canWrite' && (
                <WriteInvitation slug={group.slug} state={state} />
              )}
            </StyledDiscussionPanel>
          </StyledHelpGroupDiscussionMain>
          {author && <AuthorCard author={author} />}
        </StyledHelpGroupDiscussionColumns>
      </StyledHelpGroupDiscussion>
    </Section>
  );
}
