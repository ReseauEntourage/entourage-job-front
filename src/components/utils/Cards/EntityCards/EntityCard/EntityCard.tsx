import { UrlObject } from 'url';
import Link from 'next/link';
import React from 'react';
import { StyledEntityCard } from './EntityCard.styles';

type Url = string | UrlObject;

export interface EntityCardProps {
  href: Url;
  onClick: () => void;
  children: React.ReactNode;
}

export const EntityCard = ({ href, onClick, children }: EntityCardProps) => {
  return (
    <Link href={href} passHref onClick={onClick}>
      <StyledEntityCard>{children}</StyledEntityCard>
    </Link>
  );
};
