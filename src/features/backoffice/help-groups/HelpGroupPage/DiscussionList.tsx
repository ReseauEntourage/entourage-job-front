import React from 'react';
import { HelpGroupDiscussionItem } from '@/src/api/types';
import { Alert } from '@/src/components/ui';
import { DiscussionRow } from '../DiscussionRow';
import {
  HELP_GROUP_NO_DISCUSSION_LABEL,
  HELP_GROUP_NO_DISCUSSION_TEXT,
} from '../help-groups.labels';
import { StyledDiscussionList } from './HelpGroupPage.styles';

interface DiscussionListProps {
  groupSlug: string;
  discussions: HelpGroupDiscussionItem[];
}

/**
 * Without any visible discussion, a neutral opening message in a dashed
 * block, inviting to ask the first question (never "0 discussion" nor
 * "aucune activité").
 */
export function DiscussionList({
  groupSlug,
  discussions,
}: DiscussionListProps) {
  if (discussions.length === 0) {
    return (
      <Alert
        variant="dashed"
        icon={null}
        center
        title={HELP_GROUP_NO_DISCUSSION_LABEL}
        dataTestId="help-group-no-discussion"
      >
        {HELP_GROUP_NO_DISCUSSION_TEXT}
      </Alert>
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
