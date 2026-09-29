jest.mock('@/src/api');

jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

import { act, renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React, { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { User } from '@/src/api/types';
import { UserRoles } from '@/src/constants/users';
import {
  createTestStore,
  TestStore,
} from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { slice as currentUserSlice } from '@/src/use-cases/current-user/current-user.slice';
import {
  isIntroductionValid,
  isPresentationStepCompleted,
  useStepPresentation,
} from './useStepPresentation';
import { useStepSkills } from './useStepSkills';

const mockedApi = getMockedApi();

const USER = { id: 'user-1', role: UserRoles.CANDIDATE } as unknown as User;

const buildStore = (description: string | null) =>
  createTestStore({
    currentUser: {
      ...currentUserSlice.getInitialState(),
      profileComplete: { description, experiences: [], formations: [] },
    } as never,
  });

const wrapper =
  (store: TestStore) =>
  ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

// The skills form's onSubmit is the FormWithValidationSync prop inside the
// step content: calling it is what "Étape suivante" does once validated.
const submitSkills = (content: ReactElement) => {
  const form = (content.props as { children: ReactElement }).children;
  const { onSubmit } = form.props as {
    onSubmit: (values: unknown) => Promise<void>;
  };
  return onSubmit({ skills: [], languages: [], interests: [] });
};

describe('presentation step helpers', () => {
  it('accepts an empty presentation and up to 500 characters', () => {
    expect(isIntroductionValid('')).toBe(true);
    expect(isIntroductionValid('a'.repeat(500))).toBe(true);
    expect(isIntroductionValid('a'.repeat(501))).toBe(false);
  });

  it('only completes the step when a presentation exists', () => {
    expect(isPresentationStepCompleted(null)).toBe(false);
    expect(isPresentationStepCompleted('   ')).toBe(false);
    expect(isPresentationStepCompleted('Ma présentation')).toBe(true);
  });
});

describe('useStepPresentation', () => {
  it('ends the manual path with "Terminer mon profil"', async () => {
    const store = buildStore(null);
    const { result } = renderHook(() => useStepPresentation({ user: USER }), {
      wrapper: wrapper(store),
    });

    expect(result.current.onboardingStepPresentation.buttonLabel).toBe(
      'Terminer mon profil'
    );
    expect(
      await result.current.onboardingStepPresentation.isStepCompleted?.()
    ).toBe(false);
  });
});

describe('useStepSkills', () => {
  afterEach(() => jest.clearAllMocks());

  it('uses the default "Étape suivante" label', () => {
    const store = buildStore(null);
    const { result } = renderHook(() => useStepSkills({ user: USER }), {
      wrapper: wrapper(store),
    });

    expect(result.current.onboardingStepSkills.buttonLabel).toBeUndefined();
  });

  it('launches one generation once the skills are saved, with an empty presentation', async () => {
    mockedApi.putUserProfile.mockResolvedValue({ data: {} } as never);
    mockedApi.postGeneratePresentation.mockResolvedValue({
      data: { description: 'Texte' },
    } as never);
    const store = buildStore(null);
    const { result } = renderHook(() => useStepSkills({ user: USER }), {
      wrapper: wrapper(store),
    });

    await act(async () => {
      await submitSkills(
        result.current.onboardingStepSkills.content as ReactElement
      );
      await flushPromises();
    });

    expect(mockedApi.putUserProfile).toHaveBeenCalledTimes(1);
    expect(mockedApi.postGeneratePresentation).toHaveBeenCalledTimes(1);
  });

  it('does not generate when a presentation already exists', async () => {
    mockedApi.putUserProfile.mockResolvedValue({ data: {} } as never);
    const store = buildStore('Ma présentation');
    const { result } = renderHook(() => useStepSkills({ user: USER }), {
      wrapper: wrapper(store),
    });

    await act(async () => {
      await submitSkills(
        result.current.onboardingStepSkills.content as ReactElement
      );
      await flushPromises();
    });

    expect(mockedApi.postGeneratePresentation).not.toHaveBeenCalled();
  });

  it('does not generate when saving the skills fails', async () => {
    mockedApi.putUserProfile.mockRejectedValue(new Error('500'));
    const store = buildStore(null);
    const { result } = renderHook(() => useStepSkills({ user: USER }), {
      wrapper: wrapper(store),
    });

    await act(async () => {
      await submitSkills(
        result.current.onboardingStepSkills.content as ReactElement
      );
      await flushPromises();
    });

    expect(mockedApi.postGeneratePresentation).not.toHaveBeenCalled();
  });
});
