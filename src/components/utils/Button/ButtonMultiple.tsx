/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import { v4 as uuid } from 'uuid';
import {
  UIKIT_BUTTON_SIZES,
  UIKIT_BUTTON_STYLES_SPEC,
  UIKIT_SCREENS,
} from 'src/components/variables';
import { useCloseOnClickOutsideComponent } from 'src/hooks/useCloseOnClickOutsideComponent';
import { AnyToFix } from 'src/utils/Types';
import { Button } from './Button';
import {
  StyledButtonContainer,
  StyledButtonMenu,
} from './ButtonMultiple.styles';

const uuidValue = uuid();

interface ButtonMultipleProps {
  id: string;
  children: React.ReactNode;
  disabled?: boolean;
  visible?: UIKIT_SCREENS;
  style?: UIKIT_BUTTON_STYLES_SPEC;
  size?: UIKIT_BUTTON_SIZES;
  widths?: string[];
  className?: string;
  dataTestId?: string;
  color?: string;
  align?: 'left' | 'right';
  buttons: {
    href?: string | { pathname: string; query: AnyToFix };
    newTab?: boolean;
    onClick?: () => void;
    toggle?: string;
    label?: string;
    dataTestId?: string;
    shallow?: boolean;
    scroll?: boolean;
    isExternal?: boolean;
    children?: React.ReactNode;
  }[];
}

export function ButtonMultiple({
  id,
  visible,
  children,
  className,
  buttons,
  align = 'left',
  disabled = false,
  style = 'custom-primary',
  size = 'large',
  widths = [],
  dataTestId = '',
  color = 'primaryBlue',
}: ButtonMultipleProps) {
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
          if (!disabled) {
            setIsOpen((prevIsOpen) => {
              return !prevIsOpen;
            });
          }
        }}
        dataTestId={dataTestId}
        color={color}
      >
        {children}
      </Button>
      <StyledButtonMenu isOpen={isOpen} id={componentId} align={align}>
        {buttons.map(
          (
            {
              href,
              newTab,
              onClick,
              toggle,
              shallow,
              scroll,
              isExternal,
              dataTestId: childDataTestId,
              label,
            },
            index
          ) => {
            return (
              <Button
                key={`${index}-${uuidValue}`}
                color="black"
                style="custom-text"
                href={href}
                newTab={newTab}
                onClick={() => {
                  setIsOpen(false);

                  // @ts-expect-error after enable TS strict mode. Please, try to fix it
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
