import React from 'react';
import { openModal } from '@/src/features/modals/Modal';
import { MessagingMessageSuspiciousModal } from '../MessagingMessageSuspiciousModal/MessagingMessageSuspiciousModal';

const URL_PATTERN =
  /(\b((https?:\/\/)?(www\.)?[\w-]+(\.[\w.-]+)+(:\d+)?(\/[^\s]*)?))/gi;

export type TextSegment =
  | { type: 'text'; value: string }
  | { type: 'link'; value: string; href: string };

// Only http(s) URLs become links: anything else stays plain text
export const toSafeHref = (url: string): string | null => {
  const normalizedUrl = /^https?:\/\//i.test(url) ? url : `http://${url}`;
  try {
    const parsedUrl = new URL(normalizedUrl);
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return null;
    }
    return parsedUrl.href;
  } catch {
    return null;
  }
};

export const splitTextAndLinks = (content: string): TextSegment[] => {
  const segments: TextSegment[] = [];
  let lastIndex = 0;

  for (const match of content.matchAll(URL_PATTERN)) {
    const url = match[0];
    const index = match.index ?? 0;
    const href = toSafeHref(url);
    if (!href) {
      continue;
    }
    if (index > lastIndex) {
      segments.push({ type: 'text', value: content.slice(lastIndex, index) });
    }
    segments.push({ type: 'link', value: url, href });
    lastIndex = index + url.length;
  }

  if (lastIndex < content.length) {
    segments.push({ type: 'text', value: content.slice(lastIndex) });
  }

  return segments;
};

const isVerifiedDomain = (href: string): boolean => {
  const whitelist =
    process.env.NEXT_PUBLIC_LINKIFY_SAFE_DOMAINS?.split(',') || [];
  const domainMatch = href.match(/https?:\/\/(www\.)?([\w.-]+)/i);
  const domain = domainMatch ? domainMatch[2] : '';
  return whitelist.some((whitelistedDomain) =>
    domain.endsWith(whitelistedDomain)
  );
};

interface LinkifiedTextProps {
  content: string;
  skipExternalLinkWarning?: boolean;
}

// Renders user content as React text nodes and links: nothing in the content
// is ever interpreted as HTML
export const LinkifiedText = ({
  content,
  skipExternalLinkWarning = false,
}: LinkifiedTextProps) => {
  const segments = React.useMemo(() => splitTextAndLinks(content), [content]);

  const handleLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!skipExternalLinkWarning && !isVerifiedDomain(href)) {
      event.preventDefault();
      openModal(<MessagingMessageSuspiciousModal href={href} />);
    }
  };

  return (
    <>
      {segments.map((segment, index) =>
        segment.type === 'link' ? (
          <a
            key={index}
            href={segment.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => handleLinkClick(event, segment.href)}
          >
            {segment.value}
          </a>
        ) : (
          <React.Fragment key={index}>{segment.value}</React.Fragment>
        )
      )}
    </>
  );
};
