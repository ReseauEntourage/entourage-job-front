import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchBar } from 'src/features/filters/SearchBar/SearchBar';
import { useIsMobile } from 'src/hooks/utils';
import { selectCurrentUserId } from 'src/use-cases/current-user';
import { messagingActions, selectConversations } from 'src/use-cases/messaging';
import {
  ContainerStyled,
  StyledConversationsContainer,
  StyledSearchBarContainer,
} from './MessagingConversationList.styles';
import { MessagingConversationListItem } from './MessagingConversationListItem/MessagingConversationListItem';

export const MessagingConversationList = () => {
  const dispatch = useDispatch();
  const allConversations = useSelector(selectConversations);
  const currentUserId = useSelector(selectCurrentUserId);
  const [conversations, setConversations] = useState(allConversations);
  const [query, setQuery] = useState('');
  const isMobile = useIsMobile();

  useEffect(() => {
    dispatch(messagingActions.getConversationsRequested());
  }, [dispatch]);

  useEffect(() => {
    if (!allConversations) {
      return setConversations(null);
    }
    if (!query) {
      return setConversations(allConversations);
    }
    setConversations(
      allConversations.filter((conversation) =>
        conversation.participants
          .filter((participant) => participant.id !== currentUserId)
          .some(
            (participant) =>
              participant.firstName
                .toLowerCase()
                .includes(query.toLowerCase()) ||
              participant.lastName.toLowerCase().includes(query.toLowerCase())
          )
      )
    );
  }, [allConversations, currentUserId, query]);

  const setSearch = useCallback((search) => {
    setQuery(search);
  }, []);

  return (
    <ContainerStyled>
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
      </StyledConversationsContainer>
    </ContainerStyled>
  );
};
