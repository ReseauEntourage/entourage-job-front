import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { MessagingAIPanel } from '../MessagingAIPanel';
import { MessagingEmptyState } from '../MessagingEmptyState';
import { DELAY_REFRESH_CONVERSATIONS } from 'src/constants';
import { UserRoles } from 'src/constants/users';
import { useIsMobile } from 'src/hooks/utils';
import {
  selectCurrentUser,
  selectCurrentUserId,
} from 'src/use-cases/current-user';
import {
  messagingActions,
  selectIsAIPanelOpen,
  selectSelectedConversation,
  selectSelectedConversationId,
  selectPinnedInfo,
} from 'src/use-cases/messaging';
import {
  selectConversationParticipantsAreDeleted,
  selectCurrentUserHasSentMessages,
  selectNewMessage,
  selectShouldGiveFeedback,
} from 'src/use-cases/messaging/messaging.selectors';
import type { MessagingPanelView } from 'src/use-cases/messaging/messaging.slice';
import {
  MessagingConversationAIPanel,
  MessagingConversationContainer,
  MessagingConversationWrapper,
  MessagingMessagesContainer,
  MessagingPanelSidebarContainer,
  PanelSidebarButton,
  PanelSidebarLabel,
} from './MessagingConversation.styles';
import { MessagingConversationHeader } from './MessagingConversationHeader/MessagingConversationHeader';
import { MessagingEditor } from './MessagingEditor/MessagingEditor';
import { MessagingFeedback } from './MessagingFeedback/MessagingFeedback';
import { MessagingFirstContactBanner } from './MessagingFirstContact/MessagingFirstContactBanner';
import { MessagingMessage } from './MessagingMessage/MessagingMessage';
import { MessagingPinnedInfo } from './MessagingPinnedInfo/MessagingPinnedInfo';
import { MessagingSuggestions } from './MessagingSuggestions/MessagingSuggestions';
import { MessagingSuggestionItem } from './MessagingSuggestions/MessagingSuggestions.types';

interface PanelOption {
  view: MessagingPanelView;
  label: string;
  icon: string;
}

const PANEL_OPTIONS: PanelOption[] = [
  { view: 'ai', label: 'Assistant IA', icon: 'Sparkles' },
];

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
  const currentUserHasSentMessages = useSelector(
    selectCurrentUserHasSentMessages(currentUserId)
  );
  const isAIPanelOpen = useSelector(selectIsAIPanelOpen);

  const shouldGiveFeedback = useSelector(selectShouldGiveFeedback);
  const [scrollBehavior, setScrollBehavior] = useState<ScrollBehavior>(
    'instant' as ScrollBehavior
  );
  const displaySuggestions = useMemo(() => {
    return selectedConversationId === 'new' && currentUser;
  }, [currentUser, selectedConversationId]);

  const displayCoachQuickReplies = useMemo(() => {
    if (!currentUser || currentUser.role !== UserRoles.COACH) {
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
    if (!otherParticipants.every((p) => p.role === UserRoles.CANDIDATE)) {
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

  const conversationHasCandidate =
    selectedConversation?.participants.some(
      (p) => p.role === UserRoles.CANDIDATE
    ) ?? false;
  const canUseAIAssistant =
    currentUser?.role !== UserRoles.CANDIDATE && conversationHasCandidate;
  const isNewConversation = selectedConversationId === 'new';
  const showAIPanelMobile =
    isMobile && canUseAIAssistant && isAIPanelOpen && !isNewConversation;
  const showPanelSidebar =
    !isMobile &&
    canUseAIAssistant &&
    !!selectedConversationId &&
    !isAIPanelOpen &&
    !isNewConversation;

  const onOpenPanel = (view: MessagingPanelView) => {
    dispatch(messagingActions.setActivePanelView(view));
  };

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

      {displayCoachQuickReplies && (
        <MessagingSuggestions
          onSuggestionClick={onSuggestionClick}
          newMessage={newMessage}
          participants={
            selectedConversation?.participants.filter(
              (p) => p.id !== currentUserId
            ) || []
          }
          variant="coach-quick-replies"
        />
      )}

      <MessagingEditor readonly={conversationParticipantsAreDeleted} />
    </>
  );

  if (!selectedConversationId) {
    return (
      <MessagingConversationContainer className={isMobile ? 'mobile' : ''}>
        <MessagingEmptyState title="Cliquer sur une conversation pour la lire" />
      </MessagingConversationContainer>
    );
  }

  if (showAIPanelMobile) {
    return <MessagingAIPanel />;
  }

  return (
    <MessagingConversationWrapper>
      <MessagingConversationContainer className={isMobile ? 'mobile' : ''}>
        {conversationContent}
      </MessagingConversationContainer>
      {showPanelSidebar && (
        <MessagingPanelSidebarContainer>
          {PANEL_OPTIONS.map((option) => (
            <PanelSidebarButton
              key={option.view}
              onClick={() => onOpenPanel(option.view)}
            >
              <LucidIcon name={option.icon as any} size={18} />
              <PanelSidebarLabel>{option.label}</PanelSidebarLabel>
            </PanelSidebarButton>
          ))}
        </MessagingPanelSidebarContainer>
      )}
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
