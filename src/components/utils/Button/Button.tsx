import Link from 'next/link';
import React from 'react';
import { StyledButton } from './Button.styles';
import { ButtonProps } from './ButtonProps';

export function Button({
  id,
  children,
  variant = 'primary',
  disabled = false,
  size = 'large',
  rounded = true,
  href,
  isExternal = false,
  newTab = false,
  onClick = () => {},
  toggle,
  shallow = false,
  scroll = true,
  className = '',
  dataTestId = '',
  color = 'primaryBlue',
  rounded = false,
  submit = false,
}: ButtonProps) {
  const classBuffer = `button button-${size} ${className}`;

  const buttonComponent = (
    <StyledButton
      type={submit ? 'submit' : 'button'}
      id={id || undefined}
      className={classBuffer}
      rounded={rounded}
      disabled={disabled}
      onClick={onClick}
      data-uk-toggle={toggle} // ??
      data-testid={dataTestId}
      variant={variant}
      size={size}
    >
      {Array.isArray(children)
        ? children.map((child, index) => {
            if (typeof child === 'string') {
              return <span key={index.toString()}>{child}</span>;
            }
            return child;
          })
        : children}
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
