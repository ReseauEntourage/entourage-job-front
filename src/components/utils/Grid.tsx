import dynamic from 'next/dynamic';
import React from 'react';

interface GridProps {
  parallax?: number;
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
  around?: boolean;
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
  childWidths,
  match,
  divider,
  center,
  between,
  around,
  parallax,
  className,
  eachWidths,
  gap,
  children,
  top,
  middle,
  bottom,
  column,
  row,
  masonry,
  style,
  reverse,
  dataTestId,
}: GridProps) => {
  let classBuffer = '';
  let gridBuffer = '';
  if (parallax) gridBuffer += `parallax: ${parallax};`;
  if (masonry) gridBuffer += 'masonry: true';
  classBuffer += childWidths
    .map((childWidth) => {
      return ` uk-child-width-${childWidth}`;
    })
    .join(' ');
  if (gap) classBuffer += ` uk-grid-${gap}`;
  if (match) classBuffer += ' uk-grid-match';
  if (divider) classBuffer += ' uk-grid-divider';
  if (center) classBuffer += ' uk-flex-center';
  if (between) classBuffer += ' uk-flex-between';
  if (around) classBuffer += ' uk-flex-around';
  if (top) classBuffer += ' uk-flex-top';
  if (middle) classBuffer += ' uk-flex-middle';
  if (bottom) classBuffer += ' uk-flex-bottom';
  if (column) classBuffer += ' uk-flex-column';
  if (row) classBuffer += ' uk-flex-row';
  if (reverse) classBuffer += ' uk-flex-row-reverse';

  if (className) classBuffer += ` ${className}`;
  const content = (() => {
    if (items !== null) {
      return items;
    }
    if (Array.isArray(children)) {
      return children;
    }
    return [children];
  })();
  // on filtre les elemnt vide
  return (
    <div
      className={classBuffer}
      data-uk-grid={gridBuffer}
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
              // todo optimize
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
Grid.defaultProps = {
  match: false,
  center: false,
  between: false,
  divider: false,
  parallax: null,
  childWidths: [],
  eachWidths: [],
  gap: null,
  items: null,
  className: null,
  around: false,
  top: false,
  middle: false,
  bottom: false,
  column: false,
  row: false,
  masonry: false,
  style: null,
  reverse: false,
  children: null,
  dataTestId: '',
};

export const GridNoSSR = dynamic(
  () => {
    return import('src/components/utils/Grid').then((mod) => mod.Grid);
  },
  { ssr: false }
);
