import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { useMemo } from 'react';
import { Text } from '@/src/components/ui';
import { Button } from '@/src/components/ui/Button/Button';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { useIsDesktop } from '@/src/hooks/utils';
import { AiMessageStatus } from '../MessagingAIAssistant.types';
import { AIMarkdownContent, AIMessageBubble } from '../MessagingAIPanel.styles';

const SUGGESTION_OPEN_TAG = '[SUGGESTION]';

export const AI_MESSAGE_STATUS_NOTICES: Record<AiMessageStatus, string> = {
  truncated:
    'Réponse incomplète : elle a atteint la longueur maximale. Demandez la suite si besoin.',
  interrupted: 'Réponse interrompue. Réessayez si elle vous semble incomplète.',
};

type ContentSegment =
  { type: 'text'; content: string } | { type: 'suggestion'; content: string };

export function parseSegments(
  content: string,
  isStreaming = false
): ContentSegment[] {
  const segments: ContentSegment[] = [];
  const regex = /\[SUGGESTION\]([\s\S]*?)\[\/SUGGESTION\]/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    const textBefore = content.slice(lastIndex, match.index).trim();
    if (textBefore) {
      segments.push({ type: 'text', content: textBefore });
    }
    const suggestion = match[1].trim();
    if (suggestion) {
      segments.push({ type: 'suggestion', content: suggestion });
    }
    lastIndex = regex.lastIndex;
  }

  // Remaining text. While streaming, hide an unclosed [SUGGESTION] block until
  // its closing tag arrives. Once the answer is over, show that text as plain
  // text (tag stripped) rather than as a clickable suggestion, since it may
  // have been cut mid-message.
  let remaining = content.slice(lastIndex);
  const incompleteIdx = remaining.indexOf(SUGGESTION_OPEN_TAG);
  if (incompleteIdx !== -1) {
    const beforeTag = remaining.slice(0, incompleteIdx);
    const afterTag = remaining.slice(
      incompleteIdx + SUGGESTION_OPEN_TAG.length
    );
    remaining = isStreaming ? beforeTag : beforeTag + afterTag;
  }
  const textEnd = remaining.trim();
  if (textEnd) {
    segments.push({ type: 'text', content: textEnd });
  }

  return segments;
}

interface TextSegmentProps {
  content: string;
}

const TextSegment = ({ content }: TextSegmentProps) => {
  const isDesktop = useIsDesktop();
  const device = useMemo(() => (isDesktop ? 'desktop' : 'mobile'), [isDesktop]);

  const html = useMemo(() => {
    const raw = marked.parse(content) as string;
    return DOMPurify.sanitize(raw);
  }, [content]);

  return (
    <AIMarkdownContent
      $device={device}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

interface AssistantMessageBubbleProps {
  content: string;
  status?: AiMessageStatus;
  isStreaming?: boolean;
  onUseSuggestion?: (text: string) => void;
}

export const AssistantMessageBubble = ({
  content,
  status,
  isStreaming = false,
  onUseSuggestion,
}: AssistantMessageBubbleProps) => {
  const segments = useMemo(
    () => parseSegments(content, isStreaming),
    [content, isStreaming]
  );

  return (
    <AIMessageBubble role="assistant">
      {segments.map((segment, index) =>
        segment.type === 'text' ? (
          <TextSegment key={index} content={segment.content} />
        ) : (
          <Button
            key={index}
            variant="secondary"
            size="small"
            onClick={() => onUseSuggestion?.(segment.content)}
            appendIcon={<LucidIcon name="MessageSquareReply" size={18} />}
            align="left"
            rounded={false}
          >
            <span style={{ whiteSpace: 'pre-wrap' }}>{segment.content}</span>
          </Button>
        )
      )}
      {status && (
        <Text size="small" color="darkGray">
          {AI_MESSAGE_STATUS_NOTICES[status]}
        </Text>
      )}
    </AIMessageBubble>
  );
};
