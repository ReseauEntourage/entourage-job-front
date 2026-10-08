import React from 'react';
import { HelpGroupPage } from '@/src/api/types';
import { Button, Text } from '@/src/components/ui';
import { H5 } from '@/src/components/ui/Headings';
import { useGetHelpGroupMembersQuery } from '@/src/use-cases/help-groups';
import { HelpGroupAuthor } from '../HelpGroupAuthor';
import {
  formatMembersCount,
  formatSeeAllMembersLabel,
  HELP_GROUP_MEMBERS_PREVIEW_SIZE,
  HELP_GROUP_MEMBERS_TITLE,
} from '../help-groups.labels';
import {
  StyledHelpGroupMembers,
  StyledHelpGroupMembersHeading,
  StyledHelpGroupMembersPreview,
  StyledHelpGroupMembersPreviewItem,
} from './HelpGroupMembers.styles';
import { openHelpGroupMembersModal } from './HelpGroupMembersModal';

interface HelpGroupMembersProps {
  group: Pick<HelpGroupPage, 'slug' | 'membersCount'>;
}

/**
 * « Les membres »: the members count, the 5 most recent arrivals and
 * « Voir les N membres », which opens the full list. Shown to anyone who
 * can read the group, member or not; never for a group without members.
 */
export function HelpGroupMembers({ group }: HelpGroupMembersProps) {
  const hasMembers = group.membersCount > 0;
  const { data } = useGetHelpGroupMembersQuery(
    { slug: group.slug, page: 1, limit: HELP_GROUP_MEMBERS_PREVIEW_SIZE },
    { skip: !hasMembers }
  );

  if (!hasMembers) {
    return null;
  }

  return (
    <StyledHelpGroupMembers
      aria-label={HELP_GROUP_MEMBERS_TITLE}
      data-testid="help-group-members"
    >
      <StyledHelpGroupMembersHeading>
        <H5 title={HELP_GROUP_MEMBERS_TITLE} weight="semibold" noMarginBottom />
        <Text size="small" color="darkGray">
          {formatMembersCount(group.membersCount)}
        </Text>
      </StyledHelpGroupMembersHeading>
      {data && data.members.length > 0 && (
        <StyledHelpGroupMembersPreview>
          {data.members.map(({ author, hasPicture }) => (
            <StyledHelpGroupMembersPreviewItem
              key={author.id}
              data-testid="help-group-members-preview-item"
            >
              <HelpGroupAuthor author={author} hasPicture={hasPicture} />
            </StyledHelpGroupMembersPreviewItem>
          ))}
        </StyledHelpGroupMembersPreview>
      )}
      <Button
        variant="secondary"
        onClick={() => openHelpGroupMembersModal(group)}
        dataTestId="help-group-members-see-all"
      >
        {formatSeeAllMembersLabel(group.membersCount)}
      </Button>
    </StyledHelpGroupMembers>
  );
}
