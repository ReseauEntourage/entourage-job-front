// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import {
  buildExperienceFromModalValues,
  buildFormationFromModalValues,
  removeAtIndex,
  removeById,
  replaceAtIndex,
  upsertById,
} from '../experienceFormation.utils';

const baseValues = {
  title: 'Dev',
  location: ' Paris ',
  company: 'ACME',
  startDate: '2020-01-01',
  endDate: '',
  description: '   ',
  skills: [
    { value: 's1', label: 'React' },
    { value: 's2', label: '' },
  ],
};

describe('buildExperienceFromModalValues', () => {
  it('trims strings and turns blank values into undefined', () => {
    const result = buildExperienceFromModalValues(baseValues);
    expect(result.location).toBe('Paris');
    expect(result.endDate).toBeUndefined();
    expect(result.description).toBeUndefined();
    expect(result.id).toBeUndefined();
  });

  it('maps skills to names only by default', () => {
    const result = buildExperienceFromModalValues(baseValues);
    expect(result.skills).toEqual([{ name: 'React' }, { name: 's2' }]);
  });

  it('keeps skill ids when includeSkillId is set', () => {
    const result = buildExperienceFromModalValues(baseValues, {
      includeSkillId: true,
    });
    expect(result.skills).toEqual([
      { id: 's1', name: 'React' },
      { id: 's2', name: 's2' },
    ]);
  });

  it('falls back to the base values when the form values are blank', () => {
    const result = buildExperienceFromModalValues(
      { ...baseValues, title: '', endDate: '', description: '' },
      {
        base: {
          id: 'base-id',
          title: 'Old title',
          endDate: '2021-01-01',
          description: 'Old description',
        },
      }
    );
    expect(result.id).toBe('base-id');
    expect(result.title).toBe('Old title');
    expect(result.endDate).toBe('2021-01-01');
    expect(result.description).toBe('Old description');
  });

  it('prefers the explicit id over the base id', () => {
    const result = buildExperienceFromModalValues(baseValues, {
      id: 'explicit',
      base: { id: 'base' },
    });
    expect(result.id).toBe('explicit');
  });

  it('returns an empty skills array when skills are missing', () => {
    const result = buildExperienceFromModalValues({
      ...baseValues,
      skills: undefined as never,
    });
    expect(result.skills).toEqual([]);
  });
});

describe('buildFormationFromModalValues', () => {
  const values = {
    title: 'Master',
    location: 'Lyon',
    institution: ' Univ ',
    startDate: '2015-09-01',
    endDate: '2018-06-01',
    description: 'desc',
    skills: [{ value: 'a', label: 'Maths' }],
  };

  it('builds a formation with trimmed institution', () => {
    const result = buildFormationFromModalValues(values, { id: 'f1' });
    expect(result).toMatchObject({
      id: 'f1',
      title: 'Master',
      institution: 'Univ',
      skills: [{ name: 'Maths' }],
    });
  });

  it('falls back to the base institution when blank', () => {
    const result = buildFormationFromModalValues(
      { ...values, institution: '' },
      { base: { institution: 'Base univ' }, includeSkillId: true }
    );
    expect(result.institution).toBe('Base univ');
    expect(result.skills).toEqual([{ id: 'a', name: 'Maths' }]);
  });
});

describe('array helpers', () => {
  it('upsertById appends when the item has no id or is unknown', () => {
    expect(upsertById([{ id: '1' }], {})).toEqual([{ id: '1' }, {}]);
    expect(upsertById([{ id: '1' }], { id: '2' })).toEqual([
      { id: '1' },
      { id: '2' },
    ]);
  });

  it('upsertById replaces the item with the same id', () => {
    const items = [
      { id: '1', n: 1 },
      { id: '2', n: 2 },
    ];
    expect(upsertById(items, { id: '2', n: 9 })).toEqual([
      { id: '1', n: 1 },
      { id: '2', n: 9 },
    ]);
  });

  it('removeById removes the matching item and ignores a missing id', () => {
    const items = [{ id: '1' }, { id: '2' }];
    expect(removeById(items, '1')).toEqual([{ id: '2' }]);
    expect(removeById(items)).toBe(items);
  });

  it('replaceAtIndex does not mutate the input', () => {
    const items = ['a', 'b', 'c'];
    expect(replaceAtIndex(items, 1, 'x')).toEqual(['a', 'x', 'c']);
    expect(items).toEqual(['a', 'b', 'c']);
  });

  it('removeAtIndex removes only the given index', () => {
    expect(removeAtIndex(['a', 'b', 'c'], 0)).toEqual(['b', 'c']);
  });
});
