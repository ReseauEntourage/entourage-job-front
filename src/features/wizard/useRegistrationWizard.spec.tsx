jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

const mockPush = jest.fn();
jest.mock('next/router', () => ({ useRouter: () => ({ push: mockPush }) }));

const mockStep = (id: string) => ({
  step: { id, onSubmit: jest.fn(), section: 'inscription' },
});
const mockSteps: Record<string, any> = {};
const getMockStep = (id: string) => {
  if (!mockSteps[id]) {
    mockSteps[id] = mockStep(id);
  }
  return mockSteps[id];
};
jest.mock('./steps/StepInfos/useWizardStepCandidateInfo', () => ({
  useWizardStepCandidateInfo: () => getMockStep('candidate-info'),
}));
jest.mock('./steps/StepInfos/useWizardStepCoachInfo', () => ({
  useWizardStepCoachInfo: () => getMockStep('coach-info'),
}));
jest.mock('./steps/useWizardStepAccount', () => ({
  useWizardStepAccount: () => getMockStep('account'),
}));
jest.mock('./steps/useWizardStepCandidateEligibility', () => ({
  useWizardStepCandidateEligibility: () => getMockStep('candidate-eligibility'),
}));
jest.mock('./steps/useWizardStepCompanyRole', () => ({
  useWizardStepCompanyRole: () => getMockStep('company-role'),
}));
jest.mock('./steps/useWizardStepCompanySelection', () => ({
  useWizardStepCompanySelection: () => getMockStep('company-selection'),
}));
jest.mock('./steps/useWizardStepRefererAccount', () => ({
  useWizardStepRefererAccount: () => getMockStep('referer-account'),
}));
jest.mock('./steps/useWizardStepNudges', () => ({
  useWizardStepNudges: () => getMockStep('nudges'),
}));
jest.mock('./steps/useWizardStepSectorsJobs', () => ({
  useWizardStepSectorsJobs: () => getMockStep('sectors-jobs'),
}));
jest.mock('./steps/useWizardStepNetworkPreview', () => ({
  useWizardStepNetworkPreview: () => getMockStep('network-preview'),
}));

import { act, renderHook, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Provider } from 'react-redux';
import { UserRoles } from '@/src/constants/users';
import { RegistrationFlow } from '@/src/features/registration/flows/flows.types';
import { buildTestPassword } from '@/src/store/testUtils/buildTestPassword';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { notificationsActions } from '@/src/use-cases/notifications';
import { registrationActions } from '@/src/use-cases/registration';
import { slice } from '@/src/use-cases/registration/registration.slice';
import { useRegistrationWizard } from './useRegistrationWizard';
const TEST_PASSWORD = buildTestPassword();

const mockedApi = getMockedApi();

function setup(
  state: Record<string, unknown> = {},
  extra: Record<string, unknown> = {}
) {
  const store = createTestStore({
    registration: { ...slice.getInitialState(), ...state },
    ...extra,
  } as any);
  const dispatched: any[] = [];
  const realDispatch = store.dispatch;
  jest.spyOn(store, 'dispatch').mockImplementation(((action: any) => {
    dispatched.push(action);
    return realDispatch(action);
  }) as any);
  const utils = renderHook(() => useRegistrationWizard(), {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });
  return { store, dispatched, ...utils };
}

const ids = (steps: { id: string }[]) => steps.map((s) => s.id);

describe('useRegistrationWizard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockResolvedValue(undefined);
  });

  describe('steps per flow', () => {
    it('has no steps without a flow nor user', () => {
      const { result } = setup();

      expect(result.current.wizardSteps).toEqual([]);
      expect(result.current.currentWizardStep).toBeNull();
      expect(result.current.effectiveFlow).toBeNull();
      expect(result.current.canGoBack).toBe(true);
    });

    it('candidate flow', () => {
      const { result } = setup({
        selectedFlow: RegistrationFlow.CANDIDATE,
        currentStep: 0,
      });

      expect(ids(result.current.wizardSteps)).toEqual([
        'nudges',
        'sectors-jobs',
        'network-preview',
        'candidate-info',
        'candidate-eligibility',
        'account',
      ]);
      expect(result.current.currentWizardStep?.id).toBe('nudges');
    });

    it('coach flow', () => {
      const { result } = setup({ selectedFlow: RegistrationFlow.COACH });

      expect(ids(result.current.wizardSteps)).toEqual([
        'nudges',
        'sectors-jobs',
        'network-preview',
        'coach-info',
        'account',
      ]);
    });

    it('referer flow', () => {
      const { result } = setup({ selectedFlow: RegistrationFlow.REFERER });

      expect(ids(result.current.wizardSteps)).toEqual(['referer-account']);
    });

    it('company flow', () => {
      const { result } = setup({ selectedFlow: RegistrationFlow.COMPANY });

      expect(ids(result.current.wizardSteps)).toEqual([
        'company-role',
        'company-selection',
        'coach-info',
        'account',
      ]);
    });

    it('clamps the unselected step (-1) to the first step', () => {
      const { result } = setup({
        selectedFlow: RegistrationFlow.REFERER,
        currentStep: -1,
      });

      expect(result.current.currentWizardIdx).toBe(0);
    });
  });

  describe('flow of a logged in user', () => {
    const user = (role: string) =>
      ({ currentUser: { user: { id: 'u', role } } }) as any;

    [
      [UserRoles.CANDIDATE, RegistrationFlow.CANDIDATE],
      [UserRoles.COACH, RegistrationFlow.COACH],
      [UserRoles.REFERER, RegistrationFlow.REFERER],
    ].forEach(([role, flow]) => {
      it(`deduces ${flow} from the ${role} role`, () => {
        const { result } = setup({}, user(role));

        expect(result.current.effectiveFlow).toBe(flow);
      });
    });

    it('deduces no flow for an admin', () => {
      const { result } = setup({}, user(UserRoles.ADMIN));

      expect(result.current.effectiveFlow).toBeNull();
    });

    it('prefers the selected flow over the role', () => {
      const { result } = setup(
        { selectedFlow: RegistrationFlow.COMPANY },
        user(UserRoles.CANDIDATE)
      );

      expect(result.current.effectiveFlow).toBe(RegistrationFlow.COMPANY);
    });
  });

  describe('navigation', () => {
    it('incrementStep submits the current step', async () => {
      const { result } = setup({
        selectedFlow: RegistrationFlow.REFERER,
        currentStep: 0,
      });

      await act(async () => {
        await result.current.incrementStep();
      });

      expect(result.current.currentWizardStep!.onSubmit).toHaveBeenCalledTimes(
        1
      );
    });

    it('incrementStep tolerates a step failure and a missing step', async () => {
      const { result } = setup({ selectedFlow: RegistrationFlow.REFERER });
      (
        result.current.currentWizardStep!.onSubmit as jest.Mock
      ).mockResolvedValue(false);

      await act(async () => {
        await expect(result.current.incrementStep()).resolves.toBeUndefined();
      });

      const empty = setup();
      await act(async () => {
        await expect(
          empty.result.current.incrementStep()
        ).resolves.toBeUndefined();
      });
    });

    it('decrementStep goes back one step after the first one', () => {
      const { result, dispatched } = setup({
        selectedFlow: RegistrationFlow.CANDIDATE,
        currentStep: 2,
      });

      act(() => result.current.decrementStep());

      expect(dispatched).toContainEqual(
        registrationActions.moveBackwardInRegistration()
      );
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('decrementStep on the first step returns to the flow selection then resets', async () => {
      const { result, dispatched } = setup({
        selectedFlow: RegistrationFlow.CANDIDATE,
        currentStep: 0,
      });

      await act(async () => {
        result.current.decrementStep();
        await flushPromises();
      });

      expect(mockPush).toHaveBeenCalledWith('/wizard');
      expect(dispatched).toContainEqual(
        registrationActions.resetRegistrationData()
      );
    });

    it('goToLastStep jumps to the last step of the flow', () => {
      const { result, dispatched } = setup({
        selectedFlow: RegistrationFlow.COACH,
        currentStep: 0,
      });

      act(() => result.current.goToLastStep());

      expect(dispatched).toContainEqual(
        registrationActions.moveForwardInRegistration({ step: 4 })
      );
    });

    it('goToStepById jumps to a known step and ignores an unknown one', () => {
      const { result, dispatched } = setup({
        selectedFlow: RegistrationFlow.COACH,
        currentStep: 0,
      });

      act(() => result.current.goToStepById('coach-info'));
      expect(dispatched).toContainEqual(
        registrationActions.moveForwardInRegistration({ step: 3 })
      );

      const before = dispatched.length;
      act(() => result.current.goToStepById('photo'));
      expect(dispatched).toHaveLength(before);
    });
  });

  describe('account creation errors', () => {
    const submitWith = (status: number) => {
      mockedApi.postUserRegistration.mockRejectedValue({
        isAxiosError: true,
        response: { status },
      });
      const utils = setup({
        selectedFlow: RegistrationFlow.CANDIDATE,
        currentStep: 5,
        data: {
          firstName: 'J',
          lastName: 'D',
          email: 'j@d.fr',
          password: TEST_PASSWORD,
          phone: '0600000000',
          department: { value: 'PARIS', label: 'Paris' },
        },
      });
      return utils;
    };

    it('notifies when the account creation fails', async () => {
      const { store, dispatched } = submitWith(500);
      await act(async () => {
        store.dispatch(registrationActions.createUserRequested());
      });

      // The notification is dispatched at the end of an RTK Query chain (listener
      // → mutation → rejected queryFn): a single macrotask tick is not enough on a
      // loaded CI runner, so poll instead of flushing once.
      await waitFor(() =>
        expect(dispatched).toContainEqual(
          notificationsActions.addNotification({
            type: 'danger',
            message: "Une erreur est survenue lors de l'inscription",
          })
        )
      );
    });

    it('does not notify for a duplicate email (shown inline)', async () => {
      const { store, dispatched } = submitWith(409);
      await act(async () => {
        store.dispatch(registrationActions.createUserRequested());
        await flushPromises();
      });

      expect(
        dispatched.filter(
          (a) => a.type === notificationsActions.addNotification({} as any).type
        )
      ).toHaveLength(0);
    });
  });
});
