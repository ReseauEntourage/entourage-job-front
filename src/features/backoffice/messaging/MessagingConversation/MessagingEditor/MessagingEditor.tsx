import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/src/components/ui';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { FileInput } from '@/src/components/ui/Inputs';
import { GA_TAGS } from 'src/constants/tags';
import { useIsMobile } from 'src/hooks/utils';
import { gaEvent } from 'src/lib/gtag';
import {
  messagingActions,
  selectNewMessage,
  selectSelectedConversation,
  selectSelectedConversationId,
  selectShouldGiveFeedback,
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
  const shouldGiveFeedback = useSelector(selectShouldGiveFeedback);

  // States
  const [attachments, setAttachments] = useState<File[]>([]);

  // Refs
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // Methods
  const onAttachmentAdded = (files: File | File[] | null) => {
    if (!files) {
      return;
    }
    if (!Array.isArray(files)) {
      files = [files];
    }
    setAttachments([...attachments, ...files]);
  };

  const removeAttachment = (attachment: File) => {
    setAttachments(attachments.filter((file) => file !== attachment));
  };

  const onRequestAttachFileClick = () => {
    const fileInput = document.getElementById('file-input');
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
    const formData = new FormData();

    formData.append('content', newMessage);
    if (attachments) {
      if (attachments.length > 0) {
        attachments.forEach((file) => {
          formData.append('files', file);
        });
      }
    }
    if (selectedConversationId === 'new') {
      selectedConversation.participants
        .map((participant) => participant.id)
        .forEach((participantId) => {
          formData.append('participantIds[]', participantId);
        });
    } else {
      formData.append('conversationId', selectedConversation.id);
    }
    dispatch(messagingActions.postMessageRequested(formData));
    gaEvent(GA_TAGS.BACKOFFICE_MESSAGING_MESSAGE_SEND);
    dispatch(messagingActions.setNewMessage(''));
    setAttachments([]);
    adjustMessageHeight();
  };

  // Effects
  useEffect(() => {
    adjustMessageHeight();
  }, [newMessage]);

  useLayoutEffect(adjustMessageHeight, []);

  return (
    <MessagingEditorContainer>
      {attachments && (
        <StyledAttachementInfoContainer>
          {attachments.map((attachment) => (
            <Attachment
              attachment={attachment}
              onClose={() => removeAttachment(attachment)}
              key={attachment.name}
            />
          ))}
        </StyledAttachementInfoContainer>
      )}
      <MessagingMessageForm
        blur={shouldGiveFeedback}
        className={isMobile ? 'mobile' : ''}
      >
        <FileInput
          id="file-input"
          name="file-input"
          accept="application/pdf, image/*"
          value={[]}
          onChange={onAttachmentAdded}
          activator={
            <Button
              variant="secondary"
              onClick={onRequestAttachFileClick}
              rounded="circle"
            >
              <LucidIcon name="Plus" size={25} />
            </Button>
          }
          noPadding
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
            variant="primary"
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
