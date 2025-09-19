import { UrlObject } from 'url';
import Link from 'next/link';
import React from 'react';
import { StyledEntityCard } from './EntityCard.styles';

type Url = string | UrlObject;

export interface EntityCardProps {
  href: Url;
  newTab: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export const EntityCard = ({
  href,
  newTab,
  onClick,
  children,
}: EntityCardProps) => {
  return (
    <Link
      href={href}
      passHref
      onClick={onClick}
      target={newTab ? '_blank' : undefined}
    >
      <StyledEntityCard>{children}</StyledEntityCard>
    </Link>
  );
};
