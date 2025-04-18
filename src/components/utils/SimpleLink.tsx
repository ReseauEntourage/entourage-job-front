/* eslint-disable react/jsx-no-target-blank */
import Link from 'next/link';
import React from 'react';
import { UIKIT_SCREENS } from 'src/components/variables';
import { AnyCantFix } from 'src/utils/Types';

interface SimpleLinkProps {
  href?:
    | string
    | {
        pathname: string;
        query: AnyCantFix; // query can be an object with any key-value
      };
  visible?: UIKIT_SCREENS;
  children: React.ReactNode;
  className?: string;
  target?: string;
  isExternal?: boolean;
  scroll?: boolean;
  onClick?: () => void;
  toggle?: string;
  shallow?: boolean;
}

export const SimpleLink = ({
  visible,
  href,
  children,
  className,
  target,
  scroll,
  isExternal,
  shallow,
  onClick,
  toggle,
}: SimpleLinkProps) => {
  let classBuffer = '';
  if (visible) classBuffer += ` uk-visible@${visible}`;
  if (className) classBuffer += ` ${className}`;

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
      rel={target ? 'noopener' : ''}
    >
      {children}
    </a>
  ) : (
    <Link scroll={scroll} href={href} shallow={shallow} legacyBehavior>
      <a
        onClick={onClick}
        target={target}
        className={classBuffer}
        rel={target ? 'noopener' : ''}
      >
        {children}
      </a>
    </Link>
  );
};
