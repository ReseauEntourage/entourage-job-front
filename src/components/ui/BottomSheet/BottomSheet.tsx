import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  StyledBottomSheet,
  StyledBottomSheetContent,
  StyledPill,
  StyledPillAnchor,
  BOTTOM_SHEET_PILL_HEIGHT,
} from './BottomSheet.styles';

const SWIPE_THRESHOLD = 60;

// Discriminated on `midHeightRatio` so existing callers (the wizard, with no
// `midHeightRatio`) keep their `(mode: 'compact' | 'full') => ReactNode`
// children type unchanged, while opting into a fixed height tier narrows
// `children` to `(mode: 'mid' | 'full') => ReactNode` instead.
type BottomSheetProps =
  | {
      children: (mode: 'compact' | 'full') => React.ReactNode;
      midHeightRatio?: undefined;
    }
  | {
      /**
       * Fixed height tier (0 to 1, e.g. 0.6 for ~60% of the sheet's height)
       * used instead of the auto-measured "compact" height — for content
       * that isn't a small collapsed summary (e.g. a full chat).
       */
      children: (mode: 'mid' | 'full') => React.ReactNode;
      midHeightRatio: number;
    };

export const BottomSheet = ({ children, midHeightRatio }: BottomSheetProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [swipeDelta, setSwipeDelta] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [compactHeight, setCompactHeight] = useState(0);

  const isExpandedRef = useRef(false);
  const touchStartYRef = useRef(0);
  const swipeDeltaRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentMeasureRef = useRef<HTMLDivElement>(null);

  isExpandedRef.current = isExpanded;

  // Reset expanded state when children (step) changes
  useEffect(() => {
    setIsExpanded(false);
    setSwipeDelta(0);
    swipeDeltaRef.current = 0;
  }, [children]);

  // Measure compact content height; update via ResizeObserver when in compact
  // mode. Skipped entirely in mid-height mode, which uses a fixed ratio instead.
  useLayoutEffect(() => {
    if (midHeightRatio !== undefined) {
      return undefined;
    }
    const el = contentMeasureRef.current;
    if (!el) {
      return undefined;
    }

    const updateHeight = () => {
      if (!isExpandedRef.current) {
        setCompactHeight(el.offsetHeight);
      }
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, [midHeightRatio]);

  // Expose collapsed height as a CSS variable for padding-bottom compensation.
  // Not applicable in mid-height mode: nothing above the sheet needs to
  // reserve space for it.
  useEffect(() => {
    if (midHeightRatio !== undefined) {
      return undefined;
    }
    const totalHeight = BOTTOM_SHEET_PILL_HEIGHT + compactHeight;
    document.documentElement.style.setProperty(
      '--wizard-bottom-sheet-collapsed-height',
      `${totalHeight}px`
    );
    return () => {
      document.documentElement.style.removeProperty(
        '--wizard-bottom-sheet-collapsed-height'
      );
    };
  }, [compactHeight, midHeightRatio]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
    setSwipeDelta(0);
    swipeDeltaRef.current = 0;
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
    setIsDragging(true);
  }, []);

  // Non-passive native touchmove listener to allow preventDefault (blocking background scroll)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) {
      return;
    }

    const handleTouchMove = (e: TouchEvent) => {
      const delta = e.touches[0].clientY - touchStartYRef.current;

      if (!isExpandedRef.current) {
        // Collapsed: prevent background scroll for any touch on the sheet
        e.preventDefault();
        const newDelta = delta < 0 ? delta : 0;
        swipeDeltaRef.current = newDelta;
        setSwipeDelta(newDelta);
      } else if (delta > 0) {
        // Expanded + swipe down: collapse the sheet, prevent background scroll
        e.preventDefault();
        swipeDeltaRef.current = delta;
        setSwipeDelta(delta);
      } else {
        // Expanded + swipe up: let internal content scroll naturally
        swipeDeltaRef.current = 0;
        setSwipeDelta(0);
      }
    };

    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => el.removeEventListener('touchmove', handleTouchMove);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    if (Math.abs(swipeDeltaRef.current) >= SWIPE_THRESHOLD) {
      setIsExpanded((prev) => !prev);
    }
    swipeDeltaRef.current = 0;
    setSwipeDelta(0);
  }, []);

  const collapsedOffset =
    midHeightRatio !== undefined
      ? `${(1 - midHeightRatio) * 100}%`
      : `calc(100% - ${BOTTOM_SHEET_PILL_HEIGHT + compactHeight}px)`;
  const translateY = isExpanded
    ? `${swipeDelta}px`
    : `calc(${collapsedOffset} + ${swipeDelta}px)`;

  const collapsedMode: 'compact' | 'mid' =
    midHeightRatio !== undefined ? 'mid' : 'compact';

  return (
    <StyledBottomSheet
      ref={containerRef}
      $translateY={translateY}
      $isDragging={isDragging}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <StyledPillAnchor onClick={toggleExpanded}>
        <StyledPill />
      </StyledPillAnchor>
      <StyledBottomSheetContent>
        <div ref={contentMeasureRef}>
          {
            // `children`'s exact parameter type depends on which union member
            // was passed; `collapsedMode` is computed from the same
            // `midHeightRatio` so it always matches at runtime, but TS can't
            // correlate the two after destructuring the union.
            (children as (mode: 'compact' | 'mid' | 'full') => React.ReactNode)(
              isExpanded ? 'full' : collapsedMode
            )
          }
        </div>
      </StyledBottomSheetContent>
    </StyledBottomSheet>
  );
};
