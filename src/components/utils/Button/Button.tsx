/* eslint-disable react/jsx-no-target-blank */
import Link from 'next/link';
import React from 'react';
import { StyledButton } from 'src/components/utils/Button/Button.styles';
import {
  UIKIT_BUTTON_SIZES,
  UIKIT_BUTTON_STYLES_SPEC,
  UIKIT_SCREENS,
} from 'src/components/variables';
import { AnyToFix } from 'src/utils/Types';

interface ButtonProps {
  children: React.ReactNode;
  href?: string | { pathname: string; query: AnyToFix };
  disabled?: boolean;
  visible?: UIKIT_SCREENS;
  style?: UIKIT_BUTTON_STYLES_SPEC | '';

  size?: UIKIT_BUTTON_SIZES;
  widths?: string[];
  isExternal?: boolean;
  newTab?: boolean;
  className?: string;
  onClick?: () => void;
  toggle?: string;
  shallow?: boolean;
  scroll?: boolean;
  dataTestId?: string;
  color?: string;
}

export function Button({
  visible,
  href,
  children,
  className,
  onClick,
  toggle,
  disabled = false,
  shallow = false,
  style = 'custom-primary',
  size = 'large',
  widths = [],
  isExternal = false,
  newTab = false,
  scroll = true,
  dataTestId = '',
  color = 'primaryOrange',
}: ButtonProps) {
  let classBuffer = 'uk-button';
  if (visible) classBuffer += ` uk-visible@${visible}`;
  if (style && style.includes('custom')) {
    classBuffer = style;
    if (size) classBuffer += ` ${size}`;
    if (disabled) classBuffer += ' disabled';
  } else {
    if (style) {
      classBuffer += ` uk-button-${style}`;
    }
    if (size) classBuffer += ` uk-button-${size}`;
    if (disabled) classBuffer += ' uk-button-disabled';
  }

  if (className) classBuffer += ` ${className}`;
  widths.forEach((width) => {
    classBuffer += ` uk-width-${width}`;
  });

  const buttonComponent = (
    <StyledButton
      className={classBuffer}
      disabled={disabled}
      type="button"
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
      data-uk-toggle={toggle}
      data-testid={dataTestId}
      color={color}
    >
      {children}
    </StyledButton>
  );
  if (href) {
    return isExternal && typeof href === 'string' ? (
      <a
        href={href}
        target={newTab ? '_blank' : ''}
        rel={newTab ? 'noopener' : ''}
      >
        {buttonComponent}
      </a>
    ) : (
      <Link href={href} shallow={shallow} scroll={scroll}>
        {buttonComponent}
      </Link>
    );
  }
  return buttonComponent;
}
