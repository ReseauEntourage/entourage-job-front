import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { ProfileCustomNudgesModalEdit } from './ProfileCustomNudges/ProfileCustomNudgesModalEdit/ProfileCustomNudgesModalEdit';
import { ProfileDocumentsModalEdit } from './ProfileDocuments/ProfileDocumentsModalEdit/ProfileDocumentsModalEdit';
import { ProfileExperiencesModalEdit } from './ProfileExperiences/ProfileExperiencesModalEdit/ProfileExperiencesModalEdit';
import { ProfileFormationsModalEdit } from './ProfileFormations/ProfileFormationsModalEdit/ProfileFormationsModalEdit';
import { ProfileInterestsModalEdit } from './ProfileInterests/ProfileInterestsModalEdit/ProfileInterestsModalEdit';
import { ProfileLanguagesModalEdit } from './ProfileLanguages/ProfileLanguagesModalEdit/ProfileLanguagesModalEdit';

let mockEditProps: any;
jest.mock('@/src/features/modals/Modal/ModalGeneric/ModalEdit', () => ({
  ModalEdit: (props: any) => {
    mockEditProps = props;
    return (
      <div>
        <h1>{props.title}</h1>
        <button onClick={() => props.onSubmit({ submitted: true })}>
          submit
        </button>
      </div>
    );
  },
}));

const submitAndExpectClose = (dispatchOnSubmit: jest.Mock) => {
  expect(mockEditProps.closeOnNextRender).toBe(false);
  fireEvent.click(screen.getByText('submit'));
  expect(dispatchOnSubmit).toHaveBeenCalledWith({ submitted: true });
  expect(mockEditProps.closeOnNextRender).toBe(true);
};

describe('profile edition modals', () => {
  const dispatchOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ProfileFormationsModalEdit', () => {
    it('is empty for a new formation', () => {
      render(
        <ProfileFormationsModalEdit dispatchOnSubmit={dispatchOnSubmit} />
      );

      expect(mockEditProps.defaultValues).toEqual({
        title: '',
        location: '',
        institution: '',
        startDate: '',
        endDate: '',
        description: '',
        skills: [],
      });
    });

    it('is prefilled from an existing formation, with ISO dates and skills as options', () => {
      render(
        <ProfileFormationsModalEdit
          dispatchOnSubmit={dispatchOnSubmit}
          formation={
            {
              title: 'Master',
              location: 'Lyon',
              institution: 'Univ',
              startDate: '2020-09-01T00:00:00.000Z',
              endDate: '2022-06-30T12:00:00.000Z',
              description: 'desc',
              skills: [{ name: 'Maths' }],
            } as any
          }
        />
      );

      expect(mockEditProps.defaultValues).toEqual(
        expect.objectContaining({
          title: 'Master',
          institution: 'Univ',
          startDate: '2020-09-01',
          endDate: '2022-06-30',
          skills: [{ value: 'Maths', label: 'Maths' }],
        })
      );
    });

    it('submits then closes on next render', () => {
      render(
        <ProfileFormationsModalEdit dispatchOnSubmit={dispatchOnSubmit} />
      );

      submitAndExpectClose(dispatchOnSubmit);
    });
  });

  describe('ProfileExperiencesModalEdit', () => {
    it('is empty for a new experience', () => {
      render(
        <ProfileExperiencesModalEdit dispatchOnSubmit={dispatchOnSubmit} />
      );

      expect(mockEditProps.defaultValues).toEqual(
        expect.objectContaining({ title: '', company: '', skills: [] })
      );
    });

    it('is prefilled from an existing experience', () => {
      render(
        <ProfileExperiencesModalEdit
          dispatchOnSubmit={dispatchOnSubmit}
          experience={
            {
              title: 'Dev',
              company: 'Acme',
              startDate: '2021-01-15T00:00:00.000Z',
              skills: [{ name: 'JS' }],
            } as any
          }
        />
      );

      expect(mockEditProps.defaultValues).toEqual(
        expect.objectContaining({
          title: 'Dev',
          company: 'Acme',
          startDate: '2021-01-15',
          endDate: '',
          skills: [{ value: 'JS', label: 'JS' }],
        })
      );
    });

    it('submits then closes on next render', () => {
      render(
        <ProfileExperiencesModalEdit dispatchOnSubmit={dispatchOnSubmit} />
      );

      submitAndExpectClose(dispatchOnSubmit);
    });
  });

  describe('ProfileLanguagesModalEdit', () => {
    it('maps the profile languages to select options', () => {
      render(
        <ProfileLanguagesModalEdit
          dispatchOnSubmit={dispatchOnSubmit}
          userProfileLanguages={[
            { language: { id: 'l1', name: 'Français' } } as any,
          ]}
        />
      );

      expect(mockEditProps.defaultValues).toEqual({
        languages: [{ value: 'l1', label: 'Français' }],
      });
    });

    it('submits then closes on next render', () => {
      render(
        <ProfileLanguagesModalEdit
          dispatchOnSubmit={dispatchOnSubmit}
          userProfileLanguages={[]}
        />
      );

      submitAndExpectClose(dispatchOnSubmit);
    });
  });

  describe('ProfileInterestsModalEdit', () => {
    it('lists the interests sorted by their order', () => {
      render(
        <ProfileInterestsModalEdit
          dispatchOnSubmit={dispatchOnSubmit}
          interests={
            [
              { id: '2', name: 'Cuisine', order: 2 },
              { id: '1', name: 'Sport', order: 1 },
            ] as any
          }
        />
      );

      expect(mockEditProps.defaultValues.interests).toEqual([
        { value: 'Sport', label: 'Sport' },
        { value: 'Cuisine', label: 'Cuisine' },
      ]);
    });

    it('is empty without interests', () => {
      render(
        <ProfileInterestsModalEdit
          dispatchOnSubmit={dispatchOnSubmit}
          interests={[]}
        />
      );

      expect(mockEditProps.defaultValues).toEqual({ interests: [] });
    });

    it('submits then closes on next render', () => {
      render(
        <ProfileInterestsModalEdit
          dispatchOnSubmit={dispatchOnSubmit}
          interests={[]}
        />
      );

      submitAndExpectClose(dispatchOnSubmit);
    });
  });

  describe('ProfileDocumentsModalEdit', () => {
    it('prefills the LinkedIn URL when there is one', () => {
      render(
        <ProfileDocumentsModalEdit
          dispatchOnSubmit={dispatchOnSubmit}
          linkedinUrl="https://linkedin.com/in/x"
        />
      );

      expect(mockEditProps.defaultValues).toEqual({
        linkedinUrl: 'https://linkedin.com/in/x',
      });
    });

    it('leaves the LinkedIn URL undefined otherwise, and submits then closes', () => {
      render(<ProfileDocumentsModalEdit dispatchOnSubmit={dispatchOnSubmit} />);

      expect(mockEditProps.defaultValues).toEqual({ linkedinUrl: undefined });
      submitAndExpectClose(dispatchOnSubmit);
    });
  });

  describe('ProfileCustomNudgesModalEdit', () => {
    it('asks a candidate to detail their needs, prefilled with the current content', () => {
      render(
        <ProfileCustomNudgesModalEdit
          dispatchOnSubmit={dispatchOnSubmit}
          customNudge={{ content: 'mon besoin' } as any}
          role={UserRoles.CANDIDATE}
        />
      );

      expect(
        screen.getByText('Détaillez vos besoins d’accompagnement')
      ).toBeInTheDocument();
      expect(mockEditProps.defaultValues).toEqual({ content: 'mon besoin' });
    });

    it('asks a coach to detail their offers, with an empty default when none', () => {
      render(
        <ProfileCustomNudgesModalEdit
          dispatchOnSubmit={dispatchOnSubmit}
          customNudge={undefined as any}
          role={UserRoles.COACH}
        />
      );

      expect(
        screen.getByText('Détaillez vos offres d’accompagnement')
      ).toBeInTheDocument();
      expect(mockEditProps.defaultValues).toEqual({ content: '' });
    });

    it('uses a different form schema per role, and submits then closes', () => {
      const { unmount } = render(
        <ProfileCustomNudgesModalEdit
          dispatchOnSubmit={dispatchOnSubmit}
          customNudge={{ content: '' } as any}
          role={UserRoles.CANDIDATE}
        />
      );
      const candidateSchema = mockEditProps.formSchema;
      unmount();
      render(
        <ProfileCustomNudgesModalEdit
          dispatchOnSubmit={dispatchOnSubmit}
          customNudge={{ content: '' } as any}
          role={UserRoles.COACH}
        />
      );

      expect(mockEditProps.formSchema).not.toBe(candidateSchema);
      submitAndExpectClose(dispatchOnSubmit);
    });
  });
});
