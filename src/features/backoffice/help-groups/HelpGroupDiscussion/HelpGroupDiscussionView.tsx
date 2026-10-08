import React from 'react';
import {
  HelpGroupDiscussionView as HelpGroupDiscussionViewData,
  HelpGroupReplyView,
  HelpGroupViewerPermissions,
  isHelpGroupHiddenMessage,
} from '@/src/api/types';
import { Badge, BadgeVariant, Section, Text } from '@/src/components/ui';
import { Breadcrumb } from '@/src/components/ui/Breadcrumb';
import { Spinner } from '@/src/components/ui/Spinner';
import { useIsDesktop } from '@/src/hooks/utils';
import { AuthorCard } from '../AuthorCard';
import {
  HelpGroupMessage,
  HelpGroupViewer,
  HiddenHelpGroupMessage,
} from '../HelpGroupMessage';
import { UNPUBLISHED_MENTION } from '../HelpGroupPage/HelpGroupHeader';
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
  StyledDiscussionEnd,
  StyledDiscussionPanel,
  StyledHelpGroupDiscussion,
  StyledHelpGroupDiscussionColumns,
  StyledHelpGroupDiscussionMain,
  StyledNewReplyPill,
  StyledOriginalMessage,
  StyledOriginalMessageBadges,
  StyledReplies,
  StyledRepliesSection,
  StyledReply,
  StyledThread,
  StyledThreadBottom,
  StyledWriteInvitationContainer,
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
  hasNewReply?: boolean;
  onNewReplyClick?: () => void;
  onReplied?: (replyId: string) => void;
  onDiscussionGone?: () => void;
  onModerated?: (authorId: string | null) => void;
  // Ref of a displayed message, to mark its notifications seen once on screen
  seenRef?: (messageId: string) => (element: HTMLElement | null) => void;
}

/**
 * Discussion in the flow of the page, the only scroll: the original message
 * as a card, then the replies separated by dividers. The reply area (or the
 * invitation replacing it) sticks to the bottom of the viewport. Below the
 * desktop breakpoint, the author card gives way to the author details in the
 * header of the original message.
 */
export function HelpGroupDiscussionView({
  discussion,
  replies,
  highlightedReplyId,
  isLoadingReplies,
  repliesError = null,
  viewerPermissions,
  viewer,
  hasNewReply = false,
  onNewReplyClick,
  onReplied = () => undefined,
  onDiscussionGone = () => undefined,
  onModerated,
  seenRef,
}: HelpGroupDiscussionViewProps) {
  const repliesLabel = formatRepliesLabel(discussion.repliesCount);
  const { group } = discussion;
  // No write action at all in an unpublished group (admin preview)
  const state = group.isPublished ? viewerPermissions?.state : undefined;
  const canWrite = state === 'canWrite';
  const isHidden = isHelpGroupHiddenMessage(discussion);
  const author = isHidden ? null : discussion.author;
  const isAuthor = !!viewer.id && author?.id === viewer.id;
  const isDesktop = useIsDesktop();
  const showInvitation = !!state && state !== 'canWrite';
  const showComposer = canWrite && !!viewerPermissions;

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
              <StyledThread data-testid="discussion-thread">
                <StyledOriginalMessage
                  data-testid="original-message"
                  ref={isHidden ? undefined : seenRef?.(discussion.id)}
                >
                  {!group.isPublished && (
                    <StyledOriginalMessageBadges>
                      <Badge
                        variant={BadgeVariant.ExtraLightAmber}
                        size="small"
                      >
                        {UNPUBLISHED_MENTION}
                      </Badge>
                    </StyledOriginalMessageBadges>
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
                      showAuthorDetails={!isDesktop}
                      onDiscussionDeleted={onDiscussionGone}
                      onModerated={onModerated}
                    />
                  )}
                </StyledOriginalMessage>
                <StyledRepliesSection aria-label={repliesLabel ?? undefined}>
                  {repliesLabel && (
                    <Text weight="semibold" size="small" color="darkGray">
                      {repliesLabel}
                    </Text>
                  )}
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
                        ref={
                          isHelpGroupHiddenMessage(reply)
                            ? undefined
                            : seenRef?.(reply.id)
                        }
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
                </StyledRepliesSection>
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
              {(showComposer || showInvitation) && (
                <StyledThreadBottom data-testid="discussion-bottom">
                  {showComposer && viewerPermissions && (
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
                  {showInvitation && state && (
                    <StyledWriteInvitationContainer>
                      <WriteInvitation slug={group.slug} state={state} />
                    </StyledWriteInvitationContainer>
                  )}
                </StyledThreadBottom>
              )}
            </StyledDiscussionPanel>
            <StyledDiscussionEnd />
          </StyledHelpGroupDiscussionMain>
          {author && isDesktop && <AuthorCard author={author} />}
        </StyledHelpGroupDiscussionColumns>
      </StyledHelpGroupDiscussion>
    </Section>
  );
}
