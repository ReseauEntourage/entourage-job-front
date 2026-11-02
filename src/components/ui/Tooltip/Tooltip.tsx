import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
  /**
   * Accessible name for icon-only / non-text triggers. When set, the trigger
   * becomes keyboard-focusable and opens the tooltip on focus, so the
   * information isn't only reachable by mouse hover.
   */
  ariaLabel?: string;
  /**
   * Opens the tooltip when a focusable child (a button, a link) receives the
   * keyboard focus. Unlike `ariaLabel`, it adds no `role` and no `tabIndex` to
   * the wrapper, so the child keeps its own semantics and accessible name.
   */
  openOnFocus?: boolean;
  /**
   * Never opens the tooltip on a device that cannot hover (touch screens),
   * where a tap fires a synthetic `mouseenter` at the same time as the action
   * of the trigger.
   */
  hoverOnly?: boolean;
  /**
   * Keeps the tooltip closed, and closes it when it is open (for instance while
   * a menu opened by the trigger covers the same spot).
   */
  disabled?: boolean;
}

const GAP = 8;

// Falls back to `true` where `matchMedia` is missing (SSR, tests)
const canHover = () =>
  typeof window === 'undefined' ||
  typeof window.matchMedia !== 'function' ||
  window.matchMedia('(hover: hover)').matches;

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
  ariaLabel,
  openOnFocus = false,
  hoverOnly = false,
  disabled = false,
}: TooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  // Read after mount so that the server and the first client render agree
  const [isHoverable, setIsHoverable] = useState(true);

  useEffect(() => {
    if (hoverOnly) {
      setIsHoverable(canHover());
    }
  }, [hoverOnly]);

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

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
    }
  }, [disabled]);

  const handleOpen = () => {
    if (disabled || (hoverOnly && !isHoverable)) {
      return;
    }
    setEffectivePlacement(placement);
    setIsOpen(true);
  };

  return (
    <StyledTooltipWrapper
      ref={wrapperRef}
      onMouseEnter={handleOpen}
      onMouseLeave={() => setIsOpen(false)}
      {...(ariaLabel && {
        tabIndex: 0,
        role: 'img',
        'aria-label': ariaLabel,
        onFocus: handleOpen,
        onBlur: () => setIsOpen(false),
      })}
      {...(openOnFocus &&
        !ariaLabel && {
          onFocus: handleOpen,
          onBlur: () => setIsOpen(false),
        })}
    >
      {children}
      {isOpen &&
        ReactDOM.createPortal(
          <StyledTooltipContent
            ref={contentRef}
            $top={position.top}
            $left={position.left}
            width={width}
            $placement={effectivePlacement}
          >
            {content}
          </StyledTooltipContent>,
          document.body
        )}
    </StyledTooltipWrapper>
  );
};
