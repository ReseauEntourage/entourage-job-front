import React from 'react';
import { HelpGroupDiscussionItem } from '@/src/api/types';
import { SimpleLink, Text } from '@/src/components/ui';
import { HelpGroupAuthor } from '../HelpGroupAuthor';
import { ReactionsSummary } from '../ReactionsSummary';
import { UNDER_REVIEW_MENTION } from '../help-groups-participation.labels';
import { formatHelpGroupDate, formatRepliesLabel } from '../help-groups.labels';
import {
  StyledDiscussionRow,
  StyledDiscussionRowAuthor,
  StyledDiscussionRowFooter,
  StyledDiscussionRowTitle,
} from './DiscussionRow.styles';

interface DiscussionRowProps {
  groupSlug: string;
  discussion: HelpGroupDiscussionItem;
}

export const getDiscussionHref = (groupSlug: string, discussionId: string) =>
  `/backoffice/groupes/${groupSlug}/discussions/${discussionId}`;

/**
 * Title, author, last activity, reactions as first names when any, and the
 * replies count only when above zero. The whole card leads to the
 * discussion, except the author's name, which leads to their profile.
 */
export function DiscussionRow({ groupSlug, discussion }: DiscussionRowProps) {
  const repliesLabel = formatRepliesLabel(discussion.repliesCount);

  return (
    <StyledDiscussionRow data-testid="discussion-row">
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
      <StyledDiscussionRowAuthor>
        <HelpGroupAuthor author={discussion.author} withAvatar={false} />
      </StyledDiscussionRowAuthor>
      <Text size="small" color="darkGray">
        Dernière activité le {formatHelpGroupDate(discussion.lastActivityAt)}
      </Text>
      <StyledDiscussionRowFooter>
        <ReactionsSummary summary={discussion.reactionsSummary} />
        {repliesLabel && (
          <Text size="small" weight="semibold">
            {repliesLabel}
          </Text>
        )}
      </StyledDiscussionRowFooter>
    </StyledDiscussionRow>
  );
}
