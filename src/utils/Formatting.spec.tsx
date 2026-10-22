import { render } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';

import {
  formatCareerPathSentence,
  formatParagraph,
  linkifyToNodes,
} from './Formatting';

describe('formatParagraph', () => {
  it('returns falsy input as is', () => {
    expect(formatParagraph('')).toBe('');
    expect(formatParagraph(undefined as unknown as string)).toBeUndefined();
  });

  it('interleaves <br> elements between lines', () => {
    const nodes = formatParagraph('a\nb\nc') as unknown as React.ReactNode[];
    const { container } = render(<>{nodes}</>);
    expect(container.innerHTML).toBe('a<br>b<br>c');
  });

  it('keeps blank lines unless condense is set', () => {
    const full = render(
      <>{formatParagraph('a\n\nb') as unknown as React.ReactNode[]}</>
    );
    expect(full.container.innerHTML).toBe('a<br><br>b');

    const condensed = render(
      <>{formatParagraph('a\n\nb', true) as unknown as React.ReactNode[]}</>
    );
    expect(condensed.container.innerHTML).toBe('a<br>b');
  });
});

describe('formatCareerPathSentence', () => {
  it('builds ordered sector/occupation entries', () => {
    const result = formatCareerPathSentence({
      businessSectorId0: { value: 's0', label: 'Sector 0' },
      occupation0: 'Job 0',
      businessSectorId1: { value: 's1', label: 'Sector 1' },
      occupation1: 'Job 1',
    });
    expect(result).toEqual([
      {
        businessSectorId: 's0',
        businessSector: { id: 's0', name: 'Sector 0' },
        occupation: { name: 'Job 0' },
        order: 0,
      },
      {
        businessSectorId: 's1',
        businessSector: { id: 's1', name: 'Sector 1' },
        occupation: { name: 'Job 1' },
        order: 1,
      },
    ]);
  });

  it('drops entries with neither a sector nor an occupation', () => {
    const result = formatCareerPathSentence({
      businessSectorId1: { value: 's1', label: 'Sector 1' },
    });
    expect(result).toHaveLength(1);
    expect(result[0].order).toBe(1);
  });

  it('keeps an entry that only has an occupation', () => {
    const result = formatCareerPathSentence({ occupation0: 'Job' });
    expect(result).toHaveLength(1);
    expect(result[0].occupation).toEqual({ name: 'Job' });
  });

  it('returns an empty list when nothing is filled', () => {
    expect(formatCareerPathSentence({})).toEqual([]);
  });
});

describe('linkifyToNodes', () => {
  it('returns an empty array for empty content', () => {
    expect(linkifyToNodes('')).toEqual([]);
  });

  it('returns plain text untouched', () => {
    expect(linkifyToNodes('just some text')).toEqual(['just some text']);
  });

  it('turns web addresses into safe new-tab links, keeping surrounding text', () => {
    const { container } = render(
      <>{linkifyToNodes('See https://entourage.social/a?b=1 now')}</>
    );
    const link = container.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('https://entourage.social/a?b=1');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer nofollow');
    expect(container.textContent).toBe(
      'See https://entourage.social/a?b=1 now'
    );
  });

  it('prefixes scheme-less addresses with http://', () => {
    const { container } = render(
      <>{linkifyToNodes('go to www.example.com')}</>
    );
    expect(container.querySelector('a')?.getAttribute('href')).toBe(
      'http://www.example.com'
    );
  });

  it('never interprets markup in the text', () => {
    const { container } = render(
      <>{linkifyToNodes('<img src=x onerror=alert(1)> example.org')}</>
    );
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelectorAll('a')).toHaveLength(1);
  });

  it('linkifies several addresses', () => {
    const { container } = render(
      <>{linkifyToNodes('a.com and https://b.org/x')}</>
    );
    expect(container.querySelectorAll('a')).toHaveLength(2);
  });
});
