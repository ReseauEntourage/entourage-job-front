import React from 'react';
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

  return (
    <ContainerStyled>
      {!isMobile && (
        <StyledSearchBarContainer>
          <SearchBar
            search={query}
            setSearch={(search) => dispatch(messagingActions.setQuery(search))}
            placeholder="Rechercher"
            smallSelectors
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
