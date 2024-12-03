import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessagingEmptyState } from '../MessagingEmptyState';
import { Button } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { DELAY_REFRESH_CONVERSATIONS } from 'src/constants';
import { USER_ROLES } from 'src/constants/users';
import { useIsMobile } from 'src/hooks/utils';
import {
  selectCurrentUser,
  selectCurrentUserId,
} from 'src/use-cases/current-user';
import {
  messagingActions,
  selectSelectedConversation,
  selectSelectedConversationId,
  selectPinnedInfo,
} from 'src/use-cases/messaging';
import {
  selectConversationParticipantsAreDeleted,
  selectNewMessage,
} from 'src/use-cases/messaging/messaging.selectors';
import {
  MessagingConversationContainer,
  MessagingInput,
  MessagingInputContainer,
  MessagingMessageForm,
  MessagingMessagesContainer,
} from './MessagingConversation.styles';
import { MessagingConversationHeader } from './MessagingConversationHeader/MessagingConversationHeader';
import { MessagingMessage } from './MessagingMessage/MessagingMessage';
import { MessagingPinnedInfo } from './MessagingPinnedInfo/MessagingPinnedInfo';
import { MessagingSuggestions } from './MessagingSuggestions/MessagingSuggestions';

export const MessagingConversation = () => {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const currentUser = useSelector(selectCurrentUser);
  const currentUserId = useSelector(selectCurrentUserId);
  const selectedConversationId = useSelector(selectSelectedConversationId);
  const selectedConversation = useSelector(selectSelectedConversation);
  const conversationParticipantsAreDeleted = useSelector(
    selectConversationParticipantsAreDeleted
  );
  const pinnedInfo = useSelector(selectPinnedInfo);
  const newMessage = useSelector(selectNewMessage);
  const [scrollBehavior, setScrollBehavior] = useState<ScrollBehavior>(
    'instant' as ScrollBehavior
  );
  const displaySuggestions = useMemo(() => {
    return (
      selectedConversationId === 'new' &&
      currentUser &&
      currentUser.role === USER_ROLES.CANDIDATE
    );
  }, [currentUser, selectedConversationId]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  function adjustMessageHeight() {
    if (!messageInputRef.current) {
      return;
    }
    messageInputRef.current.style.height = 'inherit';
    messageInputRef.current.style.height = `${messageInputRef.current.scrollHeight}px`;
  }

  useLayoutEffect(adjustMessageHeight, []);

  useEffect(() => {
    setScrollBehavior('instant' as ScrollBehavior);
  }, [selectedConversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: scrollBehavior });
    setTimeout(() => {
      setScrollBehavior('smooth' as ScrollBehavior);
    }, 1000);
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
    adjustMessageHeight();
  };

  useEffect(() => {
    // Set a pinned info when the conversation is one to one and the other participant is not available
    const addressees = selectedConversation?.participants.filter(
      (participant) => participant.id !== currentUserId
    );
    const addresseesAreUnavailable = addressees?.some(
      (addressee) => addressee.userProfile?.isAvailable === false
    );
    if (addresseesAreUnavailable) {
      dispatch(messagingActions.setPinnedInfo('ADDRESSEE_UNAVAILABLE'));
    } else if (conversationParticipantsAreDeleted) {
      dispatch(messagingActions.setPinnedInfo('ADDRESSEE_DELETED'));
    } else {
      dispatch(messagingActions.setPinnedInfo(null));
    }
  }, [
    conversationParticipantsAreDeleted,
    currentUserId,
    dispatch,
    selectedConversation,
  ]);

  useEffect(() => {
    if (selectedConversationId && selectedConversationId !== 'new') {
      dispatch(messagingActions.getSelectedConversationRequested());
    }
  }, [dispatch, selectedConversationId]);

  /**
   * Refresh the selected conversation every DELAY_REFRESH_CONVERSATIONS ms
   */
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedConversationId && selectedConversationId !== 'new') {
        dispatch(messagingActions.getSelectedConversationRequested());
      }
      dispatch(messagingActions.getConversationsRequested());
    }, DELAY_REFRESH_CONVERSATIONS);

    return () => clearInterval(interval);
  }, [dispatch, selectedConversationId]);

  useEffect(() => {
    adjustMessageHeight();
  }, [newMessage]);

  useEffect(() => {
    if (selectedConversation && selectedConversation.messages) {
      scrollToBottom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation?.id, selectedConversation?.messages.length]);

  return (
    <MessagingConversationContainer className={isMobile ? 'mobile' : ''}>
      {!selectedConversationId ? (
        <MessagingEmptyState title="Cliquer sur une conversation pour la lire" />
      ) : (
        <>
          <MessagingConversationHeader />
          {pinnedInfo && <MessagingPinnedInfo pinnedInfo={pinnedInfo} />}

          {displaySuggestions ? (
            <MessagingSuggestions />
          ) : (
            <MessagingMessagesContainer className={isMobile ? 'mobile' : ''}>
              {selectedConversation &&
                selectedConversation.messages &&
                selectedConversation.messages.map((message) => (
                  <MessagingMessage key={message.id} message={message} />
                ))}
              <div ref={messagesEndRef} />
            </MessagingMessagesContainer>
          )}

          {/* Bloc de rédaction d'un message */}
          <MessagingMessageForm className={isMobile ? 'mobile' : ''}>
            <MessagingInputContainer>
              <MessagingInput
                rows={1}
                ref={messageInputRef}
                placeholder="Ecrivez votre message"
                value={newMessage}
                onChange={(e) => {
                  dispatch(messagingActions.setNewMessage(e.target.value));
                }}
                disabled={conversationParticipantsAreDeleted}
              />
            </MessagingInputContainer>
            {isMobile ? (
              <Button
                style="custom-secondary-inverted"
                onClick={sendNewMessage}
                disabled={conversationParticipantsAreDeleted}
                rounded
              >
                <LucidIcon name="Send" size={25} />
              </Button>
            ) : (
              <Button
                onClick={sendNewMessage}
                disabled={conversationParticipantsAreDeleted}
              >
                Envoyer
              </Button>
            )}
          </MessagingMessageForm>
        </>
      )}
    </MessagingConversationContainer>
  );
};
