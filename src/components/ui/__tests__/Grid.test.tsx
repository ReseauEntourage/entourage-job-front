import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Grid } from '../Grid';
import { columnsOf, parseWidth } from '../Grid.styles';

const mockUseIsDesktop = jest.fn();
jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => mockUseIsDesktop(),
}));

const cells = (count: number) =>
  Array.from({ length: count }, (_, index) => (
    <p key={index} data-testid={`item-${index}`}>
      {index}
    </p>
  ));

const grid = () => screen.getByTestId('grid');
const cell = (index: number) =>
  screen.getByTestId(`item-${index}`).parentElement!;

describe('Grid', () => {
  beforeEach(() => {
    mockUseIsDesktop.mockReturnValue(true);
  });

  describe('gutters', () => {
    it('pulls the grid left by the default gutter and pads its cells', () => {
      render(<Grid dataTestId="grid">{cells(2)}</Grid>);
      expect(grid()).toHaveStyle({ display: 'flex', marginLeft: '-30px' });
      expect(cell(0)).toHaveStyle({ paddingLeft: '30px', margin: '0px' });
    });

    (
      [
        ['small', '15px'],
        ['medium', '30px'],
        ['large', '40px'],
        ['collapse', '0px'],
      ] as const
    ).forEach(([gap, gutter]) => {
      it(`uses the ${gap} gutter`, () => {
        render(
          <Grid dataTestId="grid" gap={gap}>
            {cells(2)}
          </Grid>
        );
        expect(grid()).toHaveStyle({ rowGap: gutter });
        expect(cell(1)).toHaveStyle({ paddingLeft: gutter });
      });
    });
  });

  it('can keep its cells tight vertically', () => {
    render(
      <Grid dataTestId="grid" noRowGap>
        {cells(2)}
      </Grid>
    );
    expect(grid()).not.toHaveStyle({ rowGap: '30px' });
    expect(cell(0)).toHaveStyle({ paddingLeft: '30px' });
  });

  describe('alignment', () => {
    (
      [
        ['center', { justifyContent: 'center' }],
        ['between', { justifyContent: 'space-between' }],
        ['top', { alignItems: 'flex-start' }],
        ['middle', { alignItems: 'center' }],
        ['bottom', { alignItems: 'flex-end' }],
        ['column', { flexDirection: 'column' }],
        ['row', { flexDirection: 'row' }],
        ['reverse', { flexDirection: 'row-reverse' }],
      ] as const
    ).forEach(([prop, style]) => {
      it(`applies the ${prop} prop`, () => {
        render(
          <Grid dataTestId="grid" {...{ [prop]: true }}>
            {cells(2)}
          </Grid>
        );
        expect(grid()).toHaveStyle(style);
      });
    });

    it('stretches the content of the cells when they must match', () => {
      render(
        <Grid dataTestId="grid" match>
          {cells(2)}
        </Grid>
      );
      expect(cell(0)).toHaveStyle({ display: 'flex', flexWrap: 'wrap' });
      expect(screen.getByTestId('item-0')).toHaveStyle({ width: '100%' });
    });
  });

  describe('widths', () => {
    it('gives every cell the full width until a breakpoint says otherwise', () => {
      render(
        <Grid dataTestId="grid" childWidths={['1-2@m']}>
          {cells(2)}
        </Grid>
      );
      expect(cell(0)).toHaveStyle({ width: '100%', boxSizing: 'border-box' });
    });

    it('gives the cell its own width', () => {
      render(
        <Grid dataTestId="grid" eachWidths={['2-3@m', '1-1']}>
          {cells(3)}
        </Grid>
      );
      expect(cell(0)).toHaveStyle({ width: '100%', maxWidth: '100%' });
      expect(cell(2)).not.toHaveStyle({ maxWidth: '100%' });
    });

    it('parses width specs', () => {
      expect(parseWidth('1-3@m')).toEqual({ breakpoint: 'm', width: '1-3' });
      expect(parseWidth('1-1')).toEqual({
        breakpoint: undefined,
        width: '1-1',
      });
      expect(columnsOf('1-3@m')).toBe(3);
      expect(columnsOf('expand@m')).toBeUndefined();
    });
  });

  describe('content', () => {
    it('takes the cells from `items` first', () => {
      render(
        <Grid dataTestId="grid" items={[<b key="a">item</b>]}>
          <i>child</i>
        </Grid>
      );
      expect(screen.getByText('item')).toBeInTheDocument();
      expect(screen.queryByText('child')).not.toBeInTheDocument();
    });

    it('skips empty children and wraps a single child', () => {
      render(
        <Grid dataTestId="grid">
          {false}
          {null}
          <span>only</span>
        </Grid>
      );
      expect(grid().children).toHaveLength(1);
    });

    it('keeps the class name and the inline style', () => {
      render(
        <Grid dataTestId="grid" className="custom" style={{ opacity: 0.5 }}>
          {cells(1)}
        </Grid>
      );
      expect(grid()).toHaveClass('custom');
      expect(grid()).toHaveStyle({ opacity: '0.5' });
    });
  });

  describe('masonry', () => {
    const textsByColumn = () =>
      Array.from(grid().children).map((column) =>
        Array.from(column.firstElementChild!.children).map(
          (item) => item.textContent
        )
      );

    it('deals the cells into columns on desktop', () => {
      render(
        <Grid dataTestId="grid" masonry childWidths={['1-2@m']}>
          {cells(5)}
        </Grid>
      );
      expect(textsByColumn()).toEqual([
        ['0', '2', '4'],
        ['1', '3'],
      ]);
    });

    it('stacks the cells in one column on mobile', () => {
      mockUseIsDesktop.mockReturnValue(false);
      render(
        <Grid dataTestId="grid" masonry childWidths={['1-2@m']}>
          {cells(3)}
        </Grid>
      );
      expect(textsByColumn()).toEqual([['0', '1', '2']]);
    });

    it('is a plain grid without equal widths', () => {
      render(
        <Grid dataTestId="grid" masonry eachWidths={['1-3@m', '2-3@m']}>
          {cells(2)}
        </Grid>
      );
      expect(grid().children).toHaveLength(2);
      expect(cell(0)).toBe(grid().children[0]);
    });
  });
});
