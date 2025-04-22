import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessagingEmptyState } from '../MessagingEmptyState';
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
  selectShouldGiveFeedback,
} from 'src/use-cases/messaging/messaging.selectors';
import {
  MessagingConversationContainer,
  MessagingMessagesContainer,
} from './MessagingConversation.styles';
import { MessagingConversationHeader } from './MessagingConversationHeader/MessagingConversationHeader';
import { MessagingEditor } from './MessagingEditor/MessagingEditor';
import { MessagingFeedback } from './MessagingFeedback/MessagingFeedback';
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
  const newMessage = useSelector(selectNewMessage);
  const conversationParticipantsAreDeleted = useSelector(
    selectConversationParticipantsAreDeleted
  );
  const pinnedInfo = useSelector(selectPinnedInfo);

  const shouldGiveFeedback = useSelector(selectShouldGiveFeedback);
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

  const reversedMessages = useMemo(() => {
    if (!selectedConversation || !selectedConversation.messages) {
      return [];
    }
    return [...selectedConversation.messages].reverse();
  }, [selectedConversation]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setScrollBehavior('instant' as ScrollBehavior);
    dispatch(messagingActions.setNewMessage(''));
  }, [dispatch, selectedConversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: scrollBehavior });
    setTimeout(() => {
      setScrollBehavior('smooth' as ScrollBehavior);
    }, 1000);
  };

  const onSuggestionClick = (suggestion) => {
    dispatch(messagingActions.setNewMessage(suggestion.message));
  };

  const onRatingOrClose = (rating: number | null) => {
    const conversationParticipantId = selectedConversation?.participants.find(
      (participant) => participant.id === currentUserId
    )?.conversationParticipant.id;

    if (selectedConversationId && conversationParticipantId) {
      dispatch(
        messagingActions.postFeedbackRequested({
          conversationParticipantId,
          rating,
        })
      );
    }
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

          {shouldGiveFeedback && (
            <MessagingFeedback
              onRatingOrClose={onRatingOrClose}
              adressee={selectedConversation?.participants.find(
                (participant) => participant.id !== currentUserId
              )}
            />
          )}

          {displaySuggestions ? (
            <MessagingSuggestions
              onSuggestionClick={onSuggestionClick}
              newMessage={newMessage}
            />
          ) : (
            <MessagingMessagesContainer
              blur={shouldGiveFeedback}
              className={isMobile ? 'mobile' : ''}
            >
              {reversedMessages &&
                reversedMessages.map((message) => (
                  <MessagingMessage key={message.id} message={message} />
                ))}
              <div ref={messagesEndRef} />
            </MessagingMessagesContainer>
          )}
          <MessagingEditor readonly={conversationParticipantsAreDeleted} />
        </>
      )}
    </MessagingConversationContainer>
  );
};
