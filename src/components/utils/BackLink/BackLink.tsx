import Link from 'next/link';
import React from 'react';
import ChevronLeftIcon from 'assets/custom/icons/chevron-left.svg';
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
    <Link href={url} scroll={false} shallow passHref>
      <StyledBackLink>
        <ChevronLeftIcon viewBox="0 0 320 512" />
        &nbsp;{label}
      </StyledBackLink>
    </Link>
  );
}
