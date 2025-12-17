import { UrlObject } from 'url';
import Link from 'next/link';
import React from 'react';
import { Color } from '@/src/constants/styles';
import { StyledEntityCard } from './EntityCard.styles';

type Url = string | UrlObject;

export interface EntityCardProps {
  borderColor?: Color;
  href: Url;
  onClick: () => void;
  children: React.ReactNode;
}

export const EntityCard = ({
  href,
  onClick,
  borderColor,
  children,
}: EntityCardProps) => {
  return (
    <Link href={href} onClick={onClick}>
      <StyledEntityCard borderColor={borderColor}>{children}</StyledEntityCard>
    </Link>
  );
};
