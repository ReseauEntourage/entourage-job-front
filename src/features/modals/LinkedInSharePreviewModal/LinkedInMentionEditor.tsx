import React, { useCallback, useEffect, useRef } from 'react';
import {
  StyledEditor,
  StyledEditorWrapper,
} from './LinkedInMentionEditor.styles';

interface LinkedInMentionEditorProps {
  initialText: string;
  onChange: (text: string) => void;
}

const MENTION_REGEX = /(@\[[^\]]+\]\([^)]+\))/g;

type Segment =
  | { type: 'text'; content: string }
  | { type: 'mention'; raw: string; label: string };

function parseSegments(text: string): Segment[] {
  return text.split(MENTION_REGEX).map((part) => {
    const match = part.match(/^@\[([^\]]+)\]\(([^)]+)\)$/);
    if (match) {
      return { type: 'mention', raw: part, label: match[1] };
    }
    return { type: 'text', content: part };
  });
}

function serializeNode(node: ChildNode): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? '';
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as HTMLElement;
    if (el.tagName === 'BR') {
      return '\n';
    }
    if (el.dataset.raw) {
      return el.dataset.raw;
    }
    // Fallback for any browser-inserted block elements (div on Enter)
    return Array.from(el.childNodes).map(serializeNode).join('');
  }
  return '';
}

export const LinkedInMentionEditor = ({
  initialText,
  onChange,
}: LinkedInMentionEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);
  const initialized = useRef(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const serializeContent = useCallback(() => {
    if (!editorRef.current) {
      return;
    }
    const text = Array.from(editorRef.current.childNodes)
      .map(serializeNode)
      .join('');
    onChangeRef.current(text);
  }, []);

  useEffect(() => {
    if (!editorRef.current || initialized.current) {
      return;
    }
    initialized.current = true;

    const editor = editorRef.current;
    const segments = parseSegments(initialText);

    segments.forEach((segment) => {
      if (segment.type === 'text') {
        const lines = segment.content.split('\n');
        lines.forEach((line, i) => {
          editor.appendChild(document.createTextNode(line));
          if (i < lines.length - 1) {
            editor.appendChild(document.createElement('br'));
          }
        });
      } else {
        const span = document.createElement('span');
        span.contentEditable = 'false';
        span.dataset.raw = segment.raw;
        span.className = 'mention-badge';
        span.appendChild(document.createTextNode(segment.label));

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = '×';
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          span.remove();
          serializeContent();
        });
        span.appendChild(btn);
        editor.appendChild(span);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const sel = window.getSelection();

      if (e.key === 'Enter') {
        e.preventDefault();
        if (!sel?.rangeCount) {
          return;
        }
        const range = sel.getRangeAt(0);
        range.deleteContents();
        const br = document.createElement('br');
        range.insertNode(br);
        range.setStartAfter(br);
        range.setEndAfter(br);
        sel.removeAllRanges();
        sel.addRange(range);
        serializeContent();
        return;
      }

      if ((e.key === 'Backspace' || e.key === 'Delete') && sel?.rangeCount) {
        const range = sel.getRangeAt(0);
        if (!range.collapsed) {
          return;
        }

        const { startContainer, startOffset } = range;
        const editor = editorRef.current;

        if (e.key === 'Backspace') {
          let badge: HTMLElement | null = null;
          if (startContainer.nodeType === Node.TEXT_NODE && startOffset === 0) {
            const prev = startContainer.previousSibling as HTMLElement;
            if (prev?.dataset?.raw !== undefined) {
              badge = prev;
            }
          } else if (startContainer === editor) {
            const prev = editor?.childNodes[startOffset - 1] as HTMLElement;
            if (prev?.dataset?.raw !== undefined) {
              badge = prev;
            }
          }
          if (badge) {
            e.preventDefault();
            badge.remove();
            serializeContent();
          }
        }

        if (e.key === 'Delete') {
          let badge: HTMLElement | null = null;
          if (
            startContainer.nodeType === Node.TEXT_NODE &&
            startOffset === (startContainer.textContent?.length ?? 0)
          ) {
            const next = startContainer.nextSibling as HTMLElement;
            if (next?.dataset?.raw !== undefined) {
              badge = next;
            }
          } else if (startContainer === editor) {
            const next = editor?.childNodes[startOffset] as HTMLElement;
            if (next?.dataset?.raw !== undefined) {
              badge = next;
            }
          }
          if (badge) {
            e.preventDefault();
            badge.remove();
            serializeContent();
          }
        }
      }
    },
    [serializeContent]
  );

  return (
    <StyledEditorWrapper>
      <StyledEditor
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={serializeContent}
        onKeyDown={handleKeyDown}
        role="textbox"
        aria-multiline="true"
        aria-label="Texte du message LinkedIn"
      />
    </StyledEditorWrapper>
  );
};
