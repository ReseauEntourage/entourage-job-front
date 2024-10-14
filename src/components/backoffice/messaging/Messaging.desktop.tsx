import React from 'react';
import { useSelector } from 'react-redux';
import { StyledBackofficeBackground } from '../Backoffice.styles';
import { Section } from 'src/components/utils';
import { H1 } from 'src/components/utils/Headings';
import { selectHasMessages } from 'src/use-cases/messaging';
import {
  StyledMessagingGridDesktop,
  StyledMessagingLeftPanel,
  StyledMessagingRightPanel,
} from './Messaging.styles';
import { MessagingConversation } from './MessagingConversation/MessagingConversation';
import { MessagingConversationList } from './MessagingConversationsList/MessagingConversationList';
import { MessagingEmptyState } from './MessagingEmptyState';

export const MessagingDesktop = () => {
  const hasMessage = useSelector(selectHasMessages);

  return (
    <>
      <StyledBackofficeBackground>
        <Section>
          <H1 title="Messagerie" color="black" />
          <p>Echanger avec les membres de la communauté</p>
        </Section>
      </StyledBackofficeBackground>
      <Section>
        {!hasMessage ? (
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
