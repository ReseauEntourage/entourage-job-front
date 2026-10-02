import React from 'react';
import { HelpGroupCard as HelpGroupCardType } from '@/src/api/types';
import { HelpGroupCard } from '../HelpGroupCard';
import { StyledHelpGroupList } from './HelpGroupList.styles';

interface HelpGroupListProps {
  groups: HelpGroupCardType[];
}

/**
 * Not paginated. The catalog redirects before rendering an empty list.
 */
export function HelpGroupList({ groups }: HelpGroupListProps) {
  return (
    <StyledHelpGroupList>
      {groups.map((group) => (
        <HelpGroupCard key={group.id} group={group} />
      ))}
    </StyledHelpGroupList>
  );
}
