const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockDispatch = jest.fn();
const mockResetPostMessage = jest.fn();
let mockPostMessageStatus = 'IDLE';
let mockSelectedConversationId: string | null = null;

jest.mock('next/router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}));

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: () => unknown) => selector(),
}));

jest.mock('@/src/use-cases/authentication', () => ({
  authenticationActions: {
    logoutReset: () => ({ type: 'authentication/logoutReset' }),
  },
}));

jest.mock('@/src/use-cases/messaging', () => ({
  POST_MESSAGE_FIXED_CACHE_KEY: 'postMessage',
  selectPostMessageStatus: () => mockPostMessageStatus,
  selectSelectedConversationId: () => mockSelectedConversationId,
  usePostMessageMutation: () => [jest.fn(), { reset: mockResetPostMessage }],
}));

import { renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { User } from '@/src/api/types';
import { ReduxRequestEvents } from '@/src/constants';
import { useWizardRedirects } from './useWizardRedirects';

type Params = Parameters<typeof useWizardRedirects>[0];

function render(overrides: Partial<Params> = {}) {
  const params: Params = {
    currentUser: null,
    isFetchUserFinished: true,
    registrationStepsLength: 3,
    isLogoutSucceeded: false,
    isOnboardingAlreadyCompleted: false,
    updateOnboardingStatus: ReduxRequestEvents.IDLE,
    skipDashboardRedirectRef: { current: false },
    pendingSuggestedMessageRedirectRef: { current: false },
    ...overrides,
  };
  const utils = renderHook(() => useWizardRedirects(params));
  return { params, ...utils };
}

describe('useWizardRedirects', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPostMessageStatus = ReduxRequestEvents.IDLE;
    mockSelectedConversationId = null;
  });

  describe('flow selection', () => {
    it('goes back to /wizard when there is no user and no registration flow', () => {
      render({ registrationStepsLength: 0 });

      expect(mockReplace).toHaveBeenCalledWith('/wizard');
    });

    it('waits for the current user fetch to finish before redirecting', () => {
      render({ registrationStepsLength: 0, isFetchUserFinished: false });

      expect(mockReplace).not.toHaveBeenCalled();
    });

    it('does not redirect a logged-in user', () => {
      render({
        registrationStepsLength: 0,
        currentUser: { id: 'u1' } as User,
      });

      expect(mockReplace).not.toHaveBeenCalled();
    });

    it('does not redirect when a registration flow exists', () => {
      render();

      expect(mockReplace).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('resets the logout state and goes to /login', () => {
      render({ isLogoutSucceeded: true });

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'authentication/logoutReset',
      });
      expect(mockPush).toHaveBeenCalledWith('/login');
    });

    it('does nothing without a logout', () => {
      render();

      expect(mockPush).not.toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  describe('dashboard redirect after onboarding', () => {
    it('goes to the dashboard once the onboarding update succeeded', () => {
      render({ updateOnboardingStatus: ReduxRequestEvents.SUCCEEDED });

      expect(mockPush).toHaveBeenCalledWith('/backoffice/dashboard');
    });

    it('goes to the dashboard when onboarding was already completed', () => {
      render({ isOnboardingAlreadyCompleted: true });

      expect(mockPush).toHaveBeenCalledWith('/backoffice/dashboard');
    });

    it('consumes skipDashboardRedirectRef instead of redirecting', () => {
      const skipDashboardRedirectRef = { current: true };
      render({
        updateOnboardingStatus: ReduxRequestEvents.SUCCEEDED,
        skipDashboardRedirectRef,
      });

      expect(mockPush).not.toHaveBeenCalled();
      expect(skipDashboardRedirectRef.current).toBe(false);
    });

    it('does not redirect while onboarding is not completed', () => {
      render({ updateOnboardingStatus: ReduxRequestEvents.REQUESTED });

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('suggested message redirect', () => {
    it('opens the new conversation after a successful send', () => {
      mockPostMessageStatus = ReduxRequestEvents.SUCCEEDED;
      mockSelectedConversationId = 'conv-1';
      const pendingSuggestedMessageRedirectRef = { current: true };
      render({ pendingSuggestedMessageRedirectRef });

      expect(mockResetPostMessage).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith(
        '/backoffice/messaging?conversationId=conv-1'
      );
      expect(pendingSuggestedMessageRedirectRef.current).toBe(false);
    });

    it('opens the messaging page without a conversation id when none is selected', () => {
      mockPostMessageStatus = ReduxRequestEvents.SUCCEEDED;
      render({ pendingSuggestedMessageRedirectRef: { current: true } });

      expect(mockPush).toHaveBeenCalledWith('/backoffice/messaging');
    });

    it('falls back to the dashboard when the send failed', () => {
      mockPostMessageStatus = ReduxRequestEvents.FAILED;
      const pendingSuggestedMessageRedirectRef = { current: true };
      render({ pendingSuggestedMessageRedirectRef });

      expect(mockResetPostMessage).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith('/backoffice/dashboard');
      expect(pendingSuggestedMessageRedirectRef.current).toBe(false);
    });

    it('ignores the send status when no redirect is pending', () => {
      mockPostMessageStatus = ReduxRequestEvents.SUCCEEDED;
      render();

      expect(mockPush).not.toHaveBeenCalled();
      expect(mockResetPostMessage).not.toHaveBeenCalled();
    });
  });
});
