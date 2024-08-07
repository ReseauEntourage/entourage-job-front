import React from 'react';
import { Button } from 'src/components/utils';
import { TextInput } from 'src/components/utils/Inputs';

export const MessagingConversation = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messages, setMessages] = React.useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [newMessage, setNewMessage] = React.useState<any>('');

  React.useEffect(() => {
    setMessages([
      {
        id: 1,
        content: 'Salut, comment vas-tu ?',
        sender: {
          id: 1,
          name: 'John Doe',
        },
      },
      {
        id: 2,
        content: 'Salut, je vais bien et toi ?',
        sender: {
          id: 1,
          name: 'Tu réponds pas au message ?',
        },
      },
    ]);
  }, []);

  return (
    <div>
      <h1>Liste des messages</h1>
      {messages.map((message) => (
        <div key={message.id}>
          <p>{message.content}</p>
          <p>{message.sender.name}</p>
        </div>
      ))}
      <TextInput
        placeholder="Ecrire un message"
        id="message-content"
        name="message-content"
        value={newMessage}
        onChange={(val) => {
          setNewMessage(val);
        }}
      />
      <Button
        onClick={() => {
          setMessages([
            ...messages,
            {
              id: messages.length + 1,
              content: newMessage,
              sender: { id: 1, name: 'John Doe' },
            },
          ]);
        }}
      >
        Envoyer
      </Button>
    </div>
  );
};
