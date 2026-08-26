import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ConversationType, FeatureKey } from '@/src/api/types';
import { Spinner } from '@/src/components/ui/Spinner';
import { DELAY_REFRESH_CONVERSATIONS } from '@/src/constants';
import { UserRoles } from '@/src/constants/users';
import { useIsMobile } from '@/src/hooks/utils';
import {
  selectCurrentUser,
  selectCurrentUserId,
  selectHasBetaFeature,
} from '@/src/use-cases/current-user';
import {
  messagingActions,
  selectIsAIPanelOpen,
  selectSelectedConversation,
  selectSelectedConversationId,
  selectPinnedInfo,
  useLoadOlderMessagesMutation,
  usePollConversationMessagesMutation,
} from '@/src/use-cases/messaging';
import {
  selectConversationParticipantsAreDeleted,
  selectCurrentUserHasSentMessages,
  selectNewMessage,
  selectOtherParticipantHasNotReplied,
  selectShouldGiveFeedback,
} from '@/src/use-cases/messaging/messaging.selectors';
import {
  encodeMessageCursor,
  MESSAGES_PAGE_SIZE,
} from '@/src/use-cases/messaging/messaging.utils';
import { MessagingAIPanel } from '../MessagingAIPanel';
import { MessagingEmptyState } from '../MessagingEmptyState';
import {
  MessagingConversationAIPanel,
  MessagingConversationContainer,
  MessagingConversationWrapper,
  MessagingMessagesContainer,
  MessagingOlderMessagesLoader,
} from './MessagingConversation.styles';
import { MessagingConversationHeader } from './MessagingConversationHeader/MessagingConversationHeader';
import { MessagingEditor } from './MessagingEditor/MessagingEditor';
import { MessagingFeedback } from './MessagingFeedback/MessagingFeedback';
import { MessagingFirstContactBanner } from './MessagingFirstContact/MessagingFirstContactBanner';
import { MessagingMessage } from './MessagingMessage/MessagingMessage';
import { MessagingPinnedInfo } from './MessagingPinnedInfo/MessagingPinnedInfo';
import { MessagingSuggestions } from './MessagingSuggestions/MessagingSuggestions';
import { MessagingSuggestionItem } from './MessagingSuggestions/MessagingSuggestions.types';
import { MessagingWaitingReplyBanner } from './MessagingWaitingReplyBanner/MessagingWaitingReplyBanner';

export const MessagingConversation = () => {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const currentUser = useSelector(selectCurrentUser);
  const currentUserId = useSelector(selectCurrentUserId);
  const hasMessagingAIAssistant = useSelector(
    selectHasBetaFeature(FeatureKey.MESSAGING_AI_ASSISTANT)
  );
  const selectedConversationId = useSelector(selectSelectedConversationId);
  const selectedConversation = useSelector(selectSelectedConversation);
  const newMessage = useSelector(selectNewMessage);
  const conversationParticipantsAreDeleted = useSelector(
    selectConversationParticipantsAreDeleted
  );
  const pinnedInfo = useSelector(selectPinnedInfo);
  const currentUserHasSentMessages = useSelector(
    selectCurrentUserHasSentMessages(currentUserId)
  );
  const otherParticipantHasNotReplied = useSelector(
    selectOtherParticipantHasNotReplied(currentUserId)
  );
  const isAIPanelOpen = useSelector(selectIsAIPanelOpen);

  const shouldGiveFeedback = useSelector(selectShouldGiveFeedback);
  const [scrollBehavior, setScrollBehavior] = useState<ScrollBehavior>(
    'instant' as ScrollBehavior
  );
  const [loadOlderMessages, { isLoading: isLoadingOlderMessages }] =
    useLoadOlderMessagesMutation();
  const [pollConversationMessages] = usePollConversationMessagesMutation();
  const [hasMoreOlderMessages, setHasMoreOlderMessages] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const previousNewestMessageIdRef = useRef<string | null>(null);
  const selectedConversationRef = useRef(selectedConversation);
  /**
   * While loading an older page, tracks the container's `scrollHeight` so
   * a `useLayoutEffect` below can compensate `scrollTop` by however much
   * it grew — first when the loader itself is inserted, then again when
   * it's replaced by the actual older messages — keeping whatever the
   * user was looking at in view instead of jumping around. `null` when
   * not currently preserving (i.e. not loading an older page).
   */
  const preservedScrollRef = useRef<{ scrollHeight: number } | null>(null);
  const displaySuggestions = useMemo(() => {
    return (
      selectedConversationId === 'new' &&
      !!currentUser &&
      currentUser.role !== UserRoles.ADMIN
    );
  }, [currentUser, selectedConversationId]);

  const displayQuickReplies = useMemo(() => {
    if (
      !currentUser ||
      (currentUser.role !== UserRoles.COACH &&
        currentUser.role !== UserRoles.CANDIDATE)
    ) {
      return false;
    }
    if (!selectedConversation || selectedConversationId === 'new') {
      return false;
    }
    if (selectedConversation.id !== selectedConversationId) {
      return false;
    }
    if (currentUserHasSentMessages) {
      return false;
    }
    const otherParticipants = selectedConversation.participants.filter(
      (p) => p.id !== currentUserId
    );
    const oppositeRole =
      currentUser.role === UserRoles.COACH
        ? UserRoles.CANDIDATE
        : UserRoles.COACH;
    if (!otherParticipants.every((p) => p.role === oppositeRole)) {
      return false;
    }
    return selectedConversation.messages.length > 0;
  }, [
    currentUser,
    currentUserId,
    selectedConversation,
    selectedConversationId,
    currentUserHasSentMessages,
  ]);

  const displayWaitingReplyBanner = useMemo(() => {
    if (!selectedConversation || selectedConversationId === 'new') {
      return false;
    }
    if (selectedConversation.id !== selectedConversationId) {
      return false;
    }
    if (conversationParticipantsAreDeleted) {
      return false;
    }
    if (selectedConversation.type !== ConversationType.DIRECT) {
      return false;
    }
    return otherParticipantHasNotReplied;
  }, [
    selectedConversation,
    selectedConversationId,
    conversationParticipantsAreDeleted,
    otherParticipantHasNotReplied,
  ]);
  const displayFirstContactBanner = useMemo(() => {
    if (!currentUser) {
      return false;
    }
    if (
      currentUser.role !== UserRoles.COACH &&
      currentUser.role !== UserRoles.CANDIDATE
    ) {
      return false;
    }
    if (selectedConversationId === 'new') {
      return true;
    }
    if (
      !selectedConversation ||
      (selectedConversation as any).id !== selectedConversationId
    ) {
      return false;
    }
    if (
      selectedConversation.participants.some(
        (p) => p.id !== currentUserId && p.role === UserRoles.ADMIN
      )
    ) {
      return false;
    }

    return !currentUserHasSentMessages;
  }, [
    currentUser,
    selectedConversationId,
    selectedConversation,
    currentUserHasSentMessages,
    currentUserId,
  ]);

  const otherParticipant = useMemo(() => {
    return selectedConversation?.participants.find(
      (p) => p.id !== currentUserId
    );
  }, [selectedConversation, currentUserId]);

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

  const onSuggestionClick = (suggestion: MessagingSuggestionItem) => {
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
    const addressees = selectedConversation?.participants.filter(
      (participant) => participant.id !== currentUserId
    );
    const addresseesAreUnavailable = addressees?.some(
      (addressee) => !!addressee.userProfile?.unavailableAt
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
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  useEffect(() => {
    setHasMoreOlderMessages(true);
  }, [selectedConversationId]);

  /**
   * Guards against a spurious `scroll` event firing before we've
   * positioned the view for the conversation's *current* messages: this
   * container is reused across conversations, so switching to a shorter
   * conversation can leave a stale, too-large `scrollTop` that the
   * browser clamps down as soon as the new (shorter) content replaces
   * the old — a native reflow side effect, not the user scrolling up.
   * A fixed timer can't reliably outlast that (its length depends on
   * how long the conversation takes to fetch), so instead this is
   * cleared only once our own positioning effect below has actually run
   * for the current message set.
   */
  const hasPositionedScrollRef = useRef(false);
  useEffect(() => {
    hasPositionedScrollRef.current = false;
  }, [selectedConversationId]);

  useEffect(() => {
    if (selectedConversationId && selectedConversationId !== 'new') {
      dispatch(messagingActions.getSelectedConversationRequested());
      dispatch(messagingActions.markConversationSeenRequested());
    }
  }, [dispatch, selectedConversationId]);

  /**
   * Poll for new messages every DELAY_REFRESH_CONVERSATIONS ms, fetching
   * only the delta since the most recent message currently held (instead
   * of reloading the whole conversation), and mark it as seen whenever
   * that poll actually reports new messages.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const conversation = selectedConversationRef.current;
      const newestMessage = conversation?.messages[0];
      if (
        selectedConversationId &&
        selectedConversationId !== 'new' &&
        newestMessage
      ) {
        pollConversationMessages({
          conversationId: selectedConversationId,
          after: encodeMessageCursor(newestMessage),
        });
      }
      dispatch(messagingActions.getConversationsRequested());
    }, DELAY_REFRESH_CONVERSATIONS);

    return () => clearInterval(interval);
  }, [dispatch, selectedConversationId, pollConversationMessages]);

  const handleMessagesScroll = () => {
    const container = messagesContainerRef.current;
    const conversation = selectedConversation;
    const oldestMessage =
      conversation?.messages[conversation.messages.length - 1];
    if (
      !container ||
      !selectedConversationId ||
      selectedConversationId === 'new' ||
      !oldestMessage ||
      isLoadingOlderMessages ||
      !hasMoreOlderMessages ||
      !hasPositionedScrollRef.current ||
      container.scrollTop > 100
    ) {
      return;
    }
    // Arm the scroll-position compensation (see the `useLayoutEffect`
    // below) with the height *before* the loader — and later the older
    // messages — get prepended above the current view.
    preservedScrollRef.current = { scrollHeight: container.scrollHeight };
    loadOlderMessages({
      conversationId: selectedConversationId,
      before: encodeMessageCursor(oldestMessage),
    })
      .unwrap()
      .then((olderMessages) => {
        if (olderMessages.length < MESSAGES_PAGE_SIZE) {
          setHasMoreOlderMessages(false);
        }
      })
      .catch(() => {
        // Non-critical: the user can retry by scrolling up again
      });
  };

  // Applies the scroll-position compensation armed above: fires once when
  // the loader is inserted (isLoadingOlderMessages flips true), and again
  // once it's replaced by the actual older messages (isLoadingOlderMessages
  // flips back to false) — each time shifting scrollTop by however much
  // scrollHeight grew, so the previously-visible content stays in view.
  useLayoutEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || !preservedScrollRef.current) {
      return;
    }
    const delta =
      container.scrollHeight - preservedScrollRef.current.scrollHeight;
    if (delta !== 0) {
      container.scrollTop += delta;
    }
    if (isLoadingOlderMessages) {
      preservedScrollRef.current = { scrollHeight: container.scrollHeight };
    } else {
      preservedScrollRef.current = null;
    }
  }, [isLoadingOlderMessages, selectedConversation?.messages.length]);

  useEffect(() => {
    const newestMessageId = selectedConversation?.messages[0]?.id ?? null;
    if (
      selectedConversation &&
      newestMessageId &&
      newestMessageId !== previousNewestMessageIdRef.current
    ) {
      scrollToBottom();
    }
    previousNewestMessageIdRef.current = newestMessageId;
    if (selectedConversation) {
      hasPositionedScrollRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation?.id, selectedConversation?.messages[0]?.id]);

  const conversationHasCandidate =
    selectedConversation?.participants.some(
      (p) => p.role === UserRoles.CANDIDATE
    ) ?? false;
  const canUseAIAssistant =
    currentUser?.role !== UserRoles.CANDIDATE &&
    conversationHasCandidate &&
    hasMessagingAIAssistant;
  const isNewConversation = selectedConversationId === 'new';
  const showAIPanelMobile =
    isMobile && canUseAIAssistant && isAIPanelOpen && !isNewConversation;

  const conversationContent = (
    <>
      <MessagingConversationHeader />
      {pinnedInfo ? (
        <MessagingPinnedInfo pinnedInfo={pinnedInfo} />
      ) : (
        displayFirstContactBanner &&
        currentUser && (
          <MessagingFirstContactBanner
            key={selectedConversationId}
            role={currentUser.role as UserRoles}
          />
        )
      )}

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
          participants={selectedConversation?.participants || []}
        />
      ) : (
        <MessagingMessagesContainer
          ref={messagesContainerRef}
          onScroll={handleMessagesScroll}
          $blur={shouldGiveFeedback}
        >
          {isLoadingOlderMessages && (
            <MessagingOlderMessagesLoader>
              <Spinner size={20} />
            </MessagingOlderMessagesLoader>
          )}
          {reversedMessages &&
            reversedMessages.map((message) => (
              <MessagingMessage key={message.id} message={message} />
            ))}
          <div ref={messagesEndRef} />
        </MessagingMessagesContainer>
      )}

      {displayQuickReplies && (
        <MessagingSuggestions
          onSuggestionClick={onSuggestionClick}
          newMessage={newMessage}
          participants={
            selectedConversation?.participants.filter(
              (p) => p.id !== currentUserId
            ) || []
          }
          variant="quick-replies"
        />
      )}

      {displayWaitingReplyBanner && currentUser && otherParticipant && (
        <MessagingWaitingReplyBanner
          recipientFirstName={otherParticipant.firstName}
          recipientGender={otherParticipant.gender}
          currentUserRole={currentUser.role as UserRoles}
        />
      )}

      <MessagingEditor readonly={conversationParticipantsAreDeleted} />
    </>
  );

  if (!selectedConversationId) {
    return (
      <MessagingConversationContainer>
        <MessagingEmptyState title="Cliquer sur une conversation pour la lire" />
      </MessagingConversationContainer>
    );
  }

  if (showAIPanelMobile) {
    return <MessagingAIPanel />;
  }

  return (
    <MessagingConversationWrapper>
      <MessagingConversationContainer>
        {conversationContent}
      </MessagingConversationContainer>
      {!isMobile &&
        isAIPanelOpen &&
        canUseAIAssistant &&
        !isNewConversation && (
          <MessagingConversationAIPanel>
            <MessagingAIPanel />
          </MessagingConversationAIPanel>
        )}
    </MessagingConversationWrapper>
  );
};
