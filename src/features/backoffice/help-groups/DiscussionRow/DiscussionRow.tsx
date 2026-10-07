import React from 'react';
import { HelpGroupDiscussionItem } from '@/src/api/types';
import { LucidIcon, SimpleLink, Text } from '@/src/components/ui';
import { HelpGroupAvatar } from '../HelpGroupAvatar';
import { ReactionsSummary } from '../ReactionsSummary';
import { UNDER_REVIEW_MENTION } from '../help-groups-participation.labels';
import {
  formatAuthorName,
  formatAuthorRoleLabel,
  formatHelpGroupDate,
  formatRepliesLabel,
  getAuthorInitials,
  getProfileHref,
} from '../help-groups.labels';
import {
  StyledDiscussionRow,
  StyledDiscussionRowAuthor,
  StyledDiscussionRowAvatar,
  StyledDiscussionRowContent,
  StyledDiscussionRowFooter,
  StyledDiscussionRowMeta,
  StyledDiscussionRowReplies,
  StyledDiscussionRowTitle,
} from './DiscussionRow.styles';

interface DiscussionRowProps {
  groupSlug: string;
  discussion: HelpGroupDiscussionItem;
}

export const getDiscussionHref = (groupSlug: string, discussionId: string) =>
  `/backoffice/groupes/${groupSlug}/discussions/${discussionId}`;

/**
 * Avatar of the author, title, "author · role · last activity", reactions
 * as first names when any, and the replies count only when above zero. The
 * whole card leads to the discussion, except the author's name, which leads
 * to their profile when it can be viewed.
 */
export function DiscussionRow({ groupSlug, discussion }: DiscussionRowProps) {
  const { author } = discussion;
  const repliesLabel = formatRepliesLabel(discussion.repliesCount);
  const authorName = formatAuthorName(author);
  const roleLabel = formatAuthorRoleLabel(author);
  const isAuthorLinkable =
    !author.isDeleted && author.profileLinkable && !!author.id;

  return (
    <StyledDiscussionRow data-testid="discussion-row">
      <StyledDiscussionRowAvatar>
        <HelpGroupAvatar
          userId={author.isDeleted ? null : author.id}
          initials={getAuthorInitials(author)}
          size={40}
        />
      </StyledDiscussionRowAvatar>
      <StyledDiscussionRowContent>
        <StyledDiscussionRowTitle>
          <SimpleLink href={getDiscussionHref(groupSlug, discussion.id)}>
            <Text size="large" weight="semibold">
              {discussion.title}
            </Text>
          </SimpleLink>
        </StyledDiscussionRowTitle>
        {/* Only its author and the admins still see it in the list */}
        {discussion.isUnderReview && (
          <Text size="small" variant="italic" color="darkGray">
            {UNDER_REVIEW_MENTION}
          </Text>
        )}
        <StyledDiscussionRowMeta>
          <StyledDiscussionRowAuthor>
            {isAuthorLinkable ? (
              <SimpleLink href={getProfileHref(author.id as string)}>
                <Text size="small" weight="semibold">
                  {authorName}
                </Text>
              </SimpleLink>
            ) : (
              <Text size="small" weight="semibold">
                {authorName}
              </Text>
            )}
          </StyledDiscussionRowAuthor>
          {roleLabel && (
            <Text size="small" color="darkGray">
              · {roleLabel}
            </Text>
          )}
          <Text size="small" color="darkGray">
            · dernière activité le{' '}
            {formatHelpGroupDate(discussion.lastActivityAt)}
          </Text>
        </StyledDiscussionRowMeta>
        {(discussion.reactionsSummary || repliesLabel) && (
          <StyledDiscussionRowFooter>
            <ReactionsSummary summary={discussion.reactionsSummary} />
            {repliesLabel && (
              <StyledDiscussionRowReplies>
                <LucidIcon name="MessageCircle" size={14} />
                <Text size="small" weight="semibold" color="darkBlue">
                  {repliesLabel}
                </Text>
              </StyledDiscussionRowReplies>
            )}
          </StyledDiscussionRowFooter>
        )}
      </StyledDiscussionRowContent>
    </StyledDiscussionRow>
  );
}
