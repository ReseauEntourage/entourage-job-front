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
import { slice as currentUserSlice } from '@/src/use-cases/current-user/current-user.slice';
import { PRESENTATION_MAX_LENGTH } from './presentationGeneration.utils';
import { useStepPresentation } from './useStepPresentation';
import { useStepSkills } from './useStepSkills';

const mockedApi = getMockedApi();
const USER = { id: 'user-1', role: UserRoles.CANDIDATE } as unknown as User;

function setup<T>(useHook: () => T, profile: any) {
  (useCurrentUserProfileComplete as jest.Mock).mockReturnValue(profile);
  const store = createTestStore({
    currentUser: {
      ...currentUserSlice.getInitialState(),
      profileComplete: profile,
    } as never,
  });
  const hook = renderHook(useHook, {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });
  return { store, ...hook };
}

const formElement = (content: React.ReactNode) =>
  ((content as ReactElement).props as { children: ReactElement }).children;

/**
 * Plays the role of the form: gives the step a ref whose submit validates (or
 * not) and then calls the step's own onSubmit handler, like the real form.
 */
const plugForm = (
  content: React.ReactNode,
  { valid = true, values }: { valid?: boolean; values: unknown }
) => {
  const props = formElement(content).props as any;
  const ref = props.formRef ?? props.innerRef;
  ref.current = {
    submit: async () => {
      if (!valid) {
        return false;
      }
      await props.onSubmit(values);
      return true;
    },
  };
  return props;
};

const skillsValues = {
  skills: [{ value: 'Rigueur', label: 'Rigueur' }],
  languages: [{ value: 'l1', label: 'Français' }],
  interests: [
    { value: 'Foot', label: 'Foot' },
    { value: 'Échecs', label: 'Échecs' },
  ],
};

describe('useStepSkills', () => {
  beforeEach(() => jest.clearAllMocks());

  const profile = {
    skills: [{ name: 'Rigueur' }],
    userProfileLanguages: [
      { language: { id: 'l1', name: 'Français' } },
      { language: { id: null, name: 'Sans id' } },
      { language: { id: 'l3', name: '' } },
    ],
    interests: [
      { name: 'Échecs', order: 1 },
      { name: 'Foot', order: 0 },
    ],
  };

  it('pre-fills the form from the profile, ordering the interests', () => {
    const { result } = setup(() => useStepSkills({ user: USER }), profile);
    const props = formElement(result.current.onboardingStepSkills.content)
      .props as any;
    expect(props.defaultValues).toEqual({
      skills: [{ value: 'Rigueur', label: 'Rigueur' }],
      languages: [{ value: 'l1', label: 'Français' }],
      interests: [
        { value: 'Foot', label: 'Foot' },
        { value: 'Échecs', label: 'Échecs' },
      ],
    });
    expect(formElement(result.current.onboardingStepSkills.content).key).toBe(
      'loaded'
    );
  });

  it('starts empty and waits for the profile', () => {
    const { result } = setup(() => useStepSkills({ user: USER }), null);
    const element = formElement(result.current.onboardingStepSkills.content);
    expect((element.props as any).defaultValues).toEqual({
      skills: [],
      languages: [],
      interests: [],
    });
    expect(element.key).toBe('pending');
  });

  it('is always completable and enabled', async () => {
    const { result } = setup(() => useStepSkills({ user: USER }), profile);
    expect(result.current.onboardingStepSkills.isNextEnabled).toBe(true);
    expect(await result.current.onboardingStepSkills.isStepCompleted?.()).toBe(
      true
    );
  });

  it('keeps each change of the form in the draft profile', () => {
    const { result, store } = setup(
      () => useStepSkills({ user: USER }),
      profile
    );
    const { onWatch } = formElement(result.current.onboardingStepSkills.content)
      .props as any;

    act(() => {
      onWatch({ skills: [{ value: 'JS' }, undefined] }, { name: 'skills' });
      onWatch(
        { languages: [{ value: 'l2', label: 'Arabe' }, undefined] },
        { name: 'languages' }
      );
      onWatch(
        { interests: [{ value: 'Foot' }, undefined, { value: 'Jazz' }] },
        { name: 'interests' }
      );
    });
    const draft = store.getState().currentUser.profileComplete as any;
    expect(draft.skills).toEqual([{ name: 'JS' }]);
    expect(draft.userProfileLanguages).toEqual([
      { languageId: 'l2', language: { id: 'l2', name: 'Arabe', value: 'l2' } },
    ]);
    expect(draft.interests).toEqual([
      { name: 'Foot', order: 0 },
      { name: 'Jazz', order: 1 },
    ]);
  });

  it('tolerates empty values and unknown fields', () => {
    const { result, store } = setup(
      () => useStepSkills({ user: USER }),
      profile
    );
    const { onWatch } = formElement(result.current.onboardingStepSkills.content)
      .props as any;
    act(() => {
      onWatch({}, { name: 'skills' });
      onWatch({}, { name: 'languages' });
      onWatch({}, { name: 'interests' });
      onWatch({}, { name: 'other' });
    });
    const draft = store.getState().currentUser.profileComplete as any;
    expect(draft.skills).toEqual([]);
    expect(draft.userProfileLanguages).toEqual([]);
    expect(draft.interests).toEqual([]);
  });

  describe('onSubmit', () => {
    it('refuses to advance without a user', async () => {
      const { result } = setup(() => useStepSkills({ user: null }), profile);
      expect(await result.current.onboardingStepSkills.onSubmit?.()).toBe(
        false
      );
    });

    it('stays on the step when the form is invalid', async () => {
      const { result } = setup(() => useStepSkills({ user: USER }), profile);
      plugForm(result.current.onboardingStepSkills.content, {
        valid: false,
        values: skillsValues,
      });
      expect(await result.current.onboardingStepSkills.onSubmit?.()).toBe(
        false
      );
      expect(mockedApi.putUserProfile).not.toHaveBeenCalled();
    });

    it('saves the skills, languages and ordered interests, then advances', async () => {
      mockedApi.putUserProfile.mockResolvedValue({
        data: { description: 'Déjà là' },
      } as never);
      const { result } = setup(() => useStepSkills({ user: USER }), profile);
      plugForm(result.current.onboardingStepSkills.content, {
        values: skillsValues,
      });
      let outcome: boolean | void | undefined;
      await act(async () => {
        outcome = await result.current.onboardingStepSkills.onSubmit?.();
        await flushPromises();
      });
      expect(outcome).toBeUndefined();
      expect(mockedApi.putUserProfile).toHaveBeenCalledWith('user-1', {
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
      const { result, store } = setup(
        () => useStepSkills({ user: USER }),
        profile
      );
      plugForm(result.current.onboardingStepSkills.content, {
        values: skillsValues,
      });
      let outcome: boolean | void | undefined;
      await act(async () => {
        outcome = await result.current.onboardingStepSkills.onSubmit?.();
        await flushPromises();
      });
      expect(outcome).toBe(false);
      expect(store.getState().onboarding.formErrorMessage).toBe(
        'Une erreur est survenue lors de la sauvegarde. Veuillez réessayer.'
      );
    });
  });
});

describe('useStepPresentation', () => {
  beforeEach(() => jest.clearAllMocks());

  const watchProps = (content: React.ReactNode) =>
    formElement(content).props as any;

  it('starts enabled for a short or empty presentation and disabled for a too long one', () => {
    const empty = setup(() => useStepPresentation({ user: USER }), {
      description: null,
    });
    expect(empty.result.current.onboardingStepPresentation.isNextEnabled).toBe(
      true
    );
    const tooLong = setup(() => useStepPresentation({ user: USER }), {
      description: 'a'.repeat(PRESENTATION_MAX_LENGTH + 1),
    });
    expect(
      tooLong.result.current.onboardingStepPresentation.isNextEnabled
    ).toBe(false);
  });

  it('follows the typed text: draft profile and next button', () => {
    const { result, store } = setup(() => useStepPresentation({ user: USER }), {
      description: null,
    });
    act(() => {
      watchProps(result.current.onboardingStepPresentation.content).onWatch({
        description: 'a'.repeat(PRESENTATION_MAX_LENGTH + 1),
      });
    });
    expect(
      (store.getState().currentUser.profileComplete as any).description
    ).toHaveLength(PRESENTATION_MAX_LENGTH + 1);
    expect(result.current.onboardingStepPresentation.isNextEnabled).toBe(false);

    act(() => {
      watchProps(result.current.onboardingStepPresentation.content).onWatch({
        description: 'Court',
      });
    });
    expect(result.current.onboardingStepPresentation.isNextEnabled).toBe(true);
  });

  it('builds a form with a single introduction field for the role', () => {
    const { result } = setup(() => useStepPresentation({ user: USER }), {
      description: null,
    });
    const { formSchema } = watchProps(
      result.current.onboardingStepPresentation.content
    );
    expect(formSchema.fields).toHaveLength(1);
    expect(formSchema.fields[0].name).toBe('description');
  });

  describe('onSubmit', () => {
    it('refuses to advance without a user', async () => {
      const { result } = setup(() => useStepPresentation({ user: null }), {
        description: null,
      });
      expect(await result.current.onboardingStepPresentation.onSubmit?.()).toBe(
        false
      );
    });

    it('stays on the step when the form is invalid', async () => {
      const { result } = setup(() => useStepPresentation({ user: USER }), {
        description: null,
      });
      plugForm(result.current.onboardingStepPresentation.content, {
        valid: false,
        values: { description: 'x' },
      });
      expect(await result.current.onboardingStepPresentation.onSubmit?.()).toBe(
        false
      );
      expect(mockedApi.putUserProfile).not.toHaveBeenCalled();
    });

    it('saves the presentation then lets the wizard advance', async () => {
      mockedApi.putUserProfile.mockResolvedValue({ data: {} } as never);
      const { result } = setup(() => useStepPresentation({ user: USER }), {
        description: null,
      });
      plugForm(result.current.onboardingStepPresentation.content, {
        values: { description: 'Ma présentation' },
      });
      let outcome: boolean | void | undefined;
      await act(async () => {
        outcome = await result.current.onboardingStepPresentation.onSubmit?.();
        await flushPromises();
      });
      expect(outcome).toBeUndefined();
      expect(mockedApi.putUserProfile).toHaveBeenCalledWith('user-1', {
        description: 'Ma présentation',
      });
    });

    it('blocks the wizard and shows an error when saving fails', async () => {
      mockedApi.putUserProfile.mockRejectedValue(new Error('boom'));
      const { result, store } = setup(
        () => useStepPresentation({ user: USER }),
        { description: null }
      );
      plugForm(result.current.onboardingStepPresentation.content, {
        values: { description: 'Ma présentation' },
      });
      let outcome: boolean | void | undefined;
      await act(async () => {
        outcome = await result.current.onboardingStepPresentation.onSubmit?.();
        await flushPromises();
      });
      expect(outcome).toBe(false);
      expect(store.getState().onboarding.formErrorMessage).toBe(
        'Une erreur est survenue lors de la sauvegarde. Veuillez réessayer.'
      );
    });
  });

  it('is completed only when a presentation exists', async () => {
    const without = setup(() => useStepPresentation({ user: USER }), {
      description: ' ',
    });
    expect(
      await without.result.current.onboardingStepPresentation.isStepCompleted?.()
    ).toBe(false);
    const withText = setup(() => useStepPresentation({ user: USER }), {
      description: 'Texte',
    });
    expect(
      await withText.result.current.onboardingStepPresentation.isStepCompleted?.()
    ).toBe(true);
  });
});
