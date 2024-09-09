import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessagingEmptyState } from '../MessagingEmptyState';
import { Button } from 'src/components/utils';
import { TextInput } from 'src/components/utils/Inputs';
import { useIsMobile } from 'src/hooks/utils';
import {
  messagingActions,
  selectSelectedConversation,
  selectSelectedConversationId,
} from 'src/use-cases/messaging';
import {
  MessagingConversationContainer,
  MessagingMessageForm,
  MessagingMessagesContainer,
} from './MessagingConversation.styles';
import { MessagingConversationHeader } from './MessagingConversationHeader/MessagingConversationHeader';
import { MessagingMessage } from './MessagingMessage/MessagingMessage';

export const MessagingConversation = () => {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const selectedConversationId = useSelector(selectSelectedConversationId);
  const selectedConversation = useSelector(selectSelectedConversation);
  const [newMessage, setNewMessage] = React.useState<string>('');

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  const sendNewMessage = () => {
    if (selectedConversation === null) {
      return;
    }
    dispatch(
      messagingActions.postMessageRequested({
        content: newMessage,
        conversationId: selectedConversation.id,
      })
    );
    setNewMessage('');
  };

  useEffect(() => {
    if (selectedConversation && selectedConversation.messages) {
      scrollToBottom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation]);

  return (
    <MessagingConversationContainer className={isMobile ? 'mobile' : ''}>
      {!selectedConversationId || !selectedConversation ? (
        <MessagingEmptyState title="Cliquer sur une conversation pour la lire" />
      ) : (
        <>
          <MessagingConversationHeader />
          <MessagingMessagesContainer>
            {selectedConversation && selectedConversation.messages && (
              <>
                {selectedConversation.messages.map((message) => (
                  <MessagingMessage key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </MessagingMessagesContainer>
          {/* Bloc de rédaction d'un message */}
          <MessagingMessageForm>
            <TextInput
              placeholder="Ecrire un message"
              id="message-content"
              name="message-content"
              value={newMessage}
              onChange={(val) => {
                setNewMessage(val);
              }}
            />
            <Button onClick={sendNewMessage}>Envoyer</Button>
          </MessagingMessageForm>
        </>
      )}
    </MessagingConversationContainer>
  );
};
