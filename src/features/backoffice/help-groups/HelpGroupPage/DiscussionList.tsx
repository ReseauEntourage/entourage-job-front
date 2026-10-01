import React from 'react';
import { HelpGroupDiscussionItem } from '@/src/api/types';
import { Text } from '@/src/components/ui';
import { DiscussionRow } from '../DiscussionRow';
import { HELP_GROUP_NO_DISCUSSION_LABEL } from '../help-groups.labels';
import {
  StyledDiscussionList,
  StyledDiscussionListEmpty,
} from './HelpGroupPage.styles';

interface DiscussionListProps {
  groupSlug: string;
  discussions: HelpGroupDiscussionItem[];
}

/**
 * Without any visible discussion, a neutral opening message (never
 * "0 discussion" nor "aucune activité").
 */
export function DiscussionList({
  groupSlug,
  discussions,
}: DiscussionListProps) {
  if (discussions.length === 0) {
    return (
      <StyledDiscussionListEmpty>
        <Text size="large" color="darkGray" center>
          {HELP_GROUP_NO_DISCUSSION_LABEL}
        </Text>
      </StyledDiscussionListEmpty>
    );
  }
  return (
    <StyledDiscussionList>
      {discussions.map((discussion) => (
        <DiscussionRow
          key={discussion.id}
          groupSlug={groupSlug}
          discussion={discussion}
        />
      ))}
    </StyledDiscussionList>
  );
}
