import React from 'react';
import { HelpGroupCard as HelpGroupCardType } from '@/src/api/types';
import { SimpleLink, Text } from '@/src/components/ui';
import { H5 } from '@/src/components/ui/Headings';
import { HelpGroupAvatar } from '../HelpGroupAvatar';
import {
  formatMembersLabel,
  HELP_GROUP_MEMBER_MENTION,
} from '../help-groups.labels';
import {
  StyledHelpGroupCard,
  StyledHelpGroupCardDescription,
  StyledHelpGroupCardFooter,
  StyledHelpGroupCardLink,
  StyledHelpGroupContributors,
  StyledHelpGroupMemberMention,
} from './HelpGroupCard.styles';

interface HelpGroupCardProps {
  group: HelpGroupCardType;
}

/**
 * Name, truncated description, members count and recent contributors. No
 * other counter, rank nor ranking on purpose.
 */
export function HelpGroupCard({ group }: HelpGroupCardProps) {
  return (
    <StyledHelpGroupCardLink>
      <SimpleLink href={`/backoffice/groupes/${group.slug}`}>
        <StyledHelpGroupCard data-testid="help-group-card">
          {group.isMember && (
            <StyledHelpGroupMemberMention>
              {HELP_GROUP_MEMBER_MENTION}
            </StyledHelpGroupMemberMention>
          )}
          <H5 title={group.name} noMarginBottom />
          <StyledHelpGroupCardDescription>
            <Text color="darkGray">{group.description}</Text>
          </StyledHelpGroupCardDescription>
          <StyledHelpGroupCardFooter>
            <Text size="small" weight="semibold">
              {formatMembersLabel(group.membersCount, group.isMember)}
            </Text>
            {group.recentContributors.length > 0 && (
              <StyledHelpGroupContributors>
                {group.recentContributors.map((contributor) => (
                  <HelpGroupAvatar
                    key={contributor.id}
                    userId={contributor.id}
                    initials={contributor.initials}
                    hasPicture={contributor.hasPicture}
                    size={28}
                  />
                ))}
              </StyledHelpGroupContributors>
            )}
          </StyledHelpGroupCardFooter>
        </StyledHelpGroupCard>
      </SimpleLink>
    </StyledHelpGroupCardLink>
  );
}
