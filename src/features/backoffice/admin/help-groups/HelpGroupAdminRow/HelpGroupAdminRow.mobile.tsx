import React from 'react';
import { Text } from '@/src/components/ui';
import { HELP_GROUP_ADMIN_LABELS } from '../helpGroupsAdmin.utils';
import { HelpGroupAdminActions } from './HelpGroupAdminActions';
import {
  StyledHelpGroupAdminCard,
  StyledHelpGroupAdminCardHeader,
  StyledHelpGroupAdminCardTitle,
} from './HelpGroupAdminRow.styles';
import { HelpGroupAdminRowProps } from './HelpGroupAdminRow.types';
import { HelpGroupPinToggle } from './HelpGroupPinToggle';
import { HelpGroupStateBadge } from './HelpGroupStateBadge';

/**
 * A group as a card: name, state, pin toggle, counters line, then the main
 * action and the « ⋯ » menu.
 */
export function HelpGroupAdminRowMobile(props: HelpGroupAdminRowProps) {
  const { group } = props;
  return (
    <StyledHelpGroupAdminCard data-testid={`help-group-admin-card-${group.id}`}>
      <StyledHelpGroupAdminCardHeader>
        <StyledHelpGroupAdminCardTitle>
          <Text weight="semibold">{group.name}</Text>
          <HelpGroupStateBadge group={group} />
        </StyledHelpGroupAdminCardTitle>
        <HelpGroupPinToggle {...props} />
      </StyledHelpGroupAdminCardHeader>
      <Text size="small" color="darkGray">
        {HELP_GROUP_ADMIN_LABELS.formatCounters(group)}
      </Text>
      <HelpGroupAdminActions {...props} isCard />
    </StyledHelpGroupAdminCard>
  );
}
