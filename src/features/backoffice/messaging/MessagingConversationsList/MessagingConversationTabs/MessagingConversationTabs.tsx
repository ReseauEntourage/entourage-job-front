import React from 'react';
import { Badge, BadgeVariant } from '@/src/components/ui/Badge';
import { StyledTabsContainer } from './MessagingConversationTabs.styles';

export type ConversationTabFilter = 'all' | 'unread';

interface MessagingConversationTabsProps {
  activeTab: ConversationTabFilter;
  unreadCount: number;
  onTabChange: (tab: ConversationTabFilter) => void;
}

export const MessagingConversationTabs = ({
  activeTab,
  unreadCount,
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
        Tous
      </Badge>
      <Badge
        variant={
          activeTab === 'unread' ? BadgeVariant.Primary : BadgeVariant.HoverBlue
        }
        borderRadius="large"
        onClick={() => onTabChange('unread')}
        dataTestId="messaging-tab-unread"
      >
        Non lus · {unreadCount}
      </Badge>
    </StyledTabsContainer>
  );
};
