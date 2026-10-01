import React from 'react';
import { HelpGroupCard as HelpGroupCardType } from '@/src/api/types';
import { Text } from '@/src/components/ui';
import { HelpGroupCard } from '../HelpGroupCard';
import { HELP_GROUPS_EMPTY_LIST_LABEL } from '../help-groups.labels';
import {
  StyledHelpGroupList,
  StyledHelpGroupListEmpty,
} from './HelpGroupList.styles';

interface HelpGroupListProps {
  groups: HelpGroupCardType[];
}

/**
 * Not paginated. Without any published group, a neutral message announces
 * the upcoming opening (never "0 groupe" nor "aucun groupe").
 */
export function HelpGroupList({ groups }: HelpGroupListProps) {
  if (groups.length === 0) {
    return (
      <StyledHelpGroupListEmpty>
        <Text size="large" color="darkGray" center>
          {HELP_GROUPS_EMPTY_LIST_LABEL}
        </Text>
      </StyledHelpGroupListEmpty>
    );
  }
  return (
    <StyledHelpGroupList>
      {groups.map((group) => (
        <HelpGroupCard key={group.id} group={group} />
      ))}
    </StyledHelpGroupList>
  );
}
