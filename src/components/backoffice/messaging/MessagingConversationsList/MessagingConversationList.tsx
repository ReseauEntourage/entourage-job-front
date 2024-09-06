import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessagingConversationListItem } from '../MessagingConversationListItem/MessagingConversationListItem';
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
} from './MessagingConversationList.styles';

export const MessagingConversationList = () => {
  const dispatch = useDispatch();
  const conversations = useSelector(selectConversations);
  const query = useSelector(selectQuery);
  const isMobile = useIsMobile();

  return (
    <ContainerStyled>
      {!isMobile && (
        <SearchBar
          search={query}
          setSearch={(search) => dispatch(messagingActions.setQuery(search))}
          placeholder="Rechercher"
          smallSelectors
        />
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
      </StyledConversationsContainer>
    </ContainerStyled>
  );
};
