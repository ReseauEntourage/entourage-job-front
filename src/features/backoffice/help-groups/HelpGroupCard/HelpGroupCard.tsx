import React from 'react';
import { HelpGroupCard as HelpGroupCardType } from '@/src/api/types';
import {
  Badge,
  BadgeVariant,
  LucidIcon,
  SimpleLink,
  Text,
} from '@/src/components/ui';
import { H4 } from '@/src/components/ui/Headings';
import { HelpGroupAvatar } from '../HelpGroupAvatar';
import {
  formatMembersLabel,
  HELP_GROUP_MEMBER_MENTION,
  HELP_GROUP_PINNED_MENTION,
} from '../help-groups.labels';
import {
  StyledHelpGroupCard,
  StyledHelpGroupCardBadges,
  StyledHelpGroupCardBody,
  StyledHelpGroupCardDescription,
  StyledHelpGroupCardFooter,
  StyledHelpGroupCardLink,
  StyledHelpGroupCardMembers,
  StyledHelpGroupContributors,
} from './HelpGroupCard.styles';

interface HelpGroupCardProps {
  group: HelpGroupCardType;
}

/**
 * « À la une » and « Vous êtes membre » badges, name, truncated description,
 * recent contributors and members count. No other counter, rank nor ranking
 * on purpose. The whole card leads to the group.
 */
export function HelpGroupCard({ group }: HelpGroupCardProps) {
  return (
    <StyledHelpGroupCardLink>
      <SimpleLink href={`/backoffice/groupes/${group.slug}`}>
        <StyledHelpGroupCard data-testid="help-group-card">
          <StyledHelpGroupCardBadges>
            {group.pinnedAt && (
              <Badge
                variant={BadgeVariant.ExtraLightTeal}
                size="small"
                dataTestId="help-group-pinned-badge"
              >
                <LucidIcon name="Pin" size={14} />
                {HELP_GROUP_PINNED_MENTION}
              </Badge>
            )}
            {group.isMember && (
              <Badge
                variant={BadgeVariant.ExtraLightGreen}
                size="small"
                dataTestId="help-group-member-badge"
              >
                <LucidIcon name="Check" size={14} />
                {HELP_GROUP_MEMBER_MENTION}
              </Badge>
            )}
          </StyledHelpGroupCardBadges>
          <StyledHelpGroupCardBody>
            <H4 title={group.name} weight="semibold" noMarginBottom />
            <StyledHelpGroupCardDescription>
              <Text color="darkGray">{group.description}</Text>
            </StyledHelpGroupCardDescription>
          </StyledHelpGroupCardBody>
          <StyledHelpGroupCardFooter>
            {group.recentContributors.length > 0 && (
              <StyledHelpGroupContributors>
                {group.recentContributors.map((contributor) => (
                  <HelpGroupAvatar
                    key={contributor.id}
                    // Only the initials are exposed: the first one is shown
                    user={{
                      id: contributor.id,
                      firstName: contributor.initials,
                    }}
                    hasPicture={contributor.hasPicture}
                    size={30}
                  />
                ))}
              </StyledHelpGroupContributors>
            )}
            <StyledHelpGroupCardMembers>
              <Text size="small" color="darkGray">
                {formatMembersLabel(group.membersCount, group.isMember)}
              </Text>
            </StyledHelpGroupCardMembers>
            <LucidIcon name="ArrowRight" size={18} />
          </StyledHelpGroupCardFooter>
        </StyledHelpGroupCard>
      </SimpleLink>
    </StyledHelpGroupCardLink>
  );
}
