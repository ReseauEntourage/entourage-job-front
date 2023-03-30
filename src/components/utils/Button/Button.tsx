/* eslint-disable react/jsx-no-target-blank */
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';
import { StyledButton } from 'src/components/utils/Button/Button.styles';
import {
  UIKIT_BUTTON_SIZES,
  UIKIT_BUTTON_STYLES_SPEC,
  UIKIT_SCREENS,
} from 'src/components/variables';

export function Button({
  visible,
  style,
  size,
  href,
  disabled,
  widths,
  children,
  className,
  isExternal,
  newTab,
  onClick,
  toggle,
  shallow,
  scroll,
  dataTestId,
  color,
}) {
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
    return isExternal ? (
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

Button.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  href: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({ pathname: PropTypes.string, query: PropTypes.shape({}) }),
  ]),
  disabled: PropTypes.bool,
  visible: PropTypes.oneOf(UIKIT_SCREENS),
  style: PropTypes.oneOf([
    'custom-primary',
    'custom-primary-inverted',
    'custom-secondary',
    'custom-text',
    ...UIKIT_BUTTON_STYLES_SPEC,
  ]),
  size: PropTypes.oneOf(UIKIT_BUTTON_SIZES),
  widths: PropTypes.arrayOf(PropTypes.string), // UIKIT_WIDTH_SCREENS
  isExternal: PropTypes.bool,
  newTab: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  toggle: PropTypes.string,
  shallow: PropTypes.bool,
  scroll: PropTypes.bool,
  dataTestId: PropTypes.string,
  color: PropTypes.string,
};

Button.defaultProps = {
  disabled: false,
  shallow: false,
  visible: undefined,
  style: undefined,
  size: undefined,
  href: undefined,
  widths: [],
  isExternal: false,
  newTab: false,
  className: undefined,
  onClick: undefined,
  toggle: undefined,
  scroll: true,
  dataTestId: '',
  color: '',
};
