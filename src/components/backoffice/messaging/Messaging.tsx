import React from 'react';
import { StyledBackofficeBackground } from '../Backoffice.styles';
import { H1 } from 'src/components/utils/Headings';
import { Section } from 'src/components/utils/Section';
import {
  MessagingContainerStyled,
  StyledMessagingTitleContainer,
} from './Messaging.styles';
import { MessagingConversation } from './MessagingConversation/MessagingConversation';
import { MessagingConversationList } from './MessagingConversationsList/MessagingConversationList';

export const Messaging = () => {
  return (
    <>
      <StyledBackofficeBackground>
        <Section>
          <StyledMessagingTitleContainer>
            <H1 title="Messagerie" color="black" />
            <p>Echanger avec les membres de la communauté</p>
          </StyledMessagingTitleContainer>
        </Section>
      </StyledBackofficeBackground>
      <Section>
        <MessagingContainerStyled>
          <MessagingConversationList />
          <MessagingConversation />
        </MessagingContainerStyled>
      </Section>
    </>
  );
};
