jest.mock('@/src/api');

// registrationActions pulls in registration.config.tsx -> forms -> ui,
// which transitively imports the ESM-only @react-hook/window-size.
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

import { renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Provider } from 'react-redux';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import {
  CREATE_USER_FIXED_CACHE_KEY,
  registrationApi,
} from '@/src/use-cases/registration';
import { useEmailConfirmationPhase } from './useEmailConfirmationPhase';

describe('useEmailConfirmationPhase', () => {
  it('exposes canGoBack: true', () => {
    const store = createTestStore();
    const { result } = renderHook(
      () =>
        useEmailConfirmationPhase({
          goToLastStep: jest.fn(),
          goToStepById: jest.fn(),
        }),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      }
    );

    expect(result.current.canGoBack).toBe(true);
  });

  it('onBack resets the createUser mutation, un-ends registration and calls goToLastStep only', () => {
    const store = createTestStore();
    // Seed a fixed-cache-key mutation result so there's something to reset.
    store.dispatch(
      registrationApi.endpoints.createUser.initiate(
        {
          data: null,
          selectedFlow: null,
          invitationId: undefined,
          preRegistrationPreferences: null,
        },
        { fixedCacheKey: CREATE_USER_FIXED_CACHE_KEY }
      )
    );
    store.dispatch({
      type: 'registration/setRegistrationIsEnded',
      payload: true,
    });

    const goToLastStep = jest.fn();
    const goToStepById = jest.fn();
    const { result } = renderHook(
      () => useEmailConfirmationPhase({ goToLastStep, goToStepById }),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      }
    );

    result.current.onBack();

    expect(
      registrationApi.endpoints.createUser.select(CREATE_USER_FIXED_CACHE_KEY)(
        store.getState()
      ).status
    ).toBe('uninitialized');
    expect(store.getState().registration.isEnded).toBe(false);
    expect(goToLastStep).toHaveBeenCalledTimes(1);
    expect(goToStepById).not.toHaveBeenCalled();
  });

  it("onEditEmail resets the createUser mutation, un-ends registration and calls goToStepById('account') only", () => {
    const store = createTestStore();
    store.dispatch(
      registrationApi.endpoints.createUser.initiate(
        {
          data: null,
          selectedFlow: null,
          invitationId: undefined,
          preRegistrationPreferences: null,
        },
        { fixedCacheKey: CREATE_USER_FIXED_CACHE_KEY }
      )
    );
    store.dispatch({
      type: 'registration/setRegistrationIsEnded',
      payload: true,
    });

    const goToLastStep = jest.fn();
    const goToStepById = jest.fn();
    const { result } = renderHook(
      () => useEmailConfirmationPhase({ goToLastStep, goToStepById }),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      }
    );

    result.current.onEditEmail();

    expect(
      registrationApi.endpoints.createUser.select(CREATE_USER_FIXED_CACHE_KEY)(
        store.getState()
      ).status
    ).toBe('uninitialized');
    expect(store.getState().registration.isEnded).toBe(false);
    expect(goToStepById).toHaveBeenCalledWith('account');
    expect(goToLastStep).not.toHaveBeenCalled();
  });
});
