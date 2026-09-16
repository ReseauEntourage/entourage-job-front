import React from 'react';
import { Badge, BadgeVariant } from '@/src/components/ui/Badge';
import { StyledTabsContainer } from './MessagingConversationTabs.styles';

export type ConversationTabFilter = 'all' | 'unread' | 'archived';

interface MessagingConversationTabsProps {
  activeTab: ConversationTabFilter;
  activeConversationsCount: number;
  unreadCount: number;
  onTabChange: (tab: ConversationTabFilter) => void;
}

export const MessagingConversationTabs = ({
  activeTab,
  activeConversationsCount,
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
        En cours · {activeConversationsCount}
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
        Archivées
      </Badge>
    </StyledTabsContainer>
  );
};
