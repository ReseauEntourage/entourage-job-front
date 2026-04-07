import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  StyledTooltipContent,
  StyledTooltipWrapper,
  TooltipPlacement,
} from './Tooltip.styles';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  width?: number;
  placement?: TooltipPlacement;
}

export const Tooltip = ({
  content,
  children,
  width,
  placement = 'bottom',
}: TooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [effectivePlacement, setEffectivePlacement] =
    useState<TooltipPlacement>(placement);
  const contentRef = useRef<HTMLDivElement>(null);

  // Flip the tooltip if it overflows the viewport, runs before browser paint to avoid flash
  useLayoutEffect(() => {
    if (!isOpen || !contentRef.current) {
      return;
    }
    const rect = contentRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let next = placement;
    if (placement === 'bottom' && rect.bottom > vh) {
      next = 'top';
    } else if (placement === 'top' && rect.top < 0) {
      next = 'bottom';
    } else if (placement === 'right' && rect.right > vw) {
      next = 'left';
    } else if (placement === 'left' && rect.left < 0) {
      next = 'right';
    }

    setEffectivePlacement(next);
  }, [isOpen, placement]);

  const handleOpen = () => {
    setEffectivePlacement(placement);
    setIsOpen(true);
  };

  return (
    <StyledTooltipWrapper
      onMouseEnter={handleOpen}
      onMouseLeave={() => setIsOpen(false)}
    >
      {children}
      {isOpen && (
        <StyledTooltipContent
          ref={contentRef}
          placement={effectivePlacement}
          width={width}
        >
          {content}
        </StyledTooltipContent>
      )}
    </StyledTooltipWrapper>
  );
};
