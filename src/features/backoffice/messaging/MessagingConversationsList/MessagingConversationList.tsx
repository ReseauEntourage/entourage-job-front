import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text } from '@/src/components/ui';
import { SearchBar } from '@/src/features/filters/SearchBar/SearchBar';
import { useIsMobile } from '@/src/hooks/utils';
import { selectCurrentUserId } from '@/src/use-cases/current-user';
import {
  messagingActions,
  selectConversations,
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

  // Conversations matching the search bar, before any tab filtering. The three tab
  // lists all derive from it, so a tab counter is exactly the length of the list that
  // tab displays, search included. The search only matches participant names, never
  // message content.
  const searchedConversations = useMemo(() => {
    if (!allConversations) {
      return null;
    }

    if (!query) {
      return allConversations;
    }

    return allConversations.filter((conversation) =>
      conversation.participants
        .filter((participant) => participant.id !== currentUserId)
        .some(
          (participant) =>
            participant.firstName.toLowerCase().includes(query.toLowerCase()) ||
            participant.lastName.toLowerCase().includes(query.toLowerCase())
        )
    );
  }, [allConversations, currentUserId, query]);

  // All three lists are computed, not just the active tab's one, because every tab
  // displays the count of what it holds.
  const conversationsByTab = useMemo(() => {
    if (!searchedConversations) {
      return null;
    }

    // "En cours" excludes the conversations archived by the current user, and sorts
    // unread ones first without excluding the others.
    const all = [...searchedConversations]
      .filter((c) => !c.archivedAt)
      .sort((a, b) => {
        const aUnread = conversationHasUnreadMessages(a, currentUserId) ? 1 : 0;
        const bUnread = conversationHasUnreadMessages(b, currentUserId) ? 1 : 0;
        return bUnread - aUnread;
      });

    // Unlike "En cours", "Non lues" still surfaces an archived conversation that
    // received a new message, so the user notices it despite having archived it.
    const unread = searchedConversations.filter((c) =>
      conversationHasUnreadMessages(c, currentUserId)
    );

    const archived = searchedConversations.filter((c) => !!c.archivedAt);

    return { all, unread, archived };
  }, [searchedConversations, currentUserId]);

  const conversations = conversationsByTab
    ? conversationsByTab[activeTab]
    : null;

  // Left undefined until the conversations are loaded, so the tabs show their bare
  // label rather than a misleading "· 0".
  const counts = useMemo(
    () =>
      conversationsByTab
        ? {
            all: conversationsByTab.all.length,
            unread: conversationsByTab.unread.length,
            archived: conversationsByTab.archived.length,
          }
        : undefined,
    [conversationsByTab]
  );

  const setSearch = useCallback((search) => {
    setQuery(search);
  }, []);

  return (
    <ContainerStyled data-testid="messaging-conversation-list">
      <MessagingConversationTabs
        activeTab={activeTab}
        counts={counts}
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
