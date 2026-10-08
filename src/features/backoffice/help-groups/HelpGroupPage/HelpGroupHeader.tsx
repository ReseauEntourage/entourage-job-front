import React from 'react';
import { HelpGroupPage } from '@/src/api/types';
import {
  Badge,
  BadgeVariant,
  LucidIcon,
  Section,
  Text,
} from '@/src/components/ui';
import { H1 } from '@/src/components/ui/Headings';
import { useIsDesktop } from '@/src/hooks/utils';
import { HelpGroupBackLink } from '../HelpGroupBackLink';
import { HelpGroupContent } from '../HelpGroupContent';
import { openHelpGroupMembersModal } from '../HelpGroupMembers';
import { JustJoinedMention, MembershipActions } from '../MembershipActions';
import { JoinHelpGroupButton } from '../WriteInvitation';
import {
  formatSeeAllMembersLabel,
  formatMembersLabel,
  HELP_GROUP_MEMBER_MENTION,
  HELP_GROUPS_LIST_HREF,
  HELP_GROUPS_LIST_LABEL,
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
  StyledHelpGroupMembersCount,
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
 * Full-width header of the group page: back link, name, membership
 * mention, members count (which opens the members list), full description,
 * and on the right the adhesion
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
  const membersLabel = formatMembersLabel(group.membersCount, group.isMember);
  // Never "0 membre": without members, the invitation is plain text
  const membersCount =
    group.membersCount > 0 ? (
      <StyledHelpGroupMembersCount
        type="button"
        aria-haspopup="dialog"
        onClick={() => openHelpGroupMembersModal(group)}
        data-testid="help-group-members-count"
      >
        {isDesktop && <LucidIcon name="Users" size={16} />}
        {membersLabel}
      </StyledHelpGroupMembersCount>
    ) : (
      <Text size={isDesktop ? 'normal' : 'small'} color="darkGray">
        {membersLabel}
      </Text>
    );

  return (
    <StyledHelpGroupHeaderBand data-testid="help-group-header">
      <Section className="custom-header">
        <StyledHelpGroupHeader>
          <HelpGroupBackLink
            href={HELP_GROUPS_LIST_HREF}
            label={HELP_GROUPS_LIST_LABEL}
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
                    seeMembers={
                      group.membersCount > 0
                        ? {
                            label: formatSeeAllMembersLabel(group.membersCount),
                            onClick: () => openHelpGroupMembersModal(group),
                          }
                        : undefined
                    }
                  />
                )}
              </StyledHelpGroupTitleRow>
              <StyledHelpGroupMeta>
                {isDesktop ? (
                  membersCount
                ) : (
                  <>
                    {memberMention}
                    {justJoined && canLeave && <JustJoinedMention />}
                    {membersCount}
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
