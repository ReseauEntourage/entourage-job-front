jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
const mockFormProps: { current: any } = { current: null };
const mockSubmitResult = { current: true };
jest.mock('@/src/features/forms/FormWithValidation', () => {
  const React = require('react');
  return {
    FormWithValidation: (props: any) => {
      mockFormProps.current = props;
      React.useImperativeHandle(props.innerRef, () => ({
        submit: async () => {
          if (!mockSubmitResult.current) {
            return false;
          }
          await props.onSubmit({ nationality: 'FR' });
          return true;
        },
      }));
      return <div data-testid="social-form" />;
    },
  };
});

import {
  act,
  cleanup,
  render,
  renderHook,
  screen,
} from '@testing-library/react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Provider } from 'react-redux';
import { User } from '@/src/api/types';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { seedAccessToken } from '@/src/store/testUtils/seedAccessToken';
import { currentUserActions } from '@/src/use-cases/current-user';
import { useOnboardingStepSocialSituation } from './useOnboardingStepSocialSituation';

const mockedApi = getMockedApi();

function setup(user: Partial<User> | null = { id: 'u1' }) {
  const store = createTestStore();
  if (user) {
    store.dispatch(currentUserActions.fetchUserSucceeded(user as User));
  }
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  const hook = renderHook(
    (props: { user: User | null }) => useOnboardingStepSocialSituation(props),
    { wrapper, initialProps: { user: user as User | null } }
  );
  return { store, wrapper, ...hook };
}

describe('useOnboardingStepSocialSituation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSubmitResult.current = true;
    seedAccessToken('token');
    mockedApi.getCurrentIdentity.mockResolvedValue({
      data: { id: 'u1' },
    } as any);
  });
  afterEach(() => cleanup());

  it('describes an optional profile step', () => {
    const { result } = setup();
    const step = result.current.onboardingStepSocialSituation;
    expect(step.id).toBe('social-situation');
    expect(step.section).toBe('profil');
    expect(step.summary?.title).toBe('Dites-nous en plus sur vous');
    expect(step.title).toContain('tout est facultatif');
  });

  describe('isStepCompleted', () => {
    it('answers from the user when the survey status is already known', async () => {
      const done = setup({
        id: 'u1',
        userSocialSituation: { hasCompletedSurvey: true },
      } as any);
      expect(
        await done.result.current.onboardingStepSocialSituation
          .isStepCompleted!()
      ).toBe(true);
      expect(mockedApi.getUserSocialSituation).not.toHaveBeenCalled();

      const notDone = setup({
        id: 'u1',
        userSocialSituation: { hasCompletedSurvey: false },
      } as any);
      expect(
        await notDone.result.current.onboardingStepSocialSituation
          .isStepCompleted!()
      ).toBe(false);
    });

    it('fetches the social situation once when unknown, and shares the pending request', async () => {
      mockedApi.getUserSocialSituation.mockResolvedValue({
        data: { hasCompletedSurvey: false },
      } as any);
      const { result } = setup();
      const step = result.current.onboardingStepSocialSituation;

      let first!: Promise<boolean>;
      let second!: Promise<boolean>;
      await act(async () => {
        first = step.isStepCompleted!();
        second = step.isStepCompleted!();
        await flushPromises();
      });

      expect(await first).toBe(false);
      expect(await second).toBe(false);
      expect(mockedApi.getUserSocialSituation).toHaveBeenCalledTimes(1);
    });

    it('is not completed when the fetch fails', async () => {
      mockedApi.getUserSocialSituation.mockRejectedValue(new Error('boom'));
      const { result } = setup();
      let completed!: Promise<boolean>;
      await act(async () => {
        completed =
          result.current.onboardingStepSocialSituation.isStepCompleted!();
        await flushPromises();
      });
      expect(await completed).toBe(false);
    });
  });

  describe('onSubmit', () => {
    const mountContent = (
      result: ReturnType<typeof setup>['result'],
      wrapper: React.ComponentType<{ children: React.ReactNode }>
    ) =>
      render(<>{result.current.onboardingStepSocialSituation.content}</>, {
        wrapper,
      });

    it('renders the form without footer, with an information banner', () => {
      const { result, wrapper } = setup();
      mountContent(result, wrapper);
      expect(screen.getByTestId('social-form')).toBeInTheDocument();
      expect(
        screen.getByText(/Ces informations ne sont pas obligatoires/)
      ).toBeInTheDocument();
      expect(mockFormProps.current.noFooter).toBe(true);
    });

    it('saves the situation and lets the wizard advance', async () => {
      mockedApi.updateUserSocialSituation.mockResolvedValue({} as any);
      const { result, wrapper } = setup();
      mountContent(result, wrapper);

      let outcome: boolean | void = false;
      await act(async () => {
        outcome =
          await result.current.onboardingStepSocialSituation.onSubmit!();
      });

      expect(mockedApi.updateUserSocialSituation).toHaveBeenCalledWith('u1', {
        hasCompletedSurvey: true,
        nationality: 'FR',
      });
      expect(outcome).toBeUndefined();
    });

    it('blocks the wizard and shows an error when saving fails', async () => {
      mockedApi.updateUserSocialSituation.mockRejectedValue(new Error('boom'));
      const { result, wrapper, store } = setup();
      mountContent(result, wrapper);

      let outcome: boolean | void = true;
      await act(async () => {
        outcome =
          await result.current.onboardingStepSocialSituation.onSubmit!();
      });

      expect(outcome).toBe(false);
      expect(store.getState().onboarding.formErrorMessage).toContain(
        'Une erreur est survenue lors de l’enregistrement de votre situation'
      );
    });

    it('does not save when the form is invalid', async () => {
      mockSubmitResult.current = false;
      const { result, wrapper } = setup();
      mountContent(result, wrapper);

      let outcome: boolean | void = true;
      await act(async () => {
        outcome =
          await result.current.onboardingStepSocialSituation.onSubmit!();
      });

      expect(outcome).toBe(false);
      expect(mockedApi.updateUserSocialSituation).not.toHaveBeenCalled();
    });
  });
});
