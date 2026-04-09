import React, { useLayoutEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
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

const GAP = 8;

// Anchors to a specific edge of the wrapper. The CSS transform in StyledTooltipContent
// then shifts the tooltip away without needing its own dimensions at compute time.
function computePosition(
  placement: TooltipPlacement,
  wrapperRect: DOMRect,
  tooltipWidth: number
): { top: number; left: number } {
  switch (placement) {
    case 'top':
      return {
        top: wrapperRect.top - GAP, // transform: translateY(-100%) moves it above
        left: wrapperRect.right - tooltipWidth,
      };
    case 'left':
      return {
        top: wrapperRect.top + wrapperRect.height / 2, // transform: translate(-100%, -50%)
        left: wrapperRect.left - GAP,
      };
    case 'right':
      return {
        top: wrapperRect.top + wrapperRect.height / 2, // transform: translateY(-50%)
        left: wrapperRect.right + GAP,
      };
    case 'bottom':
    default:
      return {
        top: wrapperRect.bottom + GAP,
        left: wrapperRect.right - tooltipWidth,
      };
  }
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
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Compute position and flip if the tooltip overflows the viewport.
  // Runs before browser paint to avoid flash.
  useLayoutEffect(() => {
    if (!isOpen || !contentRef.current || !wrapperRef.current) {
      return;
    }

    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    const tooltipRect = contentRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let pl = placement;
    if (
      placement === 'bottom' &&
      wrapperRect.bottom + tooltipRect.height + GAP > vh
    ) {
      pl = 'top';
    } else if (
      placement === 'top' &&
      wrapperRect.top - tooltipRect.height - GAP < 0
    ) {
      pl = 'bottom';
    } else if (
      placement === 'right' &&
      wrapperRect.right + tooltipRect.width + GAP > vw
    ) {
      pl = 'left';
    } else if (
      placement === 'left' &&
      wrapperRect.left - tooltipRect.width - GAP < 0
    ) {
      pl = 'right';
    }

    setEffectivePlacement(pl);
    setPosition(computePosition(pl, wrapperRect, tooltipRect.width));
  }, [isOpen, placement]);

  const handleOpen = () => {
    setEffectivePlacement(placement);
    setIsOpen(true);
  };

  return (
    <StyledTooltipWrapper
      ref={wrapperRef}
      onMouseEnter={handleOpen}
      onMouseLeave={() => setIsOpen(false)}
    >
      {children}
      {isOpen &&
        ReactDOM.createPortal(
          <StyledTooltipContent
            ref={contentRef}
            top={position.top}
            left={position.left}
            width={width}
            placement={effectivePlacement}
          >
            {content}
          </StyledTooltipContent>,
          document.body
        )}
    </StyledTooltipWrapper>
  );
};
