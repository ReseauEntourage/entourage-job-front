import { act, render } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';

import { UserRoles } from '@/src/constants/users';
import { ProfileCustomNudgesModalEdit } from '../ProfileCustomNudges/ProfileCustomNudgesModalEdit/ProfileCustomNudgesModalEdit';
import { ProfileDocumentsModalEdit } from '../ProfileDocuments/ProfileDocumentsModalEdit/ProfileDocumentsModalEdit';
import { ProfileExperiencesModalEdit } from '../ProfileExperiences/ProfileExperiencesModalEdit/ProfileExperiencesModalEdit';
import { ProfileFormationsModalEdit } from '../ProfileFormations/ProfileFormationsModalEdit/ProfileFormationsModalEdit';
import { ProfileInterestsModalEdit } from '../ProfileInterests/ProfileInterestsModalEdit/ProfileInterestsModalEdit';
import { ProfileLanguagesModalEdit } from '../ProfileLanguages/ProfileLanguagesModalEdit/ProfileLanguagesModalEdit';
import { ProfileSkillsModalEdit } from '../ProfileSkills/ProfileSkillsModalEdit/ProfileSkillsModalEdit';

// ModalEdit pulls the whole form stack: stub it and capture its props.
const mockModalEdit = jest.fn();
jest.mock('@/src/features/modals/Modal/ModalGeneric/ModalEdit', () => ({
  ModalEdit: (props: unknown) => {
    mockModalEdit(props);
    return null;
  },
}));

const lastProps = () =>
  mockModalEdit.mock.calls[mockModalEdit.mock.calls.length - 1][0];

describe('profile ModalEdit wrappers', () => {
  beforeEach(() => {
    mockModalEdit.mockClear();
  });

  it('ProfileSkillsModalEdit maps skills to default values and forwards submit', () => {
    const dispatchOnSubmit = jest.fn();
    render(
      <ProfileSkillsModalEdit
        dispatchOnSubmit={dispatchOnSubmit}
        skills={[{ name: 'React' } as never]}
      />
    );
    expect(lastProps().title).toBe('Compétences clés');
    expect(lastProps().defaultValues).toEqual({
      skills: [{ value: 'React', label: 'React' }],
    });
    expect(lastProps().closeOnNextRender).toBe(false);
  });

  it('closes the modal after submit (closeOnNextRender becomes true)', () => {
    const dispatchOnSubmit = jest.fn();
    render(
      <ProfileSkillsModalEdit dispatchOnSubmit={dispatchOnSubmit} skills={[]} />
    );
    const fields = { skills: [{ value: 'a', label: 'a' }] };
    act(() => {
      lastProps().onSubmit(fields);
    });
    expect(dispatchOnSubmit).toHaveBeenCalledWith(fields);
    expect(lastProps().closeOnNextRender).toBe(true);
  });

  it('ProfileInterestsModalEdit sorts interests by order', () => {
    render(
      <ProfileInterestsModalEdit
        dispatchOnSubmit={jest.fn()}
        interests={
          [
            { id: '1', name: 'Second', order: 1 },
            { id: '2', name: 'First', order: 0 },
          ] as never
        }
      />
    );
    expect(lastProps().title).toBe("Centres d'intérêt");
    expect(lastProps().defaultValues.interests.map((i) => i.value)).toEqual([
      'First',
      'Second',
    ]);
  });

  it('ProfileInterestsModalEdit defaults to an empty list', () => {
    render(
      <ProfileInterestsModalEdit dispatchOnSubmit={jest.fn()} interests={[]} />
    );
    expect(lastProps().defaultValues).toEqual({ interests: [] });
  });

  it('ProfileLanguagesModalEdit maps languages to default values', () => {
    render(
      <ProfileLanguagesModalEdit
        dispatchOnSubmit={jest.fn()}
        userProfileLanguages={
          [{ language: { id: 'fr', name: 'Français' } }] as never
        }
      />
    );
    expect(lastProps().title).toBe('Langues parlées');
    expect(lastProps().defaultValues).toEqual({
      languages: [{ value: 'fr', label: 'Français' }],
    });
  });

  it('ProfileCustomNudgesModalEdit picks title and schema by role', () => {
    const { rerender } = render(
      <ProfileCustomNudgesModalEdit
        dispatchOnSubmit={jest.fn()}
        customNudge={{ content: 'hello' } as never}
        role={UserRoles.CANDIDATE}
      />
    );
    const candidateProps = lastProps();
    expect(candidateProps.title).toBe('Détaillez vos besoins d’accompagnement');
    expect(candidateProps.defaultValues).toEqual({ content: 'hello' });

    rerender(
      <ProfileCustomNudgesModalEdit
        dispatchOnSubmit={jest.fn()}
        customNudge={undefined as never}
        role={UserRoles.COACH}
      />
    );
    expect(lastProps().title).toBe('Détaillez vos offres d’accompagnement');
    expect(lastProps().defaultValues).toEqual({ content: '' });
    expect(lastProps().formSchema).not.toBe(candidateProps.formSchema);
  });

  it('ProfileDocumentsModalEdit prefills the LinkedIn url', () => {
    render(
      <ProfileDocumentsModalEdit
        dispatchOnSubmit={jest.fn()}
        linkedinUrl="https://linkedin.com/in/x"
      />
    );
    expect(lastProps().title).toBe('Mes liens et documents');
    expect(lastProps().defaultValues).toEqual({
      linkedinUrl: 'https://linkedin.com/in/x',
    });
  });

  it('ProfileDocumentsModalEdit leaves the url undefined when absent', () => {
    render(<ProfileDocumentsModalEdit dispatchOnSubmit={jest.fn()} />);
    expect(lastProps().defaultValues).toEqual({ linkedinUrl: undefined });
  });

  it('ProfileExperiencesModalEdit formats dates and maps skills', () => {
    render(
      <ProfileExperiencesModalEdit
        dispatchOnSubmit={jest.fn()}
        experience={
          {
            title: 'Dev',
            company: 'ACME',
            startDate: '2020-03-15T00:00:00.000Z',
            skills: [{ name: 'TS' }],
          } as never
        }
      />
    );
    expect(lastProps().title).toBe("Editer l'expérience");
    expect(lastProps().defaultValues).toMatchObject({
      title: 'Dev',
      company: 'ACME',
      location: '',
      endDate: '',
      skills: [{ value: 'TS', label: 'TS' }],
    });
    expect(lastProps().defaultValues.startDate).toMatch(/^2020-03-1[456]$/);
  });

  it('ProfileExperiencesModalEdit uses empty defaults for a new experience', () => {
    render(<ProfileExperiencesModalEdit dispatchOnSubmit={jest.fn()} />);
    expect(lastProps().defaultValues).toEqual({
      title: '',
      location: '',
      company: '',
      startDate: '',
      endDate: '',
      description: '',
      skills: [],
    });
  });

  it('ProfileFormationsModalEdit uses empty defaults for a new formation', () => {
    render(<ProfileFormationsModalEdit dispatchOnSubmit={jest.fn()} />);
    expect(lastProps().defaultValues).toMatchObject({
      title: '',
      institution: '',
      skills: [],
    });
  });
});
