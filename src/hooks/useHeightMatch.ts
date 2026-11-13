import { useEffect, useRef } from 'react';

/** Smallest height difference, in px, that is worth correcting. */
const SUBPIXEL = 1;

/**
 * Groups elements that share a visual row: sorted from top to bottom, an element starts a new
 * row when it begins under the lowest edge reached so far.
 */
const groupByRow = (elements: HTMLElement[]): HTMLElement[][] => {
  const sorted = elements
    .map((element) => ({ element, rect: element.getBoundingClientRect() }))
    .sort((a, b) => a.rect.top - b.rect.top);
  const rows: HTMLElement[][] = [];
  let rowBottom = -Infinity;
  sorted.forEach(({ element, rect }) => {
    if (rows.length === 0 || rect.top >= rowBottom) {
      rows.push([element]);
      rowBottom = rect.bottom;
    } else {
      rows[rows.length - 1].push(element);
      rowBottom = Math.min(rowBottom, rect.bottom);
    }
  });
  return rows;
};

/**
 * Gives every element matching one of the selectors the height of the tallest element of its
 * row. Selectors are matched one after the other, as the first one changes the layout of the
 * next. The heights are set as `min-height`.
 */
export const matchHeights = (root: HTMLElement, selectors: string[]) => {
  selectors.forEach((selector) => {
    const elements = Array.from(root.querySelectorAll<HTMLElement>(selector));
    // Measured at their natural height: an element that grows to fill its parent would
    // otherwise take the heights set by the previous pass as its own.
    elements.forEach((element) => {
      element.style.minHeight = '';
      element.style.flex = 'none';
    });
    const heights = new Map<HTMLElement, number>();
    groupByRow(elements).forEach((row) => {
      const tallest = Math.max(
        ...row.map((element) => element.getBoundingClientRect().height)
      );
      row.forEach((element) => heights.set(element, tallest));
    });
    elements.forEach((element) => {
      const tallest = heights.get(element) as number;
      if (tallest - element.getBoundingClientRect().height >= SUBPIXEL) {
        element.style.minHeight = `${tallest}px`;
      }
    });
    elements.forEach((element) => {
      element.style.flex = '';
    });
  });
};

/**
 * Makes the elements matching `selectors` inside the returned ref as tall as the tallest of their
 * row, again when the container changes width, when the fonts have loaded and when the page
 * has finished loading.
 */
export function useHeightMatch<T extends HTMLElement>(selectors: string[]) {
  const ref = useRef<T>(null);
  const key = selectors.join('|');

  useEffect(() => {
    const root = ref.current;
    if (!root) {
      return undefined;
    }
    const list = key.split('|');
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => matchHeights(root, list));
    };

    schedule();
    // The sizes the observer reports tell whether something moved since the last pass.
    const sizes = new Map<Element, string>();
    const observer =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver((entries) => {
            const changed = entries.some((entry) => {
              const { width, height } = entry.contentRect;
              const size = `${width}x${height}`;
              const known = sizes.get(entry.target);
              sizes.set(entry.target, size);
              return known !== undefined && known !== size;
            });
            if (changed) {
              schedule();
            }
          });
    observer?.observe(root);
    list.forEach((selector) =>
      root
        .querySelectorAll(selector)
        .forEach((element) => observer?.observe(element))
    );
    window.addEventListener('resize', schedule);
    window.addEventListener('load', schedule);
    document.fonts?.ready.then(schedule);

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('resize', schedule);
      window.removeEventListener('load', schedule);
    };
  }, [key]);

  return ref;
}
