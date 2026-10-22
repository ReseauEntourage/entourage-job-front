import { renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { openModal } from '@/src/features/modals/Modal';
import {
  useEditableExperiencesById,
  useEditableExperiencesByIndex,
} from '../useEditableExperiences';
import {
  useEditableFormationsById,
  useEditableFormationsByIndex,
} from '../useEditableFormations';

jest.mock('@/src/features/modals/Modal', () => ({ openModal: jest.fn() }));
// The modal components are only inspected as elements, never rendered.
jest.mock(
  '@/src/features/profile/ProfilePartCards/ProfileExperiences/ProfileExperiencesModalEdit/ProfileExperiencesModalEdit',
  () => ({ ProfileExperiencesModalEdit: () => null })
);
jest.mock(
  '@/src/features/profile/ProfilePartCards/ProfileFormations/ProfileFormationsModalEdit/ProfileFormationsModalEdit',
  () => ({ ProfileFormationsModalEdit: () => null })
);

const mockOpenModal = openModal as jest.Mock;

const openedProps = () =>
  mockOpenModal.mock.calls[mockOpenModal.mock.calls.length - 1][0].props;

const values = {
  title: 'New',
  location: '',
  company: 'Co',
  institution: 'School',
  startDate: '2020-01-01',
  endDate: '',
  description: '',
  skills: [{ value: 's', label: 'Skill' }],
};

describe('useEditableExperiencesById', () => {
  const experiences = [
    { id: '1', title: 'One' },
    { id: '2', title: 'Two' },
  ] as never[];

  beforeEach(() => mockOpenModal.mockClear());

  it('opens an empty modal on add and appends the new experience', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() =>
      useEditableExperiencesById({
        experiences,
        onChange,
        includeSkillId: false,
      })
    );
    result.current.addExperience();
    expect(openedProps().experience).toBeUndefined();
    openedProps().dispatchOnSubmit(values);
    const next = onChange.mock.calls[0][0];
    expect(next).toHaveLength(3);
    expect(next[2]).toMatchObject({ title: 'New', company: 'Co' });
  });

  it('opens the modal with the existing experience and replaces it on submit', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() =>
      useEditableExperiencesById({
        experiences,
        onChange,
        includeSkillId: true,
      })
    );
    result.current.editExperience('2');
    expect(openedProps().experience).toBe(experiences[1]);
    openedProps().dispatchOnSubmit(values);
    const next = onChange.mock.calls[0][0];
    expect(next).toHaveLength(2);
    expect(next[1]).toMatchObject({
      id: '2',
      title: 'New',
      skills: [{ id: 's', name: 'Skill' }],
    });
  });

  it('deletes by id', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() =>
      useEditableExperiencesById({
        experiences,
        onChange,
        includeSkillId: false,
      })
    );
    result.current.deleteExperience('1');
    expect(onChange).toHaveBeenCalledWith([experiences[1]]);
  });
});

describe('useEditableExperiencesByIndex', () => {
  const experiences = [{ title: 'One' }, { title: 'Two' }] as never[];

  beforeEach(() => mockOpenModal.mockClear());

  it('appends on add', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() =>
      useEditableExperiencesByIndex({
        experiences,
        onChange,
        includeSkillId: false,
      })
    );
    result.current.addExperience();
    openedProps().dispatchOnSubmit(values);
    expect(onChange.mock.calls[0][0]).toHaveLength(3);
  });

  it('replaces at the given index on edit', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() =>
      useEditableExperiencesByIndex({
        experiences,
        onChange,
        includeSkillId: false,
      })
    );
    result.current.editExperience(0);
    expect(openedProps().experience).toBe(experiences[0]);
    openedProps().dispatchOnSubmit(values);
    const next = onChange.mock.calls[0][0];
    expect(next[0].title).toBe('New');
    expect(next[1]).toBe(experiences[1]);
  });

  it('deletes by index', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() =>
      useEditableExperiencesByIndex({
        experiences,
        onChange,
        includeSkillId: false,
      })
    );
    result.current.deleteExperience(0);
    expect(onChange).toHaveBeenCalledWith([experiences[1]]);
  });
});

describe('useEditableFormationsById', () => {
  const formations = [
    { id: '1', title: 'One' },
    { id: '2', title: 'Two' },
  ] as never[];

  beforeEach(() => mockOpenModal.mockClear());

  it('adds, edits and deletes formations by id', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() =>
      useEditableFormationsById({
        formations,
        onChange,
        includeSkillId: false,
      })
    );

    result.current.addFormation();
    expect(openedProps().formation).toBeUndefined();
    openedProps().dispatchOnSubmit(values);
    expect(onChange.mock.calls[0][0]).toHaveLength(3);
    expect(onChange.mock.calls[0][0][2]).toMatchObject({
      institution: 'School',
    });

    result.current.editFormation('1');
    expect(openedProps().formation).toBe(formations[0]);
    openedProps().dispatchOnSubmit(values);
    expect(onChange.mock.calls[1][0][0]).toMatchObject({
      id: '1',
      title: 'New',
    });

    result.current.deleteFormation('2');
    expect(onChange.mock.calls[2][0]).toEqual([formations[0]]);
  });
});

describe('useEditableFormationsByIndex', () => {
  const formations = [{ title: 'One' }, { title: 'Two' }] as never[];

  beforeEach(() => mockOpenModal.mockClear());

  it('adds, edits and deletes formations by index', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() =>
      useEditableFormationsByIndex({
        formations,
        onChange,
        includeSkillId: false,
      })
    );

    result.current.addFormation();
    openedProps().dispatchOnSubmit(values);
    expect(onChange.mock.calls[0][0]).toHaveLength(3);

    result.current.editFormation(1);
    expect(openedProps().formation).toBe(formations[1]);
    openedProps().dispatchOnSubmit(values);
    expect(onChange.mock.calls[1][0][1].title).toBe('New');
    expect(onChange.mock.calls[1][0][0]).toBe(formations[0]);

    result.current.deleteFormation(0);
    expect(onChange.mock.calls[2][0]).toEqual([formations[1]]);
  });
});
