import * as DOMPurify from 'dompurify';
import { marked } from 'marked';
import { useMemo } from 'react';
import { useIsDesktop } from '@/src/hooks/utils';
import { AIMarkdownContent, AIMessageBubble } from '../MessagingAIPanel.styles';
import { Button } from 'src/components/ui/Button/Button';
import { LucidIcon } from 'src/components/ui/Icons/LucidIcon';

type ContentSegment =
  | { type: 'text'; content: string }
  | { type: 'suggestion'; content: string };

function parseSegments(content: string): ContentSegment[] {
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

  // Remaining text — stop before any incomplete [SUGGESTION] block
  const remaining = content.slice(lastIndex);
  const incompleteIdx = remaining.indexOf('[SUGGESTION]');
  const textEnd = (
    incompleteIdx === -1 ? remaining : remaining.slice(0, incompleteIdx)
  ).trim();
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
    const raw = marked.parse(content, { async: false }) as string;
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
  onUseSuggestion?: (text: string) => void;
}

export const AssistantMessageBubble = ({
  content,
  onUseSuggestion,
}: AssistantMessageBubbleProps) => {
  const segments = useMemo(() => parseSegments(content), [content]);

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
    </AIMessageBubble>
  );
};
