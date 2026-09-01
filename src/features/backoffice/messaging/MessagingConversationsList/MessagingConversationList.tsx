import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text } from '@/src/components/ui';
import { SearchBar } from '@/src/features/filters/SearchBar/SearchBar';
import { useIsMobile } from '@/src/hooks/utils';
import { selectCurrentUserId } from '@/src/use-cases/current-user';
import {
  messagingActions,
  selectConversations,
  selectUnseenConversationCount,
} from '@/src/use-cases/messaging';
import { conversationHasUnreadMessages } from '../messaging.utils';
import {
  ContainerStyled,
  StyledConversationsContainer,
  StyledEmptyState,
  StyledSearchBarContainer,
} from './MessagingConversationList.styles';
import { MessagingConversationListItem } from './MessagingConversationListItem/MessagingConversationListItem';
import {
  ConversationTabFilter,
  MessagingConversationTabs,
} from './MessagingConversationTabs/MessagingConversationTabs';

export const MessagingConversationList = () => {
  const dispatch = useDispatch();
  const allConversations = useSelector(selectConversations);
  const currentUserId = useSelector(selectCurrentUserId);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<ConversationTabFilter>('all');
  const isMobile = useIsMobile();

  useEffect(() => {
    dispatch(messagingActions.getConversationsRequested());
  }, [dispatch]);

  const unseenConversationCount = useSelector(selectUnseenConversationCount);

  const conversations = useMemo(() => {
    if (!allConversations) {
      return null;
    }

    let filtered = allConversations;

    if (query) {
      filtered = filtered.filter((conversation) =>
        conversation.participants
          .filter((participant) => participant.id !== currentUserId)
          .some(
            (participant) =>
              participant.firstName
                .toLowerCase()
                .includes(query.toLowerCase()) ||
              participant.lastName.toLowerCase().includes(query.toLowerCase())
          )
      );
    }

    if (activeTab === 'archived') {
      return filtered.filter((c) => !!c.archivedAt);
    }

    if (activeTab === 'unread') {
      // Unlike "Tous", "Non lus" still surfaces an archived conversation that
      // received a new message, so the user notices it despite having archived it.
      return filtered.filter((c) =>
        conversationHasUnreadMessages(c, currentUserId)
      );
    }

    // "Tous" excludes conversations archived by the current user
    filtered = filtered.filter((c) => !c.archivedAt);

    // Sort unread conversations first in the "all" tab
    return [...filtered].sort((a, b) => {
      const aUnread = conversationHasUnreadMessages(a, currentUserId) ? 1 : 0;
      const bUnread = conversationHasUnreadMessages(b, currentUserId) ? 1 : 0;
      return bUnread - aUnread;
    });
  }, [allConversations, currentUserId, query, activeTab]);

  const setSearch = useCallback((search) => {
    setQuery(search);
  }, []);

  return (
    <ContainerStyled data-testid="messaging-conversation-list">
      <MessagingConversationTabs
        activeTab={activeTab}
        unreadCount={unseenConversationCount}
        onTabChange={setActiveTab}
      />
      {!isMobile && (
        <StyledSearchBarContainer data-testid="messaging-search-bar">
          <SearchBar
            search={query}
            setSearch={setSearch}
            placeholder="Rechercher"
            smallSelectors
            instantSearch
          />
        </StyledSearchBarContainer>
      )}
      <StyledConversationsContainer>
        {conversations &&
          conversations.length > 0 &&
          conversations.map((conversation) => (
            <MessagingConversationListItem
              key={conversation.id}
              conversation={conversation}
            />
          ))}
        {conversations &&
          conversations.length === 0 &&
          activeTab === 'unread' && (
            <StyledEmptyState data-testid="messaging-unread-empty-state">
              <Text center>Aucune conversation non lue</Text>
            </StyledEmptyState>
          )}
        {conversations &&
          conversations.length === 0 &&
          activeTab === 'archived' && (
            <StyledEmptyState data-testid="messaging-archived-empty-state">
              <Text center>Aucune conversation archivée</Text>
            </StyledEmptyState>
          )}
      </StyledConversationsContainer>
    </ContainerStyled>
  );
};
