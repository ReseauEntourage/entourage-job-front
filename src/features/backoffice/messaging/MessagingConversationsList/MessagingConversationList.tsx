import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { conversationHasUnreadMessages } from '../messaging.utils';
import { Text } from 'src/components/ui';
import { SearchBar } from 'src/features/filters/SearchBar/SearchBar';
import { useIsMobile } from 'src/hooks/utils';
import { selectCurrentUserId } from 'src/use-cases/current-user';
import { messagingActions, selectConversations } from 'src/use-cases/messaging';
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

  const unreadCount = useMemo(() => {
    if (!allConversations || !currentUserId) {
      return 0;
    }
    return allConversations.filter((c) =>
      conversationHasUnreadMessages(c, currentUserId)
    ).length;
  }, [allConversations, currentUserId]);

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

    if (activeTab === 'unread') {
      return filtered.filter((c) =>
        conversationHasUnreadMessages(c, currentUserId)
      );
    }

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
    <ContainerStyled>
      <MessagingConversationTabs
        activeTab={activeTab}
        unreadCount={unreadCount}
        onTabChange={setActiveTab}
      />
      {!isMobile && (
        <StyledSearchBarContainer>
          <SearchBar
            search={query}
            setSearch={setSearch}
            placeholder="Rechercher"
            smallSelectors
            instantSearch
          />
        </StyledSearchBarContainer>
      )}
      <StyledConversationsContainer className={isMobile ? 'mobile' : ''}>
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
            <StyledEmptyState>
              <Text center>Aucune conversation non lue</Text>
            </StyledEmptyState>
          )}
      </StyledConversationsContainer>
    </ContainerStyled>
  );
};
