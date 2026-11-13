import { render } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { matchHeights } from './useHeightMatch';

/** Lays out the elements as given: jsdom has no layout of its own. */
const layOut = (boxes: Record<string, [number, number]>) => {
  Object.entries(boxes).forEach(([testId, [top, height]]) => {
    const element = document.querySelector(
      `[data-testid="${testId}"]`
    ) as HTMLElement;
    element.getBoundingClientRect = () =>
      ({
        top,
        bottom: top + height,
        height,
        left: 0,
        right: 0,
        width: 100,
        x: 0,
        y: top,
        toJSON: () => ({}),
      }) as DOMRect;
  });
};

const renderBlocks = () =>
  render(
    <div data-testid="root">
      <h4 data-testid="a">A</h4>
      <h4 data-testid="b">B</h4>
      <h4 data-testid="c">C</h4>
      <p className="text" data-testid="t1">
        t1
      </p>
      <p className="text" data-testid="t2">
        t2
      </p>
    </div>
  );

const root = () =>
  document.querySelector('[data-testid="root"]') as HTMLElement;
const minHeight = (id: string) =>
  (document.querySelector(`[data-testid="${id}"]`) as HTMLElement).style
    .minHeight;

describe('matchHeights', () => {
  it('gives the elements of a row the height of the tallest one', () => {
    renderBlocks();
    layOut({
      a: [0, 40],
      b: [0, 80],
      c: [0, 60],
      t1: [100, 20],
      t2: [100, 20],
    });
    matchHeights(root(), ['h4', '.text']);

    expect(minHeight('a')).toBe('80px');
    expect(minHeight('b')).toBe('');
    expect(minHeight('c')).toBe('80px');
    expect(minHeight('t1')).toBe('');
  });

  it('matches each row apart when the elements wrap', () => {
    renderBlocks();
    layOut({
      a: [0, 40],
      b: [0, 60],
      c: [100, 30],
      t1: [200, 10],
      t2: [200, 10],
    });
    matchHeights(root(), ['h4']);

    expect(minHeight('a')).toBe('60px');
    expect(minHeight('c')).toBe('');
  });

  it('treats overlapping elements as one row even if their tops differ', () => {
    renderBlocks();
    layOut({
      a: [0, 50],
      b: [10, 70],
      c: [20, 50],
      t1: [200, 10],
      t2: [200, 10],
    });
    matchHeights(root(), ['h4']);

    expect(minHeight('a')).toBe('70px');
    expect(minHeight('b')).toBe('');
    expect(minHeight('c')).toBe('70px');
  });

  it('keeps a chain of overlapping elements in one row', () => {
    renderBlocks();
    layOut({
      a: [0, 50],
      b: [10, 70],
      c: [60, 10],
      t1: [200, 10],
      t2: [200, 10],
    });
    matchHeights(root(), ['h4']);

    // `c` starts at 60: under `a` (bottom 50) but still over `b` (bottom 80).
    expect(minHeight('a')).toBe('70px');
    expect(minHeight('c')).toBe('70px');
  });

  it('resets the previous heights before measuring again', () => {
    renderBlocks();
    (
      document.querySelector('[data-testid="a"]') as HTMLElement
    ).style.minHeight = '500px';
    layOut({
      a: [0, 40],
      b: [0, 40],
      c: [0, 40],
      t1: [100, 20],
      t2: [100, 20],
    });
    matchHeights(root(), ['h4']);

    expect(minHeight('a')).toBe('');
  });
});
