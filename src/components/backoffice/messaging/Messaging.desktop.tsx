import React from 'react';
import { useSelector } from 'react-redux';
import { selectHasMessages } from 'src/use-cases/messaging';
import {
  StyledMessagingGridDesktop,
  StyledMessagingLeftPanel,
  StyledMessagingRightPanel,
  MessagingEmptyStateContainerDesktop,
} from './Messaging.styles';
import { MessagingConversation } from './MessagingConversation/MessagingConversation';
import { MessagingConversationList } from './MessagingConversationsList/MessagingConversationList';
import { MessagingEmptyState } from './MessagingEmptyState';

export const MessagingDesktop = () => {
  const hasMessage = useSelector(selectHasMessages);

  return (
    <>
      {!hasMessage ? (
        <MessagingEmptyStateContainerDesktop>
          <MessagingEmptyState
            title="Aucun message dans votre messagerie"
            subtitle="Contactez les membres de la communauté à partir du réseau d’entraide"
            action="Accéder au réseau d'entraide"
            actionHref="/backoffice/annuaire"
          />
        </MessagingEmptyStateContainerDesktop>
      ) : (
        <StyledMessagingGridDesktop>
          <StyledMessagingLeftPanel>
            <MessagingConversationList />
          </StyledMessagingLeftPanel>
          <StyledMessagingRightPanel>
            <MessagingConversation />
          </StyledMessagingRightPanel>
        </StyledMessagingGridDesktop>
      )}
    </>
  );
};
