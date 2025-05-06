import Link from 'next/link';
import React from 'react';
import { LucidIcon } from '../Icons/LucidIcon';
import { StyledBackLink } from './BackLink.styles';

interface BackLinkProps {
  url:
    | string
    | {
        pathname: string;
        query: { [p: string]: string | string[] };
      };
  label: string;
}
export function BackLink({ label, url }: BackLinkProps) {
  return (
    <Link href={url} scroll={false} shallow passHref legacyBehavior>
      <StyledBackLink>
        <LucidIcon name="ChevronLeft" />
        {label}
      </StyledBackLink>
    </Link>
  );
}
