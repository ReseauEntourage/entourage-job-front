import React from 'react';
import { HelpGroupPage } from '@/src/api/types';
import {
  Badge,
  BadgeVariant,
  LucidIcon,
  Section,
  Text,
} from '@/src/components/ui';
import { Breadcrumb } from '@/src/components/ui/Breadcrumb';
import { H1 } from '@/src/components/ui/Headings';
import { useIsDesktop } from '@/src/hooks/utils';
import { HelpGroupContent } from '../HelpGroupContent';
import { JustJoinedMention, MembershipActions } from '../MembershipActions';
import { JoinHelpGroupButton } from '../WriteInvitation';
import {
  formatMembersLabel,
  HELP_GROUP_MEMBER_MENTION,
} from '../help-groups.labels';
import { HelpGroupCharter } from './HelpGroupCharter';
import {
  StyledHelpGroupAdhesion,
  StyledHelpGroupDescription,
  StyledHelpGroupHeader,
  StyledHelpGroupHeaderBadges,
  StyledHelpGroupHeaderBand,
  StyledHelpGroupHeaderMain,
  StyledHelpGroupHeaderRow,
  StyledHelpGroupMeta,
  StyledHelpGroupTitleRow,
} from './HelpGroupPage.styles';

export const UNPUBLISHED_MENTION = 'Non publié';

interface HelpGroupHeaderProps {
  group: HelpGroupPage;
  justJoined?: boolean;
  onJoined?: () => void;
}

/**
 * Full-width header of the group page: breadcrumb, name, membership
 * mention, members count, full description, and on the right the adhesion
 * action matching the situation of the person:
 * - « Rejoindre le groupe » for an eligible non member (or an admin),
 * - « Quitter le groupe » for a member allowed to write, in a « ⋯ » menu
 *   next to the name below the desktop breakpoint,
 * - nothing for a person who has not finished the training, nor in the
 *   preview of an unpublished group.
 * Below the desktop breakpoint, « Le cadre » is collapsed under the
 * description.
 */
export function HelpGroupHeader({
  group,
  justJoined = false,
  onJoined,
}: HelpGroupHeaderProps) {
  const isDesktop = useIsDesktop();
  const { state } = group.viewerPermissions;
  const canJoin = group.isPublished && state === 'mustJoin';
  const canLeave = group.isPublished && state === 'canWrite';

  const memberMention = group.isMember && (
    <Badge
      variant={BadgeVariant.ExtraLightGreen}
      size="small"
      dataTestId="help-group-member-badge"
    >
      <LucidIcon name="Check" size={14} />
      {HELP_GROUP_MEMBER_MENTION}
    </Badge>
  );
  const membersLabel = (
    <Text size={isDesktop ? 'normal' : 'small'} color="darkGray">
      {formatMembersLabel(group.membersCount, group.isMember)}
    </Text>
  );

  return (
    <StyledHelpGroupHeaderBand data-testid="help-group-header">
      <Section className="custom-header">
        <StyledHelpGroupHeader>
          <Breadcrumb
            items={[
              { label: 'Groupes', href: '/backoffice/groupes' },
              { label: group.name },
            ]}
          />
          {!group.isPublished && (
            <StyledHelpGroupHeaderBadges>
              <Badge variant={BadgeVariant.ExtraLightAmber} size="small">
                {UNPUBLISHED_MENTION}
              </Badge>
            </StyledHelpGroupHeaderBadges>
          )}
          <StyledHelpGroupHeaderRow>
            <StyledHelpGroupHeaderMain>
              <StyledHelpGroupTitleRow>
                <H1 title={group.name} weight="semibold" noMarginBottom />
                {isDesktop && memberMention}
                {!isDesktop && canLeave && (
                  <MembershipActions
                    slug={group.slug}
                    justJoined={justJoined}
                    display="menu"
                  />
                )}
              </StyledHelpGroupTitleRow>
              <StyledHelpGroupMeta>
                {isDesktop ? (
                  <>
                    <LucidIcon name="Users" size={16} />
                    {membersLabel}
                  </>
                ) : (
                  <>
                    {memberMention}
                    {justJoined && canLeave && <JustJoinedMention />}
                    {membersLabel}
                  </>
                )}
              </StyledHelpGroupMeta>
              <StyledHelpGroupDescription>
                <HelpGroupContent content={group.description} />
              </StyledHelpGroupDescription>
              {!isDesktop && <HelpGroupCharter collapsible />}
            </StyledHelpGroupHeaderMain>
            {(canJoin || (isDesktop && canLeave)) && (
              <StyledHelpGroupAdhesion data-testid="help-group-adhesion">
                {canJoin && (
                  <JoinHelpGroupButton slug={group.slug} onJoined={onJoined} />
                )}
                {canLeave && (
                  <MembershipActions
                    slug={group.slug}
                    justJoined={justJoined}
                  />
                )}
              </StyledHelpGroupAdhesion>
            )}
          </StyledHelpGroupHeaderRow>
        </StyledHelpGroupHeader>
      </Section>
    </StyledHelpGroupHeaderBand>
  );
}
