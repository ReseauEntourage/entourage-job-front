import React from 'react';
import { Badge, BadgeVariant } from '@/src/components/ui/Badge';
import { StyledTabsContainer } from './MessagingConversationTabs.styles';

export type ConversationTabFilter = 'all' | 'unread' | 'archived';

export type ConversationTabCounts = Record<ConversationTabFilter, number>;

interface MessagingConversationTabsProps {
  activeTab: ConversationTabFilter;
  // Undefined until the conversations are loaded: the tabs then show their bare label
  // instead of a "· 0" that would be wrong.
  counts?: ConversationTabCounts;
  onTabChange: (tab: ConversationTabFilter) => void;
}

const formatTabLabel = (label: string, count?: number) =>
  count === undefined ? label : `${label} · ${count}`;

export const MessagingConversationTabs = ({
  activeTab,
  counts,
  onTabChange,
}: MessagingConversationTabsProps) => {
  return (
    <StyledTabsContainer>
      <Badge
        variant={
          activeTab === 'all' ? BadgeVariant.Primary : BadgeVariant.HoverBlue
        }
        borderRadius="large"
        onClick={() => onTabChange('all')}
        dataTestId="messaging-tab-all"
      >
        {formatTabLabel('En cours', counts?.all)}
      </Badge>
      <Badge
        variant={
          activeTab === 'unread' ? BadgeVariant.Primary : BadgeVariant.HoverBlue
        }
        borderRadius="large"
        onClick={() => onTabChange('unread')}
        dataTestId="messaging-tab-unread"
      >
        {formatTabLabel('Non lues', counts?.unread)}
      </Badge>
      <Badge
        variant={
          activeTab === 'archived'
            ? BadgeVariant.Primary
            : BadgeVariant.HoverBlue
        }
        borderRadius="large"
        onClick={() => onTabChange('archived')}
        dataTestId="messaging-tab-archived"
      >
        {formatTabLabel('Archivées', counts?.archived)}
      </Badge>
    </StyledTabsContainer>
  );
};
