import React from 'react';
import { HelpGroupDiscussion, HelpGroupReply } from '@/src/api/types';
import { Section, Text } from '@/src/components/ui';
import { Breadcrumb } from '@/src/components/ui/Breadcrumb';
import { H3 } from '@/src/components/ui/Headings';
import { Spinner } from '@/src/components/ui/Spinner';
import { AuthorCard } from '../AuthorCard';
import { HelpGroupAuthor } from '../HelpGroupAuthor';
import { HelpGroupContent } from '../HelpGroupContent';
import { UNPUBLISHED_MENTION } from '../HelpGroupPage/HelpGroupHeader';
import { StyledUnpublishedMention } from '../HelpGroupPage/HelpGroupPage.styles';
import { ReactionsSummary } from '../ReactionsSummary';
import { formatRepliesLabel } from '../help-groups.labels';
import {
  StyledHelpGroupDiscussion,
  StyledHelpGroupDiscussionColumns,
  StyledHelpGroupDiscussionMain,
  StyledOriginalMessage,
  StyledReplies,
  StyledReply,
} from './HelpGroupDiscussion.styles';
import { getReplyElementId } from './replyTarget';

interface HelpGroupDiscussionViewProps {
  discussion: HelpGroupDiscussion;
  replies: HelpGroupReply[];
  highlightedReplyId: string | null;
  isLoadingReplies: boolean;
  // Shown below the loaded replies when a replies page failed
  repliesError?: React.ReactNode;
}

/**
 * Read-only discussion: no composer, reaction, reply nor message menu until
 * writing is available.
 */
export function HelpGroupDiscussionView({
  discussion,
  replies,
  highlightedReplyId,
  isLoadingReplies,
  repliesError = null,
}: HelpGroupDiscussionViewProps) {
  const repliesLabel = formatRepliesLabel(discussion.repliesCount);
  const { group } = discussion;

  return (
    <Section className="custom-page">
      <StyledHelpGroupDiscussion>
        <Breadcrumb
          items={[
            { label: 'Groupes', href: '/backoffice/groupes' },
            { label: group.name, href: `/backoffice/groupes/${group.slug}` },
            { label: discussion.title ?? '' },
          ]}
        />
        <StyledHelpGroupDiscussionColumns>
          <StyledHelpGroupDiscussionMain>
            <StyledOriginalMessage data-testid="original-message">
              {!group.isPublished && (
                <StyledUnpublishedMention>
                  {UNPUBLISHED_MENTION}
                </StyledUnpublishedMention>
              )}
              <H3 title={discussion.title} noMarginBottom />
              <HelpGroupAuthor
                author={discussion.author}
                date={discussion.createdAt}
              />
              <HelpGroupContent content={discussion.content} />
              <ReactionsSummary summary={discussion.reactionsSummary} />
            </StyledOriginalMessage>
            {repliesLabel && <Text weight="semibold">{repliesLabel}</Text>}
            <StyledReplies>
              {replies.map((reply) => (
                <StyledReply
                  key={reply.id}
                  id={getReplyElementId(reply.id)}
                  $isHighlighted={reply.id === highlightedReplyId}
                  data-testid="discussion-reply"
                  data-highlighted={reply.id === highlightedReplyId}
                >
                  <HelpGroupAuthor
                    author={reply.author}
                    date={reply.createdAt}
                  />
                  <HelpGroupContent content={reply.content} />
                  <ReactionsSummary summary={reply.reactionsSummary} />
                </StyledReply>
              ))}
            </StyledReplies>
            {isLoadingReplies && <Spinner />}
            {repliesError}
          </StyledHelpGroupDiscussionMain>
          <AuthorCard author={discussion.author} />
        </StyledHelpGroupDiscussionColumns>
      </StyledHelpGroupDiscussion>
    </Section>
  );
}
