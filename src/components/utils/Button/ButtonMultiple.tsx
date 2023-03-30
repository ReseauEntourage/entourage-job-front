/* eslint-disable react/jsx-no-target-blank */
import PropTypes from 'prop-types';
import React from 'react';
import {
  UIKIT_BUTTON_SIZES,
  UIKIT_BUTTON_STYLES_SPEC,
  UIKIT_SCREENS,
} from 'src/components/variables';
import { useCloseOnClickOutsideComponent } from 'src/hooks/useCloseOnClickOutsideComponent';
import { Button } from './Button';
import {
  StyledButtonContainer,
  StyledButtonMenu,
} from './ButtonMultiple.styles';

export function ButtonMultiple({
  id,
  visible,
  style,
  size,
  disabled,
  widths,
  children,
  className,
  dataTestId,
  color,
  buttons,
  align,
}) {
  const { componentId, isOpen, setIsOpen } =
    useCloseOnClickOutsideComponent(id);

  return (
    <StyledButtonContainer>
      <Button
        visible={visible}
        style={style}
        size={size}
        disabled={disabled}
        widths={widths}
        className={className}
        onClick={() => {
          setIsOpen((prevIsOpen) => {
            return !prevIsOpen;
          });
        }}
        dataTestId={dataTestId}
        color={color}
      >
        {children}
      </Button>
      <StyledButtonMenu isOpen={isOpen} id={componentId} align={align}>
        {buttons.map(
          ({
            href,
            newTab,
            onClick,
            toggle,
            shallow,
            scroll,
            isExternal,
            dataTestId: childDataTestId,
            label,
          }) => {
            return (
              <Button
                color="black"
                style="custom-text"
                href={href}
                newTab={newTab}
                onClick={() => {
                  setIsOpen(false);
                  onClick();
                }}
                toggle={toggle}
                shallow={shallow}
                scroll={scroll}
                isExternal={isExternal}
                dataTestId={childDataTestId}
              >
                {label}
              </Button>
            );
          }
        )}
      </StyledButtonMenu>
    </StyledButtonContainer>
  );
}

ButtonMultiple.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  disabled: PropTypes.bool,
  visible: PropTypes.oneOf(UIKIT_SCREENS),
  style: PropTypes.oneOf([
    'custom-secondary',
    'custom-primary',
    'custom-primary-inverted',
    ...UIKIT_BUTTON_STYLES_SPEC,
  ]),
  size: PropTypes.oneOf(UIKIT_BUTTON_SIZES),
  widths: PropTypes.arrayOf(PropTypes.string), // UIKIT_WIDTH_SCREENS
  className: PropTypes.string,
  dataTestId: PropTypes.string,
  color: PropTypes.string,
  align: PropTypes.oneOf(['left', 'right']),
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          pathname: PropTypes.string,
          query: PropTypes.shape({}),
        }),
      ]),
      newTab: PropTypes.bool,
      onClick: PropTypes.func,
      toggle: PropTypes.string,
      dataTestId: PropTypes.string,
      shallow: PropTypes.bool,
      scroll: PropTypes.bool,
      isExternal: PropTypes.bool,
      children: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
        .isRequired,
    }).isRequired
  ).isRequired,
};

ButtonMultiple.defaultProps = {
  align: 'left',
  disabled: false,
  visible: undefined,
  style: undefined,
  size: undefined,
  widths: [],
  className: undefined,
  dataTestId: '',
  color: '',
};
