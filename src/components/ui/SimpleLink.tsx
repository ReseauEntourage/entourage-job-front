import Link from 'next/link';
import React from 'react';
import { UIKIT_SCREENS } from '@/src/components/variables';
import { AnyCantFix } from '@/src/utils/Types';

interface SimpleLinkProps {
  href?:
    | string
    | {
        pathname: string;
        query?: AnyCantFix; // query can be an object with any key-value
      };
  visible?: UIKIT_SCREENS;
  children: React.ReactNode;
  className?: string;
  target?: string;
  // Defaults to `noopener` when `target` is set
  rel?: string;
  isExternal?: boolean;
  scroll?: boolean;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  toggle?: string;
  shallow?: boolean;
}

export const SimpleLink = ({
  visible,
  href,
  children,
  className,
  target,
  rel,
  scroll,
  isExternal,
  shallow,
  onClick,
  toggle,
}: SimpleLinkProps) => {
  const linkRel = rel ?? (target ? 'noopener' : '');
  let classBuffer = '';
  if (visible) {
    classBuffer += ` uk-visible@${visible}`;
  }
  if (className) {
    classBuffer += ` ${className}`;
  }

  if (toggle) {
    return (
      <a onClick={onClick} className={classBuffer} data-uk-toggle={toggle}>
        {children}
      </a>
    );
  }
  return isExternal || !href ? (
    <a
      onClick={onClick}
      href={typeof href === 'string' ? href : href?.pathname}
      target={target ? '_blank' : ''}
      className={classBuffer}
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
      className={classBuffer}
      rel={linkRel}
    >
      {children}
    </Link>
  );
};
