import React from 'react';
import { HelpGroupPage } from '@/src/api/types';
import { Text } from '@/src/components/ui';
import { H2 } from '@/src/components/ui/Headings';
import { formatMembersLabel } from '../help-groups.labels';
import {
  StyledHelpGroupHeader,
  StyledUnpublishedMention,
} from './HelpGroupPage.styles';

export const UNPUBLISHED_MENTION = 'Non publié';

interface HelpGroupHeaderProps {
  group: HelpGroupPage;
}

/**
 * Name and members count of the group. Its full description lives in
 * « À propos de ce groupe ».
 */
export function HelpGroupHeader({ group }: HelpGroupHeaderProps) {
  return (
    <StyledHelpGroupHeader>
      {!group.isPublished && (
        <StyledUnpublishedMention>
          {UNPUBLISHED_MENTION}
        </StyledUnpublishedMention>
      )}
      <H2 title={group.name} noMarginBottom />
      <Text size="small" weight="semibold" color="darkGray">
        {formatMembersLabel(group.membersCount, group.isMember)}
      </Text>
    </StyledHelpGroupHeader>
  );
}
