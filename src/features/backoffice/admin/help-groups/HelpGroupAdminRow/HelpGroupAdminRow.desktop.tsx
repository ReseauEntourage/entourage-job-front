import React from 'react';
import { Text } from '@/src/components/ui';
import { TdDesktop, TrDesktop } from '@/src/components/ui/Table';
import { formatHelpGroupLastActivity } from '../helpGroupsAdmin.utils';
import { HelpGroupAdminActions } from './HelpGroupAdminActions';
import { StyledHelpGroupAdminCenter } from './HelpGroupAdminRow.styles';
import { HelpGroupAdminRowProps } from './HelpGroupAdminRow.types';
import { HelpGroupPinToggle } from './HelpGroupPinToggle';
import { HelpGroupStateBadge } from './HelpGroupStateBadge';

export function HelpGroupAdminRowDesktop(props: HelpGroupAdminRowProps) {
  const { group } = props;
  return (
    <TrDesktop>
      <TdDesktop>
        <Text weight="semibold">{group.name}</Text>
      </TdDesktop>
      <TdDesktop>
        <HelpGroupStateBadge group={group} />
      </TdDesktop>
      <TdDesktop>
        <StyledHelpGroupAdminCenter>
          <HelpGroupPinToggle {...props} />
        </StyledHelpGroupAdminCenter>
      </TdDesktop>
      <TdDesktop>
        <Text>{group.membersCount}</Text>
      </TdDesktop>
      <TdDesktop>
        <Text>{group.discussionsCount}</Text>
      </TdDesktop>
      <TdDesktop>
        <Text color="darkGray">
          {formatHelpGroupLastActivity(group.lastActivityAt)}
        </Text>
      </TdDesktop>
      <TdDesktop>
        <HelpGroupAdminActions {...props} />
      </TdDesktop>
    </TrDesktop>
  );
}
