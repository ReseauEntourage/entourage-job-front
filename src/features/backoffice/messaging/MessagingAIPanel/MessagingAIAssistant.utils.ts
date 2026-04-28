import { AIQuickAction, EscalationState } from './MessagingAIAssitant.types';

type SSEStreamCallbacks = {
  onContent: (chunk: string) => void;
  onEscalate: (escalation: EscalationState) => void;
  onError: (message: string) => void;
  onSuggest?: (suggestions: string[]) => void;
  onRateLimitInfo?: (remaining: number) => void;
  onRateLimit?: (resetInSeconds: number) => void;
};

export async function processSSEStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  callbacks: SSEStreamCallbacks
): Promise<void> {
  const decoder = new TextDecoder();
  let buffer = '';

  const processLine = (line: string): boolean => {
    if (!line.startsWith('data: ')) {
      return false;
    }
    const payload = line.slice(6).trim();

    if (payload === '[DONE]') {
      return true;
    }

    try {
      const parsed = JSON.parse(payload) as {
        type?: string;
        referentUserId?: string;
        referentName?: string;
        content?: string;
        error?: string;
        suggestions?: string[];
        remaining?: number;
        resetInSeconds?: number;
      };

      if (parsed.type === 'rate_limit_info') {
        if (typeof parsed.remaining === 'number') {
          callbacks.onRateLimitInfo?.(parsed.remaining);
        }
        return false;
      }

      if (parsed.type === 'rate_limit') {
        if (typeof parsed.resetInSeconds === 'number') {
          callbacks.onRateLimit?.(parsed.resetInSeconds);
        }
        return true;
      }

      if (parsed.type === 'escalate') {
        if (parsed.referentUserId && parsed.referentName) {
          callbacks.onEscalate({
            referentUserId: parsed.referentUserId,
            referentName: parsed.referentName,
          });
        }
        return false;
      }

      if (parsed.type === 'suggest') {
        if (
          Array.isArray(parsed.suggestions) &&
          parsed.suggestions.length > 0
        ) {
          callbacks.onSuggest?.(parsed.suggestions);
        }
        return false;
      }

      if (parsed.error) {
        callbacks.onError(parsed.error);
        return true;
      }

      if (typeof parsed.content === 'string') {
        callbacks.onContent(parsed.content);
      }
    } catch {
      // Skip malformed SSE lines
    }
    return false;
  };

  while (true) {
    const { done, value } = await reader.read();

    buffer += done ? decoder.decode() : decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = done ? '' : lines.pop() ?? '';

    for (const line of lines) {
      if (processLine(line)) {
        return;
      }
    }

    if (done) {
      break;
    }
  }
}

const CONTEXTUAL_QUICK_ACTION_NO_HISTORY: AIQuickAction = {
  id: 'start_discussion',
  label: 'Démarrer la discussion',
  icon: 'MessageSquarePlus',
  prompt:
    "Je n'ai pas encore échangé avec ce candidat. Aide-moi à entrer en contact de façon bienveillante et à créer une première relation de confiance. Propose-moi un premier message à lui envoyer.",
};

const CONTEXTUAL_QUICK_ACTION_HAS_HISTORY: AIQuickAction = {
  id: 'suggest_response',
  label: 'Proposer une réponse',
  icon: 'Reply',
  prompt:
    "En t'appuyant sur le dernier message du candidat et son profil, propose-moi une réponse adaptée à lui envoyer.",
};

export function getContextualQuickAction(hasHistory: boolean): AIQuickAction {
  return hasHistory
    ? CONTEXTUAL_QUICK_ACTION_HAS_HISTORY
    : CONTEXTUAL_QUICK_ACTION_NO_HISTORY;
}

export const QUICK_ACTIONS: AIQuickAction[] = [
  {
    id: 'reengage',
    label: 'Relancer le candidat',
    icon: 'MessageCircle',
    prompt: 'Propose-moi un message bienveillant pour le relancer.',
  },
  {
    id: 'sector',
    label: 'Comprendre le secteur',
    icon: 'BookOpen',
    prompt:
      'Fais-moi un brief sur le secteur visé par ce candidat : métiers, attentes recruteurs, vocabulaire clé.',
  },
  {
    id: 'summarize',
    label: 'Résumer la conversation',
    icon: 'FileText',
    prompt:
      "Fais-moi un résumé de la conversation que j'ai eue avec ce candidat. Quels sont ses besoins, ses attentes, son état d'esprit ?",
  },
];
