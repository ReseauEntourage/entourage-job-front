import React from 'react';
import { HelpGroupPage } from '@/src/api/types';
import { Text } from '@/src/components/ui';
import { H2 } from '@/src/components/ui/Headings';
import { HelpGroupContent } from '../HelpGroupContent';
import { formatMembersLabel } from '../help-groups.labels';
import {
  StyledHelpGroupHeader,
  StyledUnpublishedMention,
} from './HelpGroupPage.styles';

export const UNPUBLISHED_MENTION = 'Non publié';

interface HelpGroupHeaderProps {
  group: HelpGroupPage;
}

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
      <HelpGroupContent content={group.description} />
    </StyledHelpGroupHeader>
  );
}
