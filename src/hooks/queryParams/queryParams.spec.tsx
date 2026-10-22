import { renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useCompanyId } from './useCompanyId';
import { useEntity } from './useEntity';
import { useEventId } from './useEventId';
import { useMemberId } from './useMemberId';
import { useRole } from './useRole';
import { useRoles } from './useRoles';
import { useSort } from './useSort';
import { useStep } from './useStep';
import { useTab } from './useTab';
import { useUtm } from './useUTM';
import { useUserId } from './useUserId';
import { useZone } from './useZone';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('next/navigation', () => ({ useSearchParams: jest.fn() }));

const mockUseRouter = useRouter as jest.Mock;
const mockUseSearchParams = useSearchParams as jest.Mock;

const mockQuery = (query: Record<string, string | string[] | undefined>) =>
  mockUseRouter.mockReturnValue({ query });

describe('query param hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // `describe.each` is not typed here (mocha types shadow Jest's), hence forEach
  [
    ['useStep', useStep, 'step', 'contact'],
    ['useTab', useTab, 'tab', 'profile'],
    ['useUserId', useUserId, 'userId', 'user-1'],
    ['useMemberId', useMemberId, 'memberId', 'member-1'],
    ['useEventId', useEventId, 'eventId', 'event-1'],
    ['useCompanyId', useCompanyId, 'companyId', 'company-1'],
  ].forEach(([name, hook, param, value]) => {
    describe(name as string, () => {
      it(`returns the "${param}" query param`, () => {
        mockQuery({ [param as string]: value as string });

        const { result } = renderHook(() => (hook as () => unknown)());

        expect(result.current).toBe(value);
      });

      it(`returns undefined when "${param}" is absent`, () => {
        mockQuery({});

        const { result } = renderHook(() => (hook as () => unknown)());

        expect(result.current).toBeUndefined();
      });
    });
  });

  describe('useEntity', () => {
    it('returns the raw entity param, string or array', () => {
      mockQuery({ entity: ['a', 'b'] });
      expect(renderHook(() => useEntity()).result.current).toEqual(['a', 'b']);

      mockQuery({ entity: 'a' });
      expect(renderHook(() => useEntity()).result.current).toBe('a');
    });

    it('returns undefined without entity param', () => {
      mockQuery({});
      expect(renderHook(() => useEntity()).result.current).toBeUndefined();
    });
  });

  describe('useRole', () => {
    it('returns undefined without role param', () => {
      mockQuery({});
      expect(renderHook(() => useRole()).result.current).toBeUndefined();
    });

    it('returns a single role as is', () => {
      mockQuery({ role: 'Coach' });
      expect(renderHook(() => useRole()).result.current).toBe('Coach');
    });

    it('returns the first role when several are given', () => {
      mockQuery({ role: ['Coach', 'Candidat'] });
      expect(renderHook(() => useRole()).result.current).toBe('Coach');
    });
  });

  describe('useRoles', () => {
    it('returns an empty list without role param', () => {
      mockQuery({});
      expect(renderHook(() => useRoles()).result.current).toEqual([]);
    });

    it('wraps a single role in a list', () => {
      mockQuery({ role: 'Coach' });
      expect(renderHook(() => useRoles()).result.current).toEqual(['Coach']);
    });

    it('returns every role when several are given', () => {
      mockQuery({ role: ['Coach', 'Candidat'] });
      expect(renderHook(() => useRoles()).result.current).toEqual([
        'Coach',
        'Candidat',
      ]);
    });
  });

  describe('useSort', () => {
    it('returns the sort value', () => {
      mockQuery({ sort: 'RELEVANCE' });
      expect(renderHook(() => useSort()).result.current).toBe('RELEVANCE');
    });

    it('returns the first sort value when several are given', () => {
      mockQuery({ sort: ['RELEVANCE', 'LAST_CONNECTION'] });
      expect(renderHook(() => useSort()).result.current).toBe('RELEVANCE');
    });

    it('returns undefined without sort param', () => {
      mockQuery({});
      expect(renderHook(() => useSort()).result.current).toBeUndefined();
    });
  });

  describe('useZone', () => {
    it('returns the zone param as is', () => {
      mockQuery({ zone: ['PARIS', 'LYON'] });
      expect(renderHook(() => useZone()).result.current).toEqual([
        'PARIS',
        'LYON',
      ]);
    });
  });

  describe('useUtm', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('stores every recognised utm_* param in localStorage', () => {
      mockUseSearchParams.mockReturnValue(
        new URLSearchParams('utm_source=news&utm_campaign=autumn&foo=bar')
      );

      renderHook(() => useUtm());

      expect(localStorage.getItem('utm_source')).toBe('news');
      expect(localStorage.getItem('utm_campaign')).toBe('autumn');
      expect(localStorage.getItem('foo')).toBeNull();
    });

    it('stores nothing when the URL has no utm_* param', () => {
      mockUseSearchParams.mockReturnValue(new URLSearchParams('page=2'));

      renderHook(() => useUtm());

      expect(localStorage.length).toBe(0);
    });

    it('ignores utm_* names that are not tracked parameters', () => {
      mockUseSearchParams.mockReturnValue(
        new URLSearchParams('utm_unknown=x&utm_medium=email')
      );

      renderHook(() => useUtm());

      expect(localStorage.getItem('utm_unknown')).toBeNull();
      expect(localStorage.getItem('utm_medium')).toBe('email');
    });
  });
});
