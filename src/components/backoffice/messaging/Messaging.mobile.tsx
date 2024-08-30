import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyledBackofficeBackground } from '../Backoffice.styles';
import { Button, Section } from 'src/components/utils';
import { H1 } from 'src/components/utils/Headings';
import {
  messagingActions,
  selectSelectedConversationId,
} from 'src/use-cases/messaging';
import {
  StyledMessagingConversationContainerMobile,
  StyledMessagingGridMobile,
} from './Messaging.styles';
import { MessagingConversation } from './MessagingConversation/MessagingConversation';
import { MessagingConversationList } from './MessagingConversationsList/MessagingConversationList';

export const MessagingMobile = () => {
  const dispatch = useDispatch();
  const selectedConversationId = useSelector(selectSelectedConversationId);

  const onClickBackBtn = () => {
    dispatch(messagingActions.selectConversation(null));
  };

  return (
    <StyledMessagingGridMobile>
      {selectedConversationId && <Button onClick={onClickBackBtn}>Back</Button>}
      {!selectedConversationId && (
        <StyledMessagingConversationContainerMobile>
          <StyledBackofficeBackground>
            <Section>
              <H1 title="Messagerie" color="black" />
              <p>Echanger avec les membres de la communauté</p>
            </Section>
          </StyledBackofficeBackground>
          <MessagingConversationList />
        </StyledMessagingConversationContainerMobile>
      )}
      {selectedConversationId && <MessagingConversation />}
    </StyledMessagingGridMobile>
  );
};
