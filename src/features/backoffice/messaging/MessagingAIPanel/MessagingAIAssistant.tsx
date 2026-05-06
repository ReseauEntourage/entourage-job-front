import { useRouter } from 'next/router';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Api } from 'src/api';
import { AiAssistantMessage } from 'src/api/types';
import { Text } from 'src/components/ui';
import { Alert } from 'src/components/ui/Alert/Alert';
import { AlertVariant } from 'src/components/ui/Alert/Alert.types';
import { Button } from 'src/components/ui/Button/Button';
import { ButtonIcon } from 'src/components/ui/Button/ButtonIcon';
import { LucidIcon } from 'src/components/ui/Icons/LucidIcon';
import { TextArea } from 'src/components/ui/Inputs/TextArea';
import {
  messagingActions,
  selectSelectedConversation,
  selectSelectedConversationId,
} from 'src/use-cases/messaging';
import { AssistantMessageBubble } from './AssistantMessageBubble/AssistantMessageBubble';
import {
  QUICK_ACTIONS,
  getContextualQuickAction,
  processSSEStream,
} from './MessagingAIAssistant.utils';
import { EscalationState } from './MessagingAIAssitant.types';
import {
  AIChatInputContainer,
  AIChatInputWrapper,
  AIEmptyState,
  AIEscalateCard,
  AIEscalateCardActions,
  AILoadingIndicator,
  AIMessageBubble,
  AIMessagesContainer,
  AIQuickActionsContainer,
  AIQuickActionsGrid,
} from './MessagingAIPanel.styles';

export const MessagingAIAssistant = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedConversationId = useSelector(selectSelectedConversationId);
  const selectedConversation = useSelector(selectSelectedConversation);
  const hasConversationHistory =
    (selectedConversation?.messages?.length ?? 0) > 0;

  const [messages, setMessages] = useState<AiAssistantMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [escalation, setEscalation] = useState<EscalationState | null>(null);
  const [rateLimitRemaining, setRateLimitRemaining] = useState<number | null>(
    null
  );
  const [rateLimitResetAt, setRateLimitResetAt] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const adjustInputHeight = () => {
    if (!inputRef.current) {
      return;
    }
    inputRef.current.style.height = 'inherit';
    inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
  };

  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([]);
      setIsLoading(false);
      setInputValue('');
      return;
    }

    let cancelled = false;

    Api.getAISession(selectedConversationId)
      .then((res) => {
        if (!cancelled && res.data?.messages) {
          setMessages(res.data.messages);
        }
      })
      .catch(() => {
        // No session yet — start fresh
      });

    return () => {
      cancelled = true;
      setMessages([]);
      setIsLoading(false);
      setInputValue('');
      setEscalation(null);
    };
  }, [selectedConversationId]);

  useEffect(() => {
    if (!rateLimitResetAt) {
      return;
    }
    const delay = rateLimitResetAt - Date.now();
    if (delay <= 0) {
      setRateLimitResetAt(null);
      return undefined;
    }
    const timer = setTimeout(() => setRateLimitResetAt(null), delay);
    return () => clearTimeout(timer);
  }, [rateLimitResetAt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    adjustInputHeight();
  }, [inputValue]);

  useLayoutEffect(adjustInputHeight, []);

  const isRateLimited = rateLimitResetAt !== null;

  const sendMessage = useCallback(
    async (content: string) => {
      if (
        !content.trim() ||
        isLoading ||
        !selectedConversationId ||
        isRateLimited
      ) {
        return;
      }

      const assistantPlaceholderId = `assistant-${Date.now()}`;

      setMessages((prev) => [
        ...prev,
        { id: `user-${Date.now()}`, role: 'user', content: content.trim() },
        { id: assistantPlaceholderId, role: 'assistant', content: '' },
      ]);
      setIsLoading(true);
      setInputValue('');

      const updatePlaceholder = (updater: (prev: string) => string) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantPlaceholderId
              ? { ...m, content: updater(m.content) }
              : m
          )
        );
      };

      try {
        const response = await Api.streamAIMessage(
          selectedConversationId,
          content.trim()
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('ReadableStream non disponible.');
        }

        await processSSEStream(reader, {
          onContent: (chunk) => updatePlaceholder((prev) => prev + chunk),
          onEscalate: (state) => setEscalation(state),
          onError: (message) => updatePlaceholder(() => message),
          onRateLimitInfo: (remaining) => setRateLimitRemaining(remaining),
          onRateLimit: (resetInSeconds) => {
            setRateLimitResetAt(Date.now() + resetInSeconds * 1000);
            setRateLimitRemaining(0);
            updatePlaceholder(
              () =>
                `Limite horaire atteinte. Vous pourrez envoyer un nouveau message dans environ ${Math.ceil(
                  resetInSeconds / 60
                )} minute(s).`
            );
          },
        });
      } catch {
        updatePlaceholder(() => 'Une erreur est survenue. Veuillez réessayer.');
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, isRateLimited, selectedConversationId]
  );

  const onQuickAction = useCallback(
    (action: (typeof QUICK_ACTIONS)[number]) => {
      sendMessage(action.prompt);
    },
    [sendMessage]
  );

  const contextualAction = getContextualQuickAction(hasConversationHistory);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const onNewConversation = useCallback(async () => {
    if (!selectedConversationId || isLoading || messages.length === 0) {
      return;
    }
    try {
      await Api.resetAISession(selectedConversationId);
      setMessages([]);
      setEscalation(null);
    } catch {
      // Silent fail — conversation is cleared locally regardless
      setMessages([]);
      setEscalation(null);
    }
  }, [selectedConversationId, isLoading, messages.length]);

  const handleUseSuggestion = useCallback(
    (text: string) => {
      dispatch(messagingActions.setNewMessage(text));
    },
    [dispatch]
  );

  const contactReferent = useCallback(
    (referentUserId: string) => {
      router.push(`/backoffice/messaging?userId=${referentUserId}`);
    },
    [router]
  );

  const rateLimitMinutesLeft = rateLimitResetAt
    ? Math.ceil((rateLimitResetAt - Date.now()) / 60000)
    : null;

  return (
    <>
      <AIMessagesContainer>
        {messages.length === 0 && !isLoading && (
          <AIEmptyState>
            <LucidIcon name="Sparkles" size={32} />
            <p>
              Posez une question ou utilisez une suggestion rapide pour obtenir
              de l&apos;aide.
            </p>
          </AIEmptyState>
        )}
        {messages.map((message) =>
          message.role === 'assistant' ? (
            <AssistantMessageBubble
              key={message.id}
              content={message.content}
              onUseSuggestion={handleUseSuggestion}
            />
          ) : (
            <AIMessageBubble key={message.id} role="user">
              {message.content}
            </AIMessageBubble>
          )
        )}
        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <AILoadingIndicator>
            <span />
            <span />
            <span />
          </AILoadingIndicator>
        )}
        <div ref={messagesEndRef} />
      </AIMessagesContainer>

      {escalation && (
        <AIEscalateCard>
          <Text>
            <LucidIcon name="BadgeAlert" size={14} /> Cette situation peut
            nécessiter l&apos;intervention de{' '}
            <strong>{escalation.referentName}</strong>, référent Entourage Pro
          </Text>
          <AIEscalateCardActions>
            <Button
              variant="primary"
              size="small"
              onClick={() => contactReferent(escalation.referentUserId)}
            >
              Contacter le référent
            </Button>
          </AIEscalateCardActions>
        </AIEscalateCard>
      )}

      {isRateLimited && (
        <Alert
          variant={AlertVariant.Error}
          icon={<LucidIcon name="Clock" size={14} />}
          rounded
        >
          Limite horaire atteinte (10 messages/heure). Réessayez dans environ{' '}
          {rateLimitMinutesLeft} minute{rateLimitMinutesLeft !== 1 ? 's' : ''}.
        </Alert>
      )}

      {!isRateLimited &&
        rateLimitRemaining !== null &&
        rateLimitRemaining <= 2 && (
          <Alert
            variant={AlertVariant.Warning}
            icon={<LucidIcon name="TriangleAlert" size={14} />}
            rounded
          >
            {rateLimitRemaining === 0 ? (
              <Text>Vous avez atteint la limite horaire.</Text>
            ) : (
              <Text>
                <strong>
                  {rateLimitRemaining} message
                  {rateLimitRemaining !== 1 ? 's' : ''}
                </strong>{' '}
                restant{rateLimitRemaining === 0 ? 's' : ''} avant
                d&apos;atteindre la limite horaire.
              </Text>
            )}
          </Alert>
        )}

      <AIQuickActionsContainer>
        <Text size="small" weight="semibold" uppercase color="mediumGray">
          Suggestions rapides
        </Text>

        <AIQuickActionsGrid>
          <Button
            key={contextualAction.id}
            variant="secondary"
            size="small"
            onClick={() => onQuickAction(contextualAction)}
            disabled={isLoading || isRateLimited}
            prependIcon={
              <LucidIcon name={contextualAction.icon as any} size={13} />
            }
          >
            {contextualAction.label}
          </Button>
          {QUICK_ACTIONS.map((action) => (
            <Button
              key={action.id}
              variant="secondary"
              size="small"
              onClick={() => onQuickAction(action)}
              disabled={isLoading || isRateLimited}
              prependIcon={<LucidIcon name={action.icon as any} size={13} />}
            >
              {action.label}
            </Button>
          ))}
        </AIQuickActionsGrid>
      </AIQuickActionsContainer>

      <AIChatInputContainer>
        <AIChatInputWrapper>
          <TextArea
            id="ai-chat-input"
            name="ai-chat-input"
            value={inputValue}
            onChange={setInputValue}
            onKeyDown={onKeyDown}
            placeholder={
              isRateLimited
                ? 'Limite horaire atteinte...'
                : 'Posez une question...'
            }
            disabled={isLoading || isRateLimited}
            rows={1}
            inputRef={(el) => {
              inputRef.current = el;
            }}
            naked
          />
        </AIChatInputWrapper>
        <ButtonIcon
          icon={<LucidIcon name="RotateCcw" size={16} />}
          onClick={onNewConversation}
          disabled={isLoading || messages.length === 0}
        />
        <ButtonIcon
          icon={<LucidIcon name="Send" size={18} />}
          onClick={() => sendMessage(inputValue)}
          disabled={!inputValue.trim() || isLoading || isRateLimited}
        />
      </AIChatInputContainer>
      <Text size="small" color="mediumGray" center>
        L&apos;IA peut faire des erreurs. Vérifiez toujours les informations
        proposées.
      </Text>
    </>
  );
};
