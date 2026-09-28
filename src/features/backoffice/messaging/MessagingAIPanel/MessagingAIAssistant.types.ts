import { AiAssistantMessage } from '@/src/api/types';

export type AIQuickActionId =
  'reengage' | 'summarize' | 'sector' | 'start_discussion' | 'suggest_response';

export type AIQuickAction = {
  id: AIQuickActionId;
  label: string;
  icon: string;
  prompt: string;
};

export type EscalationState = { referentUserId: string; referentName: string };

// Why an assistant answer ended abnormally. Local UI state only: not persisted,
// so it is lost when the session is reloaded.
export type AiMessageStatus = 'truncated' | 'interrupted';

export type LocalAiMessage = AiAssistantMessage & {
  suggestions?: string[];
  status?: AiMessageStatus;
};
