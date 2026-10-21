jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('@/src/hooks/current-user/useCurrentUserProfileComplete', () => ({
  useCurrentUserProfileComplete: jest.fn(),
}));
jest.mock('../ProfileLivePreview/ProfileLivePreviewPanel', () => ({
  ProfileLivePreviewPanel: () => <div data-testid="live-preview" />,
}));
jest.mock('./StepPhotoContent', () => ({
  StepPhotoContent: () => <div data-testid="photo-content" />,
}));
jest.mock('./StepCvChoiceContent', () => ({
  StepCvChoiceContent: () => <div data-testid="cv-choice-content" />,
}));
jest.mock('./StepExperiencesContent', () => ({
  StepExperiencesContent: () => <div data-testid="experiences-content" />,
}));
jest.mock('./StepFormationsContent', () => ({
  StepFormationsContent: () => <div data-testid="formations-content" />,
}));

import { act, renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React, { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { User } from '@/src/api/types';
import { UserRoles } from '@/src/constants/users';
import { useCurrentUserProfileComplete } from '@/src/hooks/current-user/useCurrentUserProfileComplete';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { currentUserActions } from '@/src/use-cases/current-user';
import { slice as currentUserSlice } from '@/src/use-cases/current-user/current-user.slice';
import { useStepCvChoice } from './useStepCvChoice';
import { useStepExperiences } from './useStepExperiences';
import { useStepFormations } from './useStepFormations';
import { useStepPhoto } from './useStepPhoto';

const mockedApi = getMockedApi();
const mockProfileComplete = useCurrentUserProfileComplete as jest.Mock;

const USER = { id: 'user-1', role: UserRoles.CANDIDATE } as unknown as User;

function setup<T>(
  useHook: () => T,
  profileComplete: any = { experiences: [], formations: [] }
) {
  mockProfileComplete.mockReturnValue(profileComplete);
  const store = createTestStore({
    currentUser: {
      ...currentUserSlice.getInitialState(),
      profileComplete,
    } as never,
  });
  const dispatch = jest.spyOn(store, 'dispatch');
  const hook = renderHook(useHook, {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });
  return { store, dispatch, ...hook };
}

const contentProps = (content: React.ReactNode): any =>
  ((content as ReactElement).props as { children: ReactElement }).children
    .props;

describe('profile completion step hooks', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('useStepPhoto', () => {
    it('words the description for the role of the user', () => {
      const candidate = setup(() => useStepPhoto({ user: USER }));
      expect(
        candidate.result.current.onboardingStepPhoto.description
      ).toContain('coachs');
      const coach = setup(() =>
        useStepPhoto({ user: { ...USER, role: UserRoles.COACH } as User })
      );
      expect(coach.result.current.onboardingStepPhoto.description).toContain(
        'personnes que vous soutenez'
      );
    });

    it('is completed once the user has a picture', async () => {
      const without = setup(() => useStepPhoto({ user: USER }), {
        hasPicture: false,
      });
      expect(
        await without.result.current.onboardingStepPhoto.isStepCompleted?.()
      ).toBe(false);
      const withPicture = setup(() => useStepPhoto({ user: USER }), {
        hasPicture: true,
      });
      expect(
        await withPicture.result.current.onboardingStepPhoto.isStepCompleted?.()
      ).toBe(true);
    });

    it('lets the user move on without picking a photo', async () => {
      const { result, dispatch } = setup(() => useStepPhoto({ user: USER }));
      const step = result.current.onboardingStepPhoto;
      expect(step.isNextEnabled).toBe(true);
      expect(await step.onSubmit?.()).toBe(true);
      expect(
        dispatch.mock.calls.filter(
          ([action]: any) =>
            action.type ===
            currentUserActions.updateUserProfilePictureRequested.type
        )
      ).toHaveLength(0);
    });

    it('uploads the selected photo on submit', async () => {
      const { result, dispatch } = setup(() => useStepPhoto({ user: USER }));
      const blob = new Blob(['x']);
      act(() => {
        contentProps(
          result.current.onboardingStepPhoto.content
        ).onPhotoSelected(blob, 'blob:preview');
      });
      expect(
        contentProps(result.current.onboardingStepPhoto.content).photoObjectUrl
      ).toBe('blob:preview');

      expect(await result.current.onboardingStepPhoto.onSubmit?.()).toBe(true);
      expect(dispatch).toHaveBeenCalledWith(
        currentUserActions.updateUserProfilePictureRequested({
          profileImage: blob,
        })
      );
    });
  });

  describe('useStepCvChoice', () => {
    it('words the title for the role of the user', () => {
      const candidate = setup(() =>
        useStepCvChoice({
          user: USER,
          requestAdvanceWithProfileMode: jest.fn(),
        })
      );
      expect(candidate.result.current.onboardingStepCvChoice.title).toContain(
        'coachs'
      );
      const coach = setup(() =>
        useStepCvChoice({
          user: { ...USER, role: UserRoles.COACH } as User,
          requestAdvanceWithProfileMode: jest.fn(),
        })
      );
      expect(coach.result.current.onboardingStepCvChoice.title).toContain(
        'personnes que vous soutenez'
      );
    });

    it('uploads the CV and advances on the CV path', () => {
      mockedApi.postExternalCv.mockResolvedValue({ data: {} } as never);
      const advance = jest.fn();
      const { result, dispatch } = setup(() =>
        useStepCvChoice({ user: USER, requestAdvanceWithProfileMode: advance })
      );
      const formData = new FormData();
      contentProps(result.current.onboardingStepCvChoice.content).onCvSelected(
        formData
      );
      expect(dispatch).toHaveBeenCalledWith(
        currentUserActions.uploadExternalCvRequested({ formData })
      );
      expect(advance).toHaveBeenCalledWith('cv-choice', 'cv');
    });

    it('advances on the manual path', () => {
      const advance = jest.fn();
      const { result } = setup(() =>
        useStepCvChoice({ user: USER, requestAdvanceWithProfileMode: advance })
      );
      contentProps(
        result.current.onboardingStepCvChoice.content
      ).onManualChoice();
      expect(advance).toHaveBeenCalledWith('cv-choice', 'manual');
    });

    [
      [{ hasExternalCv: true }, true],
      [{ experiences: [{ id: 'e' }] }, true],
      [{ formations: [{ id: 'f' }] }, true],
      [{ experiences: [], formations: [], hasExternalCv: false }, false],
      [null, false],
    ].forEach(([profile, expected]) => {
      it(`is ${expected ? '' : 'not '}completed for ${JSON.stringify(profile)}`, async () => {
        const { result } = setup(
          () =>
            useStepCvChoice({
              user: USER,
              requestAdvanceWithProfileMode: jest.fn(),
            }),
          profile
        );
        expect(
          await result.current.onboardingStepCvChoice.isStepCompleted?.()
        ).toBe(expected);
        expect(result.current.onboardingStepCvChoice.isNextEnabled).toBe(false);
      });
    });
  });

  [
    {
      name: 'useStepExperiences',
      key: 'experiences' as const,
      stepKey: 'onboardingStepExperiences' as const,
      useHook: (user: User | null) => useStepExperiences({ user }),
      item: { id: 'e1', title: 'Cariste' },
      contentProp: 'experiences',
    },
    {
      name: 'useStepFormations',
      key: 'formations' as const,
      stepKey: 'onboardingStepFormations' as const,
      useHook: (user: User | null) => useStepFormations({ user }),
      item: { id: 'f1', title: 'CAP' },
      contentProp: 'formations',
    },
  ].forEach(({ name, key, stepKey, useHook, item, contentProp }) => {
    describe(name, () => {
      const profile = { experiences: [], formations: [] };

      it('starts from the items of the profile', () => {
        const { result } = setup(() => useHook(USER), {
          ...profile,
          [key]: [item],
        });
        expect(
          contentProps((result.current as any)[stepKey].content)[contentProp]
        ).toEqual([item]);
      });

      it('is completed once the profile has at least one item', async () => {
        const empty = setup(() => useHook(USER), profile);
        expect(
          await (empty.result.current as any)[stepKey].isStepCompleted()
        ).toBe(false);
        const filled = setup(() => useHook(USER), {
          ...profile,
          [key]: [item],
        });
        expect(
          await (filled.result.current as any)[stepKey].isStepCompleted()
        ).toBe(true);
      });

      it('keeps the draft in the store when the items change', () => {
        const { result, store } = setup(() => useHook(USER), profile);
        act(() => {
          contentProps((result.current as any)[stepKey].content).onChange([
            item,
          ]);
        });
        expect(store.getState().currentUser.profileComplete?.[key]).toEqual([
          item,
        ]);
        expect(
          contentProps((result.current as any)[stepKey].content)[contentProp]
        ).toEqual([item]);
      });

      it('refuses to advance without a user', async () => {
        const { result } = setup(() => useHook(null), profile);
        expect(await (result.current as any)[stepKey].onSubmit()).toBe(false);
        expect(mockedApi.putUserProfile).not.toHaveBeenCalled();
      });

      it('saves the items and lets the wizard advance', async () => {
        mockedApi.putUserProfile.mockResolvedValue({ data: {} } as never);
        const { result } = setup(() => useHook(USER), {
          ...profile,
          [key]: [item],
        });
        let outcome: boolean | undefined;
        await act(async () => {
          outcome = await (result.current as any)[stepKey].onSubmit();
          await flushPromises();
        });
        expect(mockedApi.putUserProfile).toHaveBeenCalledWith('user-1', {
          [key]: [item],
        });
        expect(outcome).toBe(true);
      });

      it('blocks the wizard and shows an error when saving fails', async () => {
        mockedApi.putUserProfile.mockRejectedValue(new Error('boom'));
        const { result, store } = setup(() => useHook(USER), {
          ...profile,
          [key]: [item],
        });
        let outcome: boolean | undefined;
        await act(async () => {
          outcome = await (result.current as any)[stepKey].onSubmit();
          await flushPromises();
        });
        expect(outcome).toBe(false);
        expect(store.getState().onboarding.formErrorMessage).toBe(
          'Une erreur est survenue lors de la sauvegarde. Veuillez réessayer.'
        );
      });
    });
  });
});
