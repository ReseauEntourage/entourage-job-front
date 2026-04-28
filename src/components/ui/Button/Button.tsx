import Link from 'next/link';
import React from 'react';
import { StyledButton } from './Button.styles';
import { ButtonProps } from './Button.types';
import { BUTTON_SIZES } from './button.constants';

export function Button({
  id,
  href,
  color,
  align = 'center',
  style,
  children,
  prependIcon,
  appendIcon,
  dataTestId = '',
  isExternal = false,
  newTab = false,
  onClick = () => {},
  shallow = false,
  scroll = true,
  className = '',
  variant = 'primary',
  disabled = false,
  size = 'medium',
  rounded = true,
  onMouseEnter,
  onMouseLeave,
}: ButtonProps) {
  const resizedPrependIcon = prependIcon
    ? React.cloneElement(prependIcon as React.ReactElement<{ size: number }>, {
        size:
          (prependIcon as React.ReactElement<{ size: number }>).props.size ??
          BUTTON_SIZES[size].iconSize,
      })
    : prependIcon;
  const resizedAppendIcon = appendIcon
    ? React.cloneElement(appendIcon as React.ReactElement<{ size: number }>, {
        size:
          (appendIcon as React.ReactElement<{ size: number }>).props.size ??
          BUTTON_SIZES[size].iconSize,
      })
    : appendIcon;

  const buttonComponent = (
    <StyledButton
      id={id}
      className={`button ${className}`}
      rounded={rounded}
      disabled={disabled}
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-testid={dataTestId}
      variant={variant}
      size={size}
      color={color}
      align={align}
      style={style}
    >
      {resizedPrependIcon && (
        <span style={{ flexShrink: 0 }}>{resizedPrependIcon}</span>
      )}
      {resizedPrependIcon && <>&nbsp;</>}
      {/** Children */}
      {children}
      {resizedAppendIcon && <>&nbsp;</>}
      {resizedAppendIcon && (
        <span style={{ flexShrink: 0 }}>{resizedAppendIcon}</span>
      )}
    </StyledButton>
  );

  if (href) {
    return isExternal && typeof href === 'string' ? (
      <a href={href} target={newTab ? '_' : ''} rel={newTab ? 'noopener' : ''}>
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
