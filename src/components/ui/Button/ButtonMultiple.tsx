import React from 'react';
import { v4 as uuid } from 'uuid';
import { useCloseOnClickOutsideComponent } from 'src/hooks/useCloseOnClickOutsideComponent';
import { AnyToFix } from 'src/utils/Types';
import { Button } from './Button';
import type { ButtonSize } from './Button.types';
import {
  StyledButtonContainer,
  StyledButtonMenu,
} from './ButtonMultiple.styles';

const uuidValue = uuid();

interface ButtonMultipleProps {
  id: string;
  children: React.ReactNode;
  disabled?: boolean;
  variant?: 'default' | 'primary' | 'secondary';
  size?: ButtonSize;
  dataTestId?: string;
  align?: 'left' | 'right';
  buttons: {
    href?: string | { pathname: string; query: AnyToFix };
    newTab?: boolean;
    onClick?: () => void;
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
  children,
  buttons,
  align = 'left',
  disabled = false,
  variant = 'primary',
  size = 'medium',
  dataTestId = '',
}: ButtonMultipleProps) {
  const { componentId, isOpen, setIsOpen } =
    useCloseOnClickOutsideComponent(id);

  return (
    <StyledButtonContainer>
      <Button
        variant={variant}
        size={size}
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen((prevIsOpen) => {
              return !prevIsOpen;
            });
          }
        }}
        dataTestId={dataTestId}
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
                variant="default"
                href={href}
                newTab={newTab}
                onClick={() => {
                  setIsOpen(false);

                  // @ts-expect-error after enable TS strict mode. Please, try to fix it
                  onClick();
                }}
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
