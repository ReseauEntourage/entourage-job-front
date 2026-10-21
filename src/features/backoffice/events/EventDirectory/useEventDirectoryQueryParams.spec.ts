import { renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import { useEventDirectoryQueryParams } from './useEventDirectoryQueryParams';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));

const run = (query: Record<string, unknown>) => {
  (useRouter as jest.Mock).mockReturnValue({ query });
  return renderHook(() => useEventDirectoryQueryParams()).result.current;
};

describe('useEventDirectoryQueryParams', () => {
  it('returns empty arrays and no search on an empty URL', () => {
    expect(run({})).toEqual({
      modes: [],
      departmentIds: [],
      eventTypes: [],
      publicSensibilise: [],
    });
  });

  it('wraps single values in arrays and keeps arrays', () => {
    expect(
      run({
        modes: 'remote',
        departmentIds: ['75', '59'],
        eventTypes: 'webinar',
        publicSensibilise: ['a', 'b'],
      })
    ).toEqual({
      modes: ['remote'],
      departmentIds: ['75', '59'],
      eventTypes: ['webinar'],
      publicSensibilise: ['a', 'b'],
    });
  });

  it('adds the search when present', () => {
    expect(run({ search: 'atelier' })).toMatchObject({ search: 'atelier' });
    expect(run({ search: '' })).not.toHaveProperty('search');
  });
});
