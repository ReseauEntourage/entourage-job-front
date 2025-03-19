import React, { useEffect, useMemo, type JSX } from 'react';
import UIkit from 'uikit';

interface GridProps {
  match?: boolean;
  center?: boolean;
  between?: boolean;
  childWidths?: string[];
  divider?: boolean;
  eachWidths?: string[];
  gap?: 'small' | 'medium' | 'large' | 'collapse';
  items?: JSX.Element[];
  children?: React.ReactNode;
  className?: string;
  top?: boolean;
  middle?: boolean;
  bottom?: boolean;
  column?: boolean;
  row?: boolean;
  masonry?: boolean;
  style?: React.CSSProperties;
  reverse?: boolean;
  dataTestId?: string;
}

export const Grid = ({
  items,
  childWidths = [],
  match = false,
  divider = false,
  center = false,
  between = false,
  className,
  eachWidths = [],
  gap,
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
  const gridRef = React.useRef<HTMLDivElement | null>(null);
  let classBuffer = '';
  const gridOptions = useMemo(() => {
    if (masonry) {
      return {
        masonry: true,
      };
    }
    return {};
  }, [masonry]);
  if (childWidths) {
    classBuffer += childWidths
      .map((childWidth) => {
        return ` uk-child-width-${childWidth}`;
      })
      .join(' ');
  }
  if (gap) classBuffer += ` uk-grid-${gap}`;
  if (match) classBuffer += ' uk-grid-match';
  if (divider) classBuffer += ' uk-grid-divider';
  if (center) classBuffer += ' uk-flex-center';
  if (between) classBuffer += ' uk-flex-between';
  if (top) classBuffer += ' uk-flex-top';
  if (middle) classBuffer += ' uk-flex-middle';
  if (bottom) classBuffer += ' uk-flex-bottom';
  if (column) classBuffer += ' uk-flex-column';
  if (row) classBuffer += ' uk-flex-row';
  if (reverse) classBuffer += ' uk-flex-row-reverse';

  if (className) classBuffer += ` ${className}`;
  const content = useMemo(() => {
    if (items !== undefined) {
      return items;
    }
    if (Array.isArray(children)) {
      return children;
    }
    return [children];
  }, [children, items]);

  useEffect(() => {
    if (gridRef.current) {
      UIkit.grid(gridRef.current, gridOptions);
    }
  }, [gridOptions]);

  return (
    <div
      ref={gridRef}
      className={classBuffer}
      style={style}
      data-testid={dataTestId}
    >
      {content
        .filter((_) => {
          return _;
        })
        .map((item, index) => {
          return (
            <div
              className={
                index < eachWidths.length
                  ? `uk-width-${eachWidths[index]}`
                  : undefined
              }
              key={index}
            >
              {item}
            </div>
          );
        })}
    </div>
  );
};
