// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { MEMBER_FILTERS_DATA } from '@/src/constants';
import { UserRoles } from '@/src/constants/users';
import {
  filtersToQueryParams,
  getFiltersObjectsFromQueryParamsFront,
  mutateTypeFilterDependingOnRole,
} from './Filters';

describe('mutateTypeFilterDependingOnRole', () => {
  it('gives coaches and candidates every member filter', () => {
    expect(mutateTypeFilterDependingOnRole(UserRoles.COACH)).toEqual(
      MEMBER_FILTERS_DATA
    );
    expect(mutateTypeFilterDependingOnRole(UserRoles.CANDIDATE)).toEqual(
      MEMBER_FILTERS_DATA
    );
  });

  it('restricts referers to the first filter', () => {
    expect(mutateTypeFilterDependingOnRole(UserRoles.REFERER)).toEqual([
      MEMBER_FILTERS_DATA[0],
    ]);
  });

  it('defaults to every filter for other roles', () => {
    expect(mutateTypeFilterDependingOnRole(UserRoles.ADMIN)).toBe(
      MEMBER_FILTERS_DATA
    );
  });
});

describe('filtersToQueryParams', () => {
  it('maps selected options to their values and empty filters to undefined', () => {
    expect(
      filtersToQueryParams({
        zone: [{ value: 'PARIS' }, { value: 'LYON' }],
        sectors: [],
      })
    ).toEqual({ zone: ['PARIS', 'LYON'], sectors: undefined });
  });

  it('returns an empty object for no filters', () => {
    expect(filtersToQueryParams({})).toEqual({});
  });
});

describe('getFiltersObjectsFromQueryParamsFront', () => {
  const filtersConst = [
    {
      key: 'zone',
      constants: [
        { label: 'Paris', value: 'PARIS' },
        { label: 'Lyon', value: 'LYON' },
      ],
    },
    {
      key: 'level',
      constants: [
        { label: 'One', value: 1 },
        { label: 'Two', value: 2 },
      ],
    },
  ];

  it('resolves array and single query params into constants', () => {
    expect(
      getFiltersObjectsFromQueryParamsFront(
        { zone: ['PARIS', 'LYON'], level: '2' },
        filtersConst
      )
    ).toEqual({
      zone: [filtersConst[0].constants[0], filtersConst[0].constants[1]],
      level: [filtersConst[1].constants[1]],
    });
  });

  it('returns an empty array for missing params', () => {
    expect(getFiltersObjectsFromQueryParamsFront({}, filtersConst)).toEqual({
      zone: [],
      level: [],
    });
  });

  it('yields undefined entries for unknown values', () => {
    const result = getFiltersObjectsFromQueryParamsFront(
      { zone: 'NOPE' },
      filtersConst
    ) as Record<string, unknown>;
    expect(result.zone).toEqual([undefined]);
  });

  it('returns an empty object without filter constants', () => {
    expect(
      getFiltersObjectsFromQueryParamsFront({ zone: 'a' }, undefined)
    ).toEqual({});
  });
});
