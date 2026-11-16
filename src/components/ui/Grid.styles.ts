import { css, styled } from 'styled-components';
import { BREAKPOINTS } from '@/src/constants/styles';

/**
 * Responsive grid: gutters, cell widths and alignments.
 *
 * Horizontal gutters use the negative-margin technique (the grid is pulled left by one
 * gutter, each cell is padded by one gutter), so that percentage widths are relative to the
 * grid plus one gutter. Vertical gutters (`row-gap`) always equal the horizontal ones.
 */

export type GridGap = 'small' | 'medium' | 'large' | 'collapse';

/** [gutter, gutter from `BREAKPOINTS.large` up], in px. */
const GUTTERS: Record<GridGap | 'default', [number, number]> = {
  default: [30, 40],
  small: [15, 15],
  medium: [30, 30],
  large: [40, 70],
  collapse: [0, 0],
};

/** Breakpoints of the `@s` and `@m` width suffixes, in px. */
const WIDTH_BREAKPOINTS = { s: 640, m: BREAKPOINTS.desktop } as const;

/**
 * Width of a fraction. The `.001` is deliberate: it keeps fractions of three and six from
 * summing to more than 100%, which would wrap the last cell.
 */
const FRACTIONS: Record<string, string> = {
  '1-1': '100%',
  '1-2': '50%',
  '1-3': 'calc(100% * 1 / 3.001)',
  '2-3': 'calc(100% * 2 / 3.001)',
  '1-4': '25%',
  '3-4': '75%',
  '1-5': '20%',
  '2-5': '40%',
  '3-5': '60%',
  '4-5': '80%',
  '1-6': 'calc(100% * 1 / 6.001)',
  '5-6': 'calc(100% * 5 / 6.001)',
  auto: 'auto',
};

type WidthDeclaration = { breakpoint?: 's' | 'm'; width: string };

/** Parses `1-3@m`, `1-1`, `expand@m`... into a breakpoint and a width. */
export function parseWidth(value: string): WidthDeclaration {
  const [size, breakpoint] = value.split('@');
  return {
    breakpoint: breakpoint as WidthDeclaration['breakpoint'],
    width: size,
  };
}

/** Number of columns of an equal-width spec (`1-3@m` gives 3), if it is one. */
export function columnsOf(value: string) {
  const match = /^1-(\d)(@[sm])?$/.exec(value);
  return match ? Number(match[1]) : undefined;
}

const sortByBreakpoint = (values: string[]) => {
  const order = { undefined: 0, s: 1, m: 2 };
  return [...values].sort(
    (a, b) =>
      order[String(parseWidth(a).breakpoint) as keyof typeof order] -
      order[String(parseWidth(b).breakpoint) as keyof typeof order]
  );
};

const widthRule = ({ width }: WidthDeclaration) => {
  if (width === 'expand') {
    return css`
      flex: 1;
      min-width: 1px;
    `;
  }
  return css`
    width: ${FRACTIONS[width] ?? width};
  `;
};

const atBreakpoint = (
  declaration: WidthDeclaration,
  rule: ReturnType<typeof css>
) =>
  declaration.breakpoint
    ? css`
        @media (min-width: ${WIDTH_BREAKPOINTS[declaration.breakpoint]}px) {
          ${rule}
        }
      `
    : rule;

const gutterCss = (gap: GridGap | undefined, noRowGap: boolean) => {
  const [base, wide] = GUTTERS[gap ?? 'default'];
  return css`
    margin-left: -${base}px;
    ${!noRowGap && `row-gap: ${base}px;`}
    & > * {
      padding-left: ${base}px;
    }
    /* A grid right after another one is spaced like a wrapped row. */
    & + & {
      margin-top: ${base}px;
    }
    ${
      wide !== base &&
      css`
        @media (min-width: ${BREAKPOINTS.large}px) {
          margin-left: -${wide}px;
          ${!noRowGap && `row-gap: ${wide}px;`}
          & > * {
            padding-left: ${wide}px;
          }
          & + & {
            margin-top: ${wide}px;
          }
        }
      `
    }
  `;
};

export interface StyledGridProps {
  $gap?: GridGap;
  $noRowGap: boolean;
  $childWidths: string[];
  $match: boolean;
  $center: boolean;
  $between: boolean;
  $top: boolean;
  $middle: boolean;
  $bottom: boolean;
  $column: boolean;
  $row: boolean;
  $reverse: boolean;
}

export const StyledGrid = styled.div<StyledGridProps>`
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  list-style: none;
  ${({ $gap, $noRowGap }) => gutterCss($gap, $noRowGap)}

  & > * {
    margin: 0;
  }
  & > * > :last-child {
    margin-bottom: 0;
  }

  ${({ $childWidths }) =>
    $childWidths.length > 0 &&
    css`
      & > * {
        box-sizing: border-box;
        width: 100%;
      }
      ${sortByBreakpoint($childWidths).map((value) => {
        const declaration = parseWidth(value);
        return atBreakpoint(
          declaration,
          css`
            & > * {
              ${widthRule(declaration)}
            }
          `
        );
      })}
    `}

  ${({ $match }) =>
    $match &&
    css`
      & > * {
        display: flex;
        flex-wrap: wrap;
      }
      & > * > * {
        box-sizing: border-box;
        width: 100%;
        flex: auto;
      }
    `}

  ${({ $center }) => $center && 'justify-content: center;'}
  ${({ $between }) => $between && 'justify-content: space-between;'}
  ${({ $top }) => $top && 'align-items: flex-start;'}
  ${({ $middle }) => $middle && 'align-items: center;'}
  ${({ $bottom }) => $bottom && 'align-items: flex-end;'}
  ${({ $column }) => $column && 'flex-direction: column;'}
  ${({ $row }) => $row && 'flex-direction: row;'}
  ${({ $reverse }) => $reverse && 'flex-direction: row-reverse;'}
`;

/** One cell of the grid, optionally with its own width (`1-3@m`, `expand@m`...). */
export const StyledGridCell = styled.div<{ $width?: string }>`
  ${({ $width }) => {
    if (!$width) {
      return null;
    }
    const declaration = parseWidth($width);
    return css`
      box-sizing: border-box;
      width: 100%;
      max-width: 100%;
      ${atBreakpoint(declaration, widthRule(declaration))}
    `;
  }}
`;

/** Vertical stack of a masonry column: items are spaced by the gutter of the grid. */
export const StyledMasonryColumn = styled.div<{ $gap?: GridGap }>`
  display: flex;
  flex-direction: column;
  ${({ $gap }) => {
    const [base, wide] = GUTTERS[$gap ?? 'default'];
    return css`
      row-gap: ${base}px;
      ${
        wide !== base &&
        css`
          @media (min-width: ${BREAKPOINTS.large}px) {
            row-gap: ${wide}px;
          }
        `
      }
    `;
  }}
`;
