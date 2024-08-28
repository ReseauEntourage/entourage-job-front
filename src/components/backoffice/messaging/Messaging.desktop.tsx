import React from 'react';
import { StyledBackofficeBackground } from '../Backoffice.styles';
import { Section } from 'src/components/utils';
import { H1 } from 'src/components/utils/Headings';
import {
  StyledMessagingGridDesktop,
  StyledMessagingLeftPanel,
  StyledMessagingRightPanel,
} from './Messaging.styles';
import { MessagingConversation } from './MessagingConversation/MessagingConversation';
import { MessagingConversationList } from './MessagingConversationsList/MessagingConversationList';

export const MessagingDesktop = () => {
  return (
    <>
      <StyledBackofficeBackground>
        <Section>
          <H1 title="Messagerie" color="black" />
          <p>Echanger avec les membres de la communauté</p>
        </Section>
      </StyledBackofficeBackground>
      <Section>
        <StyledMessagingGridDesktop>
          <StyledMessagingLeftPanel>
            <MessagingConversationList />
          </StyledMessagingLeftPanel>
          <StyledMessagingRightPanel>
            <MessagingConversation />
          </StyledMessagingRightPanel>
        </StyledMessagingGridDesktop>
      </Section>
    </>
  );
};
