import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessagingEmptyState } from '../MessagingEmptyState';
import { Button } from 'src/components/utils';
import { TextInput } from 'src/components/utils/Inputs';
import { DELAY_REFRESH_CONVERSATIONS } from 'src/constants';
import {
  messagingActions,
  selectSelectedConversation,
  selectSelectedConversationId,
} from 'src/use-cases/messaging';
import { MessagingConversationContainer } from './MessagingConversation.styles';
import { MessagingConversationHeader } from './MessagingConversationHeader/MessagingConversationHeader';

export const MessagingConversation = () => {
  const dispatch = useDispatch();
  const selectedConversationId = useSelector(selectSelectedConversationId);
  const selectedConversation = useSelector(selectSelectedConversation);

  const [newMessage, setNewMessage] = React.useState<string>('');

  useEffect(() => {
    if (selectedConversationId === null) {
      return;
    }
    dispatch(
      messagingActions.getConversationByIdRequested(selectedConversationId)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps

    const intervalId = setInterval(() => {
      dispatch(
        messagingActions.getConversationByIdRequested(selectedConversationId)
      );
    }, DELAY_REFRESH_CONVERSATIONS);

    return () => clearInterval(intervalId);
  }, [selectedConversationId, dispatch]);

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

  if (!selectedConversationId || !selectedConversation) {
    return (
      <MessagingConversationContainer>
        <MessagingEmptyState title="Cliquer sur une conversation pour la lire" />
      </MessagingConversationContainer>
    );
  }
  return (
    <MessagingConversationContainer>
      <MessagingConversationHeader />
      {selectedConversation.messages && (
        <div>
          {selectedConversation.messages.map((message) => (
            <div key={message.id}>
              <p>{message.content}</p>
              {message.author && (
                <p>
                  {message.author.firstName} {message.author.lastName}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
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
    </MessagingConversationContainer>
  );
};
