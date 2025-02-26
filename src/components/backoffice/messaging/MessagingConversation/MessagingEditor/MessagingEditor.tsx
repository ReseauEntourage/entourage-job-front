import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { FileInput } from 'src/components/utils/Inputs';
import { GA_TAGS } from 'src/constants/tags';
import { useIsMobile } from 'src/hooks/utils';
import { gaEvent } from 'src/lib/gtag';
import {
  messagingActions,
  selectNewMessage,
  selectSelectedConversation,
  selectSelectedConversationId,
} from 'src/use-cases/messaging';
import { Attachment } from './Attachment/Attachment';
import {
  MessagingEditorContainer,
  MessagingInput,
  MessagingInputContainer,
  MessagingMessageForm,
  StyledAttachementInfoContainer,
} from './MessagingEditor.styles';

export interface MessagingEditorProps {
  readonly?: boolean;
}

export const MessagingEditor = ({ readonly }: MessagingEditorProps) => {
  // Hooks
  const isMobile = useIsMobile();
  const dispatch = useDispatch();

  // Selected props
  const selectedConversationId = useSelector(selectSelectedConversationId);
  const selectedConversation = useSelector(selectSelectedConversation);
  const newMessage = useSelector(selectNewMessage);

  // States
  const [attachment, setAttachement] = useState<File | null>(null);

  // Refs
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // Methods
  const onAttachmentAdded = (file: File | null) => {
    setAttachement(file);
  };

  const removeAttachment = () => {
    setAttachement(null);
    // Reset messaging-conversation-file-input
    const fileInput = document.getElementById(
      'messaging-conversation-file-input'
    );
    if (fileInput) {
      (fileInput as HTMLInputElement).value = '';
    }
  };

  const onRequestAttachFileClick = () => {
    const fileInput = document.getElementById(
      'messaging-conversation-file-input'
    );
    if (fileInput) {
      (fileInput as HTMLInputElement).click();
    }
  };

  const adjustMessageHeight = () => {
    if (!messageInputRef.current) {
      return;
    }
    messageInputRef.current.style.height = 'inherit';
    messageInputRef.current.style.height = `${messageInputRef.current.scrollHeight}px`;
  };

  const sendNewMessage = () => {
    if (selectedConversation === null) {
      return;
    }
    // Send the message by providing the conversationId if the conversation is not new
    // or the participantIds if the conversation is new
    const body = {
      content: newMessage,
      participantIds:
        selectedConversationId === 'new'
          ? selectedConversation.participants.map(
              (participant) => participant.id
            )
          : undefined,
      conversationId:
        selectedConversationId === 'new' ? undefined : selectedConversation.id,
    };
    dispatch(messagingActions.postMessageRequested(body));
    gaEvent(GA_TAGS.BACKOFFICE_MESSAGING_MESSAGE_SEND);
    dispatch(messagingActions.setNewMessage(''));
    adjustMessageHeight();
  };

  // Effects
  useEffect(() => {
    adjustMessageHeight();
  }, [newMessage]);

  useLayoutEffect(adjustMessageHeight, []);

  return (
    <MessagingEditorContainer>
      {attachment && (
        <StyledAttachementInfoContainer>
          <Attachment attachment={attachment} onClose={removeAttachment} />
        </StyledAttachementInfoContainer>
      )}
      <MessagingMessageForm className={isMobile ? 'mobile' : ''}>
        <FileInput
          id="messaging-conversation-file-input"
          name="messaging-conversation-file-input"
          accept="application/pdf"
          value={null}
          onChange={onAttachmentAdded}
          activator={
            <Button
              style="custom-secondary"
              onClick={onRequestAttachFileClick}
              rounded
            >
              <LucidIcon name="Plus" size={25} />
            </Button>
          }
        />

        <MessagingInputContainer>
          <MessagingInput
            rows={1}
            ref={messageInputRef}
            placeholder="Ecrivez votre message"
            value={newMessage}
            onChange={(e) => {
              dispatch(messagingActions.setNewMessage(e.target.value));
            }}
            disabled={readonly}
          />
        </MessagingInputContainer>
        {isMobile ? (
          <Button
            style="custom-secondary-inverted"
            onClick={sendNewMessage}
            disabled={readonly}
            rounded
          >
            <LucidIcon name="Send" size={25} />
          </Button>
        ) : (
          <Button onClick={sendNewMessage} disabled={readonly}>
            Envoyer
          </Button>
        )}
      </MessagingMessageForm>
    </MessagingEditorContainer>
  );
};
