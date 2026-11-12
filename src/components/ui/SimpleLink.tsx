import Link from 'next/link';
import React from 'react';
import { AnyCantFix } from '@/src/utils/Types';

interface SimpleLinkProps {
  href?:
    | string
    | {
        pathname: string;
        query?: AnyCantFix; // query can be an object with any key-value
      };
  children: React.ReactNode;
  className?: string;
  target?: string;
  // Defaults to `noopener` when `target` is set
  rel?: string;
  isExternal?: boolean;
  scroll?: boolean;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  shallow?: boolean;
}

export const SimpleLink = ({
  href,
  children,
  className,
  target,
  rel,
  scroll,
  isExternal,
  shallow,
  onClick,
}: SimpleLinkProps) => {
  const linkRel = rel ?? (target ? 'noopener' : '');
  return isExternal || !href ? (
    <a
      onClick={onClick}
      href={typeof href === 'string' ? href : href?.pathname}
      target={target ? '_blank' : ''}
      className={className}
      rel={linkRel}
    >
      {children}
    </a>
  ) : (
    <Link
      scroll={scroll}
      href={href}
      shallow={shallow}
      onClick={onClick}
      target={target}
      className={className}
      rel={linkRel}
    >
      {children}
    </Link>
  );
};
