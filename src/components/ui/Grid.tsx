import React, { useMemo, type JSX } from 'react';
import { useIsDesktop } from '@/src/hooks/utils';
import {
  columnsOf,
  type GridGap,
  StyledGrid,
  StyledGridCell,
  StyledMasonryColumn,
} from './Grid.styles';

interface GridProps {
  match?: boolean;
  center?: boolean;
  between?: boolean;
  childWidths?: string[];
  eachWidths?: string[];
  gap?: GridGap;
  /**
   * Keeps the cells tight vertically. Only for the grids that have always been rendered without
   * vertical spacing, which the pages rely on.
   */
  noRowGap?: boolean;
  items?: JSX.Element[];
  children?: React.ReactNode;
  className?: string;
  top?: boolean;
  middle?: boolean;
  bottom?: boolean;
  column?: boolean;
  row?: boolean;
  /**
   * Stacks the cells in columns of independent heights instead of aligned rows. Only for
   * equal-width cells (`childWidths={['1-2@m']}`); with `eachWidths` the cells already sit
   * side by side and nothing needs to move.
   */
  masonry?: boolean;
  style?: React.CSSProperties;
  reverse?: boolean;
  dataTestId?: string;
}

export const Grid = ({
  items,
  childWidths = [],
  match = false,
  center = false,
  between = false,
  className,
  eachWidths = [],
  gap,
  noRowGap = false,
  children,
  top = false,
  middle = false,
  bottom = false,
  column = false,
  row = false,
  masonry = false,
  style,
  reverse = false,
  dataTestId = '',
}: GridProps) => {
  const isDesktop = useIsDesktop();

  const content = useMemo(() => {
    let list: React.ReactNode[];
    if (items !== undefined) {
      list = items;
    } else if (Array.isArray(children)) {
      list = children;
    } else {
      list = [children];
    }
    return list.filter((item) => {
      return item;
    });
  }, [children, items]);

  // Number of masonry columns at the current screen size: the `@m` width only applies on
  // desktop, below it every cell takes the whole width.
  const masonryColumns = useMemo(() => {
    if (!masonry || childWidths.length === 0) {
      return 1;
    }
    const wide = childWidths.map(columnsOf).find((columns) => columns);
    return isDesktop && wide ? wide : 1;
  }, [childWidths, isDesktop, masonry]);

  const useMasonry = masonry && childWidths.length > 0;

  return (
    <StyledGrid
      className={className}
      style={style}
      data-testid={dataTestId}
      $gap={gap}
      $noRowGap={noRowGap}
      $childWidths={useMasonry ? [] : childWidths}
      $match={match}
      $center={center}
      $between={between}
      $top={top}
      $middle={middle}
      $bottom={bottom}
      $column={column}
      $row={row}
      $reverse={reverse}
    >
      {useMasonry
        ? Array.from({ length: masonryColumns }, (_, columnIndex) => {
            return (
              <StyledGridCell key={columnIndex} $width={`1-${masonryColumns}`}>
                <StyledMasonryColumn $gap={gap}>
                  {content.filter((_item, index) => {
                    return index % masonryColumns === columnIndex;
                  })}
                </StyledMasonryColumn>
              </StyledGridCell>
            );
          })
        : content.map((item, index) => {
            return (
              <StyledGridCell
                key={index}
                $width={
                  index < eachWidths.length ? eachWidths[index] : undefined
                }
              >
                {item}
              </StyledGridCell>
            );
          })}
    </StyledGrid>
  );
};
