import React from 'react';
import { linkifyToNodes } from '@/src/utils/Formatting';
import { StyledHelpGroupContent } from './HelpGroupContent.styles';

interface HelpGroupContentProps {
  content: string;
}

/**
 * Plain text with line breaks kept and web addresses as links. No markup
 * (HTML, Markdown) is ever interpreted.
 */
export function HelpGroupContent({ content }: HelpGroupContentProps) {
  return (
    <StyledHelpGroupContent>{linkifyToNodes(content)}</StyledHelpGroupContent>
  );
}
