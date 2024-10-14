import React from 'react';
import { useSelector } from 'react-redux';
import { StyledBackofficeBackground } from '../Backoffice.styles';
import { Section } from 'src/components/utils';
import { H1 } from 'src/components/utils/Headings';
import {
  selectConversations,
  selectQuery,
  selectSelectedConversationId,
} from 'src/use-cases/messaging';
import {
  StyledMessagingGridDesktop,
  StyledMessagingLeftPanel,
  StyledMessagingRightPanel,
} from './Messaging.styles';
import { MessagingConversation } from './MessagingConversation/MessagingConversation';
import { MessagingConversationList } from './MessagingConversationsList/MessagingConversationList';
import { MessagingEmptyState } from './MessagingEmptyState';

export const MessagingDesktop = () => {
  const conversations = useSelector(selectConversations);
  const query = useSelector(selectQuery);
  const selectedConversationId = useSelector(selectSelectedConversationId);

  return (
    <>
      <StyledBackofficeBackground>
        <Section>
          <H1 title="Messagerie" color="black" />
          <p>Echanger avec les membres de la communauté</p>
        </Section>
      </StyledBackofficeBackground>
      <Section>
        {conversations !== null &&
        conversations.length <= 0 &&
        query === '' &&
        selectedConversationId === null ? (
          <MessagingEmptyState
            title="Aucun message dans votre messagerie"
            subtitle="Contactez les membres de la communauté à partir du réseau d’entraide"
            action="Accéder au réseau d'entraide"
            actionHref="/backoffice/annuaire"
          />
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
      </Section>
    </>
  );
};
