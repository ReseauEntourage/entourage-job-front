import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'src/components/utils';
import { TextInput } from 'src/components/utils/Inputs';
import {
  messagingActions,
  selectSelectedConversation,
  selectSelectedConversationId,
} from 'src/use-cases/messaging';

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
    }, 10000); // 10 secondes

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

  const EmptyState = () => (
    <p>Séléctionnez une conversation pour voir les messages</p>
  );

  return (
    <div>
      {!selectedConversationId && <EmptyState />}
      {selectedConversation && (
        <>
          <h1>Conversation</h1>
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
        </>
      )}
    </div>
  );
};
