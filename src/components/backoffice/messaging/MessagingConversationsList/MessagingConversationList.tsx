import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchBar } from 'src/components/filters/SearchBar/SearchBar';
import { useIsMobile } from 'src/hooks/utils';
import {
  messagingActions,
  selectConversations,
  selectQuery,
} from 'src/use-cases/messaging';
import {
  ContainerStyled,
  StyledConversationsContainer,
  StyledSearchBarContainer,
} from './MessagingConversationList.styles';
import { MessagingConversationListItem } from './MessagingConversationListItem/MessagingConversationListItem';

export const MessagingConversationList = () => {
  const dispatch = useDispatch();
  const conversations = useSelector(selectConversations);
  const query = useSelector(selectQuery);
  const isMobile = useIsMobile();

  useEffect(() => {
    dispatch(messagingActions.getConversationsRequested());
  }, [dispatch, query]);

  const setSearch = useCallback(
    (search) => {
      dispatch(messagingActions.setQuery(search));
    },
    [dispatch]
  );

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
