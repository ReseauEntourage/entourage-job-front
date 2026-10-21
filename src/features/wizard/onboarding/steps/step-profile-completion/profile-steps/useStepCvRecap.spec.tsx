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
const mockRecapProps: { current: any } = { current: null };
jest.mock('./StepCvRecapContent', () => {
  const { useFormContext } = require('react-hook-form');
  return {
    StepCvRecapContent: (props: any) => {
      mockRecapProps.current = props;
      const { setValue } = useFormContext();
      return (
        <div>
          <button
            data-testid="set-description"
            onClick={() => setValue('description', 'Nouvelle description')}
          />
          <button
            data-testid="set-skills"
            onClick={() =>
              setValue('skills', [{ value: 'js', label: 'JS' }, null])
            }
          />
          <button
            data-testid="set-languages"
            onClick={() =>
              setValue('languages', [{ value: 'l1', label: 'Français' }])
            }
          />
          <button
            data-testid="set-interests"
            onClick={() =>
              setValue('interests', [
                { value: 'foot', label: 'Foot' },
                { value: 'chess', label: 'Échecs' },
              ])
            }
          />
        </div>
      );
    },
  };
});

import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Provider } from 'react-redux';
import { User } from '@/src/api/types';
import { UserRoles } from '@/src/constants/users';
import { useCurrentUserProfileComplete } from '@/src/hooks/current-user/useCurrentUserProfileComplete';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { slice as currentUserSlice } from '@/src/use-cases/current-user/current-user.slice';
import { useStepCvRecap } from './useStepCvRecap';

const mockedApi = getMockedApi();
const USER = { id: 'user-1', role: UserRoles.COACH } as unknown as User;

const fullProfile = {
  description: 'Ma description',
  hasExternalCv: true,
  experiences: [{ id: 'e1', title: 'Cariste' }],
  formations: [{ id: 'f1', title: 'CAP' }],
  skills: [{ name: 'Rigueur' }],
  userProfileLanguages: [
    { language: { id: 'l1', name: 'Français' } },
    { language: { id: null, name: 'Sans id' } },
  ],
  interests: [
    { name: 'Échecs', order: 1 },
    { name: 'Foot', order: 0 },
  ],
};

function setup(profile: any, user: User | null = USER) {
  (useCurrentUserProfileComplete as jest.Mock).mockReturnValue(profile);
  const store = createTestStore({
    currentUser: {
      ...currentUserSlice.getInitialState(),
      profileComplete: profile,
    } as never,
  });
  const stepRef: { current: ReturnType<typeof useStepCvRecap> | null } = {
    current: null,
  };
  // The step content is re-created on every render of the hook, so it is
  // rendered by the component that owns the hook, like the wizard does.
  const Harness = () => {
    const step = useStepCvRecap({ user });
    stepRef.current = step;
    return <>{step.onboardingStepCvRecap.content}</>;
  };
  render(
    <Provider store={store}>
      <Harness />
    </Provider>
  );
  return {
    store,
    step: () => stepRef.current!.onboardingStepCvRecap,
  };
}

describe('useStepCvRecap', () => {
  beforeEach(() => jest.clearAllMocks());

  it('describes a profile step with a live preview', () => {
    const current = setup(fullProfile).step();
    expect(current.id).toBe('cv-recap');
    expect(current.title).toBe('Vérifiez et complétez votre profil');
    expect(current.mobileBottomSheet).toBe(false);
    expect(current.sidePanelContent).toBeDefined();
  });

  it('is completed only when an external CV was imported', async () => {
    const withCv = setup(fullProfile);
    expect(await withCv.step().isStepCompleted?.()).toBe(true);
    const without = setup({ ...fullProfile, hasExternalCv: false });
    expect(await without.step().isStepCompleted?.()).toBe(false);
    const none = setup(null);
    expect(await none.step().isStepCompleted?.()).toBe(false);
  });

  it('pre-fills the form from the profile generated out of the CV', async () => {
    const { step } = setup(fullProfile);
    const props = mockRecapProps.current;
    expect(props.userRole).toBe(UserRoles.COACH);
    expect(props.experiences).toEqual(fullProfile.experiences);
    expect(props.formations).toEqual(fullProfile.formations);
    await waitFor(() => expect(step().isNextEnabled).toBe(true));
  });

  it('starts empty without profile', () => {
    setup(null);
    expect(mockRecapProps.current.experiences).toEqual([]);
    expect(mockRecapProps.current.formations).toEqual([]);
  });

  describe('drafts', () => {
    it('keeps the description, skills, languages and interests in the draft profile', () => {
      const { store } = setup({ ...fullProfile });
      act(() => {
        fireEvent.click(screen.getByTestId('set-description'));
        fireEvent.click(screen.getByTestId('set-skills'));
        fireEvent.click(screen.getByTestId('set-languages'));
        fireEvent.click(screen.getByTestId('set-interests'));
      });
      const draft = store.getState().currentUser.profileComplete as any;
      expect(draft.description).toBe('Nouvelle description');
      expect(draft.skills).toEqual([{ name: 'js' }]);
      expect(draft.userProfileLanguages).toEqual([
        {
          languageId: 'l1',
          language: { id: 'l1', name: 'Français', value: 'l1' },
        },
      ]);
      expect(draft.interests).toEqual([
        { name: 'foot', order: 0 },
        { name: 'chess', order: 1 },
      ]);
    });

    it('updates the experiences and formations through the content callbacks', () => {
      const { store } = setup(fullProfile);
      const next = [{ id: 'e2', title: 'Chef' }];
      act(() => mockRecapProps.current.onExperiencesChange(next));
      expect(mockRecapProps.current.experiences).toEqual(next);
      expect(
        (store.getState().currentUser.profileComplete as any).experiences
      ).toEqual(next);

      const nextFormations = [{ id: 'f2', title: 'BTS' }];
      act(() => mockRecapProps.current.onFormationsChange(nextFormations));
      expect(mockRecapProps.current.formations).toEqual(nextFormations);
      expect(
        (store.getState().currentUser.profileComplete as any).formations
      ).toEqual(nextFormations);
    });
  });

  describe('onSubmit', () => {
    it('refuses to advance without a user', async () => {
      const { step } = setup(fullProfile, null);
      expect(await step().onSubmit?.()).toBe(false);
      expect(mockedApi.putUserProfile).not.toHaveBeenCalled();
    });

    it('saves the whole profile and lets the wizard advance', async () => {
      mockedApi.putUserProfile.mockResolvedValue({ data: {} } as never);
      const { step } = setup(fullProfile);
      let outcome: boolean | void | undefined;
      await act(async () => {
        outcome = await step().onSubmit?.();
        await flushPromises();
      });
      expect(outcome).toBe(true);
      expect(mockedApi.putUserProfile).toHaveBeenCalledWith('user-1', {
        description: 'Ma description',
        experiences: fullProfile.experiences,
        formations: fullProfile.formations,
        skills: [{ name: 'Rigueur' }],
        userProfileLanguages: [{ languageId: 'l1' }],
        interests: [
          { name: 'Foot', order: 0 },
          { name: 'Échecs', order: 1 },
        ],
      });
    });

    it('blocks the wizard and shows an error when saving fails', async () => {
      mockedApi.putUserProfile.mockRejectedValue(new Error('boom'));
      const { step, store } = setup(fullProfile);
      let outcome: boolean | void | undefined;
      await act(async () => {
        outcome = await step().onSubmit?.();
        await flushPromises();
      });
      expect(outcome).toBe(false);
      expect(store.getState().onboarding.formErrorMessage).toBe(
        'Une erreur est survenue lors de la sauvegarde. Veuillez réessayer.'
      );
    });
  });
});
