import React from 'react';
import { useSelector } from 'react-redux';
import {
  selectHasMessages,
  selectSelectedConversationId,
} from 'src/use-cases/messaging';
import {
  MessagingEmptyStateContainerMobile,
  StyledMessagingConversationContainerMobile,
  StyledMessagingGridMobile,
} from './Messaging.styles';
import { MessagingConversation } from './MessagingConversation/MessagingConversation';
import { MessagingConversationList } from './MessagingConversationsList/MessagingConversationList';
import { MessagingEmptyState } from './MessagingEmptyState';

export const MessagingMobile = () => {
  const selectedConversationId = useSelector(selectSelectedConversationId);
  const hasMessage = useSelector(selectHasMessages);

  return (
    <>
      {!hasMessage ? (
        <MessagingEmptyStateContainerMobile>
          <MessagingEmptyState
            title="Aucun message dans votre messagerie"
            subtitle="Contactez les membres de la communauté à partir du réseau d’entraide"
            action="Accéder au réseau d'entraide"
            actionHref="/backoffice/annuaire"
          />
        </MessagingEmptyStateContainerMobile>
      ) : (
        <StyledMessagingGridMobile>
          {!selectedConversationId && (
            <StyledMessagingConversationContainerMobile>
              <MessagingConversationList />
            </StyledMessagingConversationContainerMobile>
          )}
          {selectedConversationId && <MessagingConversation />}
        </StyledMessagingGridMobile>
      )}
    </>
  );
};
