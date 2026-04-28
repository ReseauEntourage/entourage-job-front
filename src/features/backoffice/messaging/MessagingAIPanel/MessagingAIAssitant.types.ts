import { AiAssistantMessage } from 'src/api/types';

export type AIQuickActionId =
  | 'reengage'
  | 'summarize'
  | 'sector'
  | 'start_discussion'
  | 'suggest_response';

export type AIQuickAction = {
  id: AIQuickActionId;
  label: string;
  icon: string;
  prompt: string;
};

export type EscalationState = { referentUserId: string; referentName: string };

export type LocalAiMessage = AiAssistantMessage & {
  suggestions?: string[];
};
