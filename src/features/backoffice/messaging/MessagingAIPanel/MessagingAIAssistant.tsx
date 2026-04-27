import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'src/components/ui/Button/Button';
import { ButtonIcon } from 'src/components/ui/Button/ButtonIcon';
import { LucidIcon } from 'src/components/ui/Icons/LucidIcon';
import { selectSelectedConversationId } from 'src/use-cases/messaging';
import {
  AIChatInputContainer,
  AIChatInputTextarea,
  AIChatInputWrapper,
  AIEmptyState,
  AILoadingIndicator,
  AIMessageBubble,
  AIMessagesContainer,
  AIQuickActionsContainer,
  AIQuickActionsGrid,
  AIQuickActionsLabel,
} from './MessagingAIPanel.styles';

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

type AIQuickActionId = 'interview' | 'cv' | 'reengage' | 'sector';

const QUICK_ACTIONS: {
  id: AIQuickActionId;
  label: string;
  icon: string;
  prompt: string;
}[] = [
  {
    id: 'interview',
    label: 'Preparer un entretien',
    icon: 'ClipboardList',
    prompt:
      'Aide-moi a preparer un entretien pour ce candidat. Quelles questions sont probablement posees ?',
  },
  {
    id: 'cv',
    label: 'Conseils CV',
    icon: 'FileText',
    prompt:
      'Quels conseils me donnes-tu pour ameliorer le CV de ce candidat en fonction de son secteur vise ?',
  },
  {
    id: 'reengage',
    label: 'Relancer le candidat',
    icon: 'MessageCircle',
    prompt:
      'Ce candidat semble decourage. Propose-moi un message bienveillant pour le relancer.',
  },
  {
    id: 'sector',
    label: 'Comprendre le secteur',
    icon: 'BookOpen',
    prompt:
      'Fais-moi un brief sur le secteur vise par ce candidat : metiers, attentes recruteurs, vocabulaire cle.',
  },
];

const MOCK_RESPONSE =
  "Fonctionnalite en cours de developpement — la connexion a l'IA sera disponible prochainement.";

export const MessagingAIAssistant = () => {
  const selectedConversationId = useSelector(selectSelectedConversationId);

  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

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
    setMessages([]);
    setIsLoading(false);
    setInputValue('');
  }, [selectedConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    adjustInputHeight();
  }, [inputValue]);

  useLayoutEffect(adjustInputHeight, []);

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim() || isLoading) {
        return;
      }

      const userMessage: AIMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: content.trim(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setInputValue('');

      setTimeout(() => {
        const assistantMessage: AIMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: MOCK_RESPONSE,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
    },
    [isLoading]
  );

  const onQuickAction = useCallback(
    (action: (typeof QUICK_ACTIONS)[number]) => {
      sendMessage(action.prompt);
    },
    [sendMessage]
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

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
        {messages.map((message) => (
          <AIMessageBubble key={message.id} role={message.role}>
            {message.content}
          </AIMessageBubble>
        ))}
        {isLoading && (
          <AILoadingIndicator>
            <span />
            <span />
            <span />
          </AILoadingIndicator>
        )}
        <div ref={messagesEndRef} />
      </AIMessagesContainer>

      <AIQuickActionsContainer>
        <AIQuickActionsLabel>Suggestions rapides</AIQuickActionsLabel>
        <AIQuickActionsGrid>
          {QUICK_ACTIONS.map((action) => (
            <Button
              key={action.id}
              variant="secondary"
              size="small"
              onClick={() => onQuickAction(action)}
              disabled={isLoading}
              prependIcon={<LucidIcon name={action.icon as any} size={13} />}
            >
              {action.label}
            </Button>
          ))}
        </AIQuickActionsGrid>
      </AIQuickActionsContainer>

      <AIChatInputContainer>
        <AIChatInputWrapper>
          <AIChatInputTextarea
            ref={inputRef}
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Posez une question..."
            disabled={isLoading}
          />
        </AIChatInputWrapper>
        <ButtonIcon
          icon={<LucidIcon name="Send" size={18} />}
          onClick={() => sendMessage(inputValue)}
          disabled={!inputValue.trim() || isLoading}
        />
      </AIChatInputContainer>
    </>
  );
};
