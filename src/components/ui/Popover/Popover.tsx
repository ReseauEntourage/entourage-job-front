import React, { useRef, useState } from 'react';
import {
  PopoverAlign,
  PopoverPlacement,
  StyledPopoverContent,
  StyledPopoverWrapper,
} from './Popover.styles';

export type { PopoverPlacement, PopoverAlign };

interface PopoverProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: PopoverPlacement;
  align?: PopoverAlign;
}

const CLOSE_DELAY_MS = 150;

export const Popover = ({
  content,
  children,
  placement = 'bottom',
  align = 'right',
}: PopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    setIsOpen(true);
  };

  const scheduleClose = () => {
    closeTimerRef.current = setTimeout(() => setIsOpen(false), CLOSE_DELAY_MS);
  };

  return (
    <StyledPopoverWrapper onMouseEnter={open} onMouseLeave={scheduleClose}>
      {children}
      {isOpen && (
        <StyledPopoverContent
          placement={placement}
          align={align}
          onMouseEnter={open}
          onMouseLeave={scheduleClose}
          onClick={() => setIsOpen(false)}
        >
          {content}
        </StyledPopoverContent>
      )}
    </StyledPopoverWrapper>
  );
};
