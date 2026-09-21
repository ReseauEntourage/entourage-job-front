import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonIcon } from '@/src/components/ui';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { FileInput } from '@/src/components/ui/Inputs';
import { COLORS } from '@/src/constants/styles';
import { GA_TAGS } from '@/src/constants/tags';
import { useIsMobile } from '@/src/hooks/utils';
import { gaEvent } from '@/src/lib/gtag';
import {
  messagingActions,
  NEW_CONVERSATION_ID,
  selectNewConversationDraft,
  selectNewMessage,
  selectSelectedConversation,
  selectSelectedConversationId,
} from '@/src/use-cases/messaging';
import { notificationsActions } from '@/src/use-cases/notifications';
import { Attachment } from './Attachment/Attachment';
import {
  MessagingEditorContainer,
  MessagingInput,
  MessagingInputContainer,
  MessagingMessageForm,
  StyledAttachementInfoContainer,
} from './MessagingEditor.styles';

interface MessagingEditorProps {
  readonly?: boolean;
}

export const MessagingEditor = ({ readonly }: MessagingEditorProps) => {
  // Hooks
  const isMobile = useIsMobile();
  const dispatch = useDispatch();

  // Selected props
  const selectedConversationId = useSelector(selectSelectedConversationId);
  const selectedConversation = useSelector(selectSelectedConversation);
  const newConversationDraft = useSelector(selectNewConversationDraft);
  const newMessage = useSelector(selectNewMessage);

  // States
  const [attachments, setAttachments] = useState<{ id: number; file: File }[]>(
    []
  );

  // Refs
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const attachmentCounter = useRef(0);

  // Methods
  const onAttachmentAdded = (files: File | File[] | null) => {
    if (!files) {
      return;
    }
    if (!Array.isArray(files)) {
      files = [files];
    }
    const newAttachments = files.map((file) => ({
      id: attachmentCounter.current++,
      file,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id: number) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
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
    const isNewConversation = selectedConversationId === NEW_CONVERSATION_ID;
    const recipientIds = isNewConversation
      ? (newConversationDraft ?? []).map((participant) => participant.id)
      : [];
    const conversationId = isNewConversation ? null : selectedConversation?.id;

    // Never fail silently: a click on "send" always produces something the
    // user can see. Returning quietly here is what made a lost first
    // message indistinguishable from a broken button — and left no trace
    // anywhere, since no request was ever sent.
    if (isNewConversation ? recipientIds.length === 0 : !conversationId) {
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message:
            "Une erreur est survenue lors de l'envoi du message. Rechargez la page et réessayez.",
        })
      );
      return;
    }

    // Send the message by providing the conversationId if the conversation is not new
    // or the participantIds if the conversation is new
    const formData = new FormData();

    formData.append('content', newMessage);
    if (attachments) {
      if (attachments.length > 0) {
        attachments.forEach(({ file }) => {
          formData.append('files', file);
        });
      }
    }
    if (isNewConversation) {
      recipientIds.forEach((participantId) => {
        formData.append('participantIds[]', participantId);
      });
    } else {
      formData.append('conversationId', conversationId as string);
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
      {attachments && attachments.length > 0 && (
        <StyledAttachementInfoContainer>
          {attachments.map((attachment) => (
            <Attachment
              attachment={attachment.file}
              onClose={() => removeAttachment(attachment.id)}
              key={attachment.id}
            />
          ))}
        </StyledAttachementInfoContainer>
      )}
      <MessagingMessageForm>
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
              size="large"
              dataTestId="messaging-attach-button"
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
            data-testid="messaging-editor-input"
          />
        </MessagingInputContainer>
        {isMobile ? (
          <ButtonIcon
            icon={<LucidIcon name="Send" />}
            size="large"
            onClick={sendNewMessage}
            disabled={readonly}
            color={COLORS.white}
            variant="primary"
            dataTestId="messaging-send-button"
          />
        ) : (
          <Button
            onClick={sendNewMessage}
            disabled={readonly}
            dataTestId="messaging-send-button"
          >
            Envoyer
          </Button>
        )}
      </MessagingMessageForm>
    </MessagingEditorContainer>
  );
};
