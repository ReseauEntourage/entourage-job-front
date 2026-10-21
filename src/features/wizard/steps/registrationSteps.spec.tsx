jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

// Captures the props of the form a step renders, and exposes a fake form ref.
const mockFormProps: { current: any } = { current: null };
const mockFormRef = {
  submit: jest.fn(),
  setFieldError: jest.fn(),
};
jest.mock('@/src/features/forms/FormWithValidation', () => ({
  FormWithValidation: (props: any) => {
    mockFormProps.current = props;
    if (props.innerRef) {
      props.innerRef.current = mockFormRef;
    }
    return <div data-testid="form" />;
  },
}));
jest.mock(
  '@/src/features/wizard/onboarding/steps/step-nudges/Content/Content',
  () => ({
    Content: (props: any) => {
      mockFormProps.current = props;
      return <div data-testid="nudges-content" />;
    },
  })
);
jest.mock(
  '@/src/features/wizard/sidepanels/WizardCompatibleProfilesSidePanel',
  () => ({
    WizardCompatibleProfilesSidePanel: (props: any) => (
      <div data-testid="side-panel">{`${props.mode}-${props.subtitleContext}`}</div>
    ),
  })
);
jest.mock(
  '@/src/features/wizard/steps/NetworkPreviewStep/NetworkPreviewStep',
  () => ({
    NetworkPreviewStep: (props: any) => {
      mockFormProps.current = props;
      return <div data-testid="network-preview" />;
    },
  })
);
jest.mock(
  '@/src/features/wizard/components/EmailOtpInput/EmailOtpInput',
  () => ({
    EmailOtpInput: (props: any) => {
      mockFormProps.current = props;
      return <div data-testid="otp" />;
    },
  })
);

import { act, render, renderHook, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Provider } from 'react-redux';
import { Api } from '@/src/api';
import { CompanyUserRole } from '@/src/constants/company';
import { DEPARTMENTS } from '@/src/constants/departements';
import { RegistrationFlow } from '@/src/features/registration/flows/flows.types';
import { buildTestPassword } from '@/src/store/testUtils/buildTestPassword';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { authenticationActions } from '@/src/use-cases/authentication';
import { notificationsActions } from '@/src/use-cases/notifications';
import { registrationActions } from '@/src/use-cases/registration';
import { slice } from '@/src/use-cases/registration/registration.slice';
import { useWizardStepCandidateInfo } from './StepInfos/useWizardStepCandidateInfo';
import { useWizardStepCoachInfo } from './StepInfos/useWizardStepCoachInfo';
import { useWizardStepAccount } from './useWizardStepAccount';
import { useWizardStepCandidateEligibility } from './useWizardStepCandidateEligibility';
import { useWizardStepCompanyRole } from './useWizardStepCompanyRole';
import { useWizardStepCompanySelection } from './useWizardStepCompanySelection';
import { useWizardStepEmailConfirmation } from './useWizardStepEmailConfirmation';
import { useWizardStepNetworkPreview } from './useWizardStepNetworkPreview';
import { useWizardStepNudges } from './useWizardStepNudges';
import { useWizardStepRefererAccount } from './useWizardStepRefererAccount';
const TEST_PASSWORD = buildTestPassword();

const mockedApi = jest.mocked(Api);

function registrationState(overrides: Record<string, unknown> = {}) {
  return { registration: { ...slice.getInitialState(), ...overrides } } as any;
}

// Renders a step hook on a real store whose dispatch is recorded and swallowed,
// so that only the actions the step emits are asserted (no listener runs).
function setup<T>(
  hook: () => T,
  state: Record<string, unknown> = {},
  { swallow = true } = {}
) {
  const store = createTestStore(registrationState(state));
  const dispatched: any[] = [];
  const realDispatch = store.dispatch;
  jest.spyOn(store, 'dispatch').mockImplementation(((action: any) => {
    dispatched.push(action);
    return swallow ? action : realDispatch(action);
  }) as any);
  const utils = renderHook(hook, {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });
  const renderContent = (content: React.ReactNode) =>
    render(<Provider store={store}>{content as any}</Provider>);
  return { store, dispatched, renderContent, ...utils };
}

const submitForm = async (fields: unknown) => {
  await act(async () => {
    await mockFormProps.current.onSubmit(fields);
  });
};

describe('registration wizard steps', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFormProps.current = null;
  });

  describe('useWizardStepCandidateInfo', () => {
    it('moves to the next step with the submitted fields', async () => {
      const { result, renderContent, dispatched } = setup(
        () => useWizardStepCandidateInfo(),
        { currentStep: 1, data: { firstName: 'Ada' } }
      );
      renderContent(result.current.step.content);

      expect(result.current.step.id).toBe('candidate-info');
      expect(mockFormProps.current.defaultValues).toEqual({ firstName: 'Ada' });
      await submitForm({ birthDate: '1990-01-01' });

      expect(dispatched).toContainEqual(
        registrationActions.moveForwardInRegistration({
          data: { birthDate: '1990-01-01' } as any,
          step: 2,
        })
      );
    });

    it('delegates the step submission to the form', async () => {
      const { result, renderContent } = setup(() =>
        useWizardStepCandidateInfo()
      );
      renderContent(result.current.step.content);
      mockFormRef.submit.mockResolvedValue(false);

      await expect(result.current.step.onSubmit!()).resolves.toBe(false);
    });
  });

  describe('useWizardStepCoachInfo', () => {
    it('moves to the next step with the submitted fields', async () => {
      const { result, renderContent, dispatched } = setup(
        () => useWizardStepCoachInfo(),
        { currentStep: 0 }
      );
      renderContent(result.current.step.content);
      await submitForm({ birthDate: '1980-01-01' });

      expect(result.current.step.id).toBe('coach-info');
      expect(dispatched).toContainEqual(
        registrationActions.moveForwardInRegistration({
          data: { birthDate: '1980-01-01' } as any,
          step: 1,
        })
      );
    });
  });

  describe('useWizardStepCandidateEligibility', () => {
    it('moves to the next step with the answers', async () => {
      const { result, renderContent, dispatched } = setup(
        () => useWizardStepCandidateEligibility(),
        { currentStep: 2 }
      );
      renderContent(result.current.step.content);
      await submitForm({ materialInsecurity: 'YES' });

      expect(result.current.step.id).toBe('candidate-eligibility');
      expect(mockFormProps.current.defaultValues).toEqual({});
      expect(dispatched).toContainEqual(
        registrationActions.moveForwardInRegistration({
          data: { materialInsecurity: 'YES' } as any,
          step: 3,
        })
      );
    });
  });

  describe('useWizardStepCompanyRole', () => {
    it('switches an employee to the coach flow from the beginning', async () => {
      const { result, renderContent, dispatched } = setup(() =>
        useWizardStepCompanyRole()
      );
      renderContent(result.current.step.content);
      await submitForm({
        companyRole: { value: CompanyUserRole.EMPLOYEE, label: 'Salarié' },
      });

      expect(dispatched).toContainEqual(
        registrationActions.moveForwardInRegistration({
          flow: RegistrationFlow.COACH,
          step: 0,
          data: undefined,
        })
      );
    });

    it('keeps the company flow and stores the role otherwise', async () => {
      const { result, renderContent, dispatched } = setup(() =>
        useWizardStepCompanyRole()
      );
      renderContent(result.current.step.content);
      const companyRole = { value: CompanyUserRole.EXECUTIVE, label: 'Admin' };
      await submitForm({ companyRole });

      expect(dispatched).toContainEqual(
        registrationActions.moveForwardInRegistration({
          data: { companyRole },
          step: 1,
        })
      );
    });
  });

  describe('useWizardStepCompanySelection', () => {
    it('prefills the company name and moves to step 2', async () => {
      const { result, renderContent, dispatched } = setup(
        () => useWizardStepCompanySelection(),
        { data: { companyName: 'Acme' } }
      );
      renderContent(result.current.step.content);

      expect(mockFormProps.current.defaultValues).toEqual({
        companyName: 'Acme',
      });
      await submitForm({ companyName: 'Acme 2' });
      expect(dispatched).toContainEqual(
        registrationActions.moveForwardInRegistration({
          data: { companyName: 'Acme 2' } as any,
          step: 2,
        })
      );
    });
  });

  describe('useWizardStepNudges', () => {
    it('uses the candidate wording by default and syncs the selected nudges', () => {
      const { result, renderContent, dispatched } = setup(() =>
        useWizardStepNudges()
      );

      expect(result.current.step.title).toMatch(/coup de pouce/);
      expect(result.current.step.mobileBottomSheet).toBe(true);
      expect(dispatched).toContainEqual(
        registrationActions.setPreRegistrationPreferences({ nudgeIds: [] })
      );

      renderContent(result.current.step.content);
      expect(mockFormProps.current.userRole).toBeDefined();
      act(() => {
        mockFormProps.current.onChange(['n1', 'n2']);
      });
      expect(dispatched).toContainEqual(
        registrationActions.setPreRegistrationPreferences({
          nudgeIds: ['n1', 'n2'],
        })
      );
    });

    it('uses the coach wording for the coach flow', () => {
      const { result } = setup(() => useWizardStepNudges(), {
        selectedFlow: RegistrationFlow.COACH,
      });

      expect(result.current.step.title).toBe(
        'Pour commencer : comment aimeriez-vous aider ?'
      );
    });

    it('submits the preferences and moves forward', async () => {
      const { result, dispatched } = setup(() => useWizardStepNudges(), {
        currentStep: 0,
      });

      await act(async () => {
        await result.current.step.onSubmit!();
      });

      expect(dispatched).toContainEqual(
        registrationActions.moveForwardInRegistration({ step: 1 })
      );
    });

    it('renders the compatible profiles side panel in the requested mode', () => {
      const { result, renderContent } = setup(() => useWizardStepNudges());
      const { getByTestId } = renderContent(
        result.current.step.sidePanelContent!('compact')
      );

      expect(getByTestId('side-panel').textContent).toBe('compact-nudges');
    });
  });

  describe('useWizardStepNetworkPreview', () => {
    it('loads compatible profiles for the selected preferences', async () => {
      mockedApi.getPreRegistrationCompatibleProfiles.mockResolvedValue({
        data: { profiles: [{ id: 'p1' }], count: 12 },
      } as any);
      const { result, renderContent } = setup(
        () => useWizardStepNetworkPreview(),
        {
          preRegistrationPreferences: {
            nudgeIds: ['n1'],
            businessSectorIds: ['b1'],
            sectorOccupations: [],
          },
        }
      );
      await act(flushPromises);

      expect(
        mockedApi.getPreRegistrationCompatibleProfiles
      ).toHaveBeenCalledWith({
        role: 'Candidat',
        nudgeIds: ['n1'],
        businessSectorIds: ['b1'],
      });
      renderContent(result.current.step.content);
      expect(mockFormProps.current).toMatchObject({
        profiles: [{ id: 'p1' }],
        count: 12,
        isLoading: false,
      });
      expect(result.current.step.buttonLabel).toBe('Créer mon compte');
    });

    it('falls back to an empty preview when the request fails', async () => {
      mockedApi.getPreRegistrationCompatibleProfiles.mockRejectedValue(
        new Error('boom')
      );
      const { result, renderContent } = setup(() =>
        useWizardStepNetworkPreview()
      );
      await act(flushPromises);

      renderContent(result.current.step.content);
      expect(mockFormProps.current).toMatchObject({
        profiles: [],
        count: 0,
        isLoading: false,
      });
    });

    it('uses the coach wording and moves forward on submit', async () => {
      mockedApi.getPreRegistrationCompatibleProfiles.mockResolvedValue({
        data: { profiles: [], count: 0 },
      } as any);
      const { result, dispatched } = setup(
        () => useWizardStepNetworkPreview(),
        {
          selectedFlow: RegistrationFlow.COACH,
          currentStep: 3,
        }
      );
      await act(flushPromises);

      expect(result.current.step.title).toMatch(/soutenir des candidats/);
      await act(async () => {
        await result.current.step.onSubmit!();
      });
      expect(dispatched).toContainEqual(
        registrationActions.moveForwardInRegistration({ step: 4 })
      );
    });
  });

  describe('useWizardStepAccount', () => {
    const wording = (flow: RegistrationFlow | null, count: number | null) =>
      setup(() => useWizardStepAccount(), {
        selectedFlow: flow,
        compatibleProfilesCount: count,
      }).result.current.step.description;

    it('describes the account creation per flow', () => {
      expect(wording(RegistrationFlow.CANDIDATE, null)).toMatch(
        /écrire à vos coachs/
      );
      expect(wording(RegistrationFlow.COACH, null)).toMatch(
        /soutenir les personnes/
      );
      expect(wording(RegistrationFlow.REFERER, null)).toBeUndefined();
    });

    it('announces the number of compatible profiles', () => {
      expect(wording(RegistrationFlow.CANDIDATE, 7)).toBe(
        'Vos 7 coachs vous attendent. Créez votre compte pour pouvoir leur écrire.'
      );
      expect(wording(RegistrationFlow.COACH, 1)).toMatch(
        /1 personne pourrait .* le soutenir/
      );
      expect(wording(RegistrationFlow.COACH, 3)).toMatch(
        /3 personnes pourraient .* les soutenir/
      );
      expect(wording(RegistrationFlow.CANDIDATE, 0)).toMatch(
        /Créez votre compte/
      );
    });

    it('never prefills the password', () => {
      const { result, renderContent } = setup(() => useWizardStepAccount(), {
        data: { firstName: 'Ada', password: 'secret' },
      });
      renderContent(result.current.step.content);

      expect(mockFormProps.current.defaultValues).toEqual({ firstName: 'Ada' });
    });

    it('starts without prefilled values', () => {
      const { result, renderContent } = setup(() => useWizardStepAccount());
      renderContent(result.current.step.content);

      expect(mockFormProps.current.defaultValues).toEqual({});
    });

    it('ends the registration and requests the account creation without the transient fields', async () => {
      const { result, renderContent, dispatched } = setup(() =>
        useWizardStepAccount()
      );
      renderContent(result.current.step.content);
      await submitForm({
        firstName: 'Ada',
        password: 'p',
        acceptCGU: true,
        confirmPassword: 'p',
      });

      expect(dispatched).toEqual([
        registrationActions.setRegistrationIsEnded(true),
        registrationActions.moveForwardInRegistration({
          data: { firstName: 'Ada', password: 'p' } as any,
        }),
        registrationActions.createUserRequested(),
      ]);
    });

    it('flags the email field when the email is already used', async () => {
      mockedApi.postUserRegistration.mockRejectedValue({
        isAxiosError: true,
        response: { status: 409 },
      });
      const { result, renderContent, store } = setup(
        () => useWizardStepAccount(),
        {
          selectedFlow: RegistrationFlow.CANDIDATE,
          data: {
            firstName: 'J',
            lastName: 'D',
            email: 'j@d.fr',
            password: TEST_PASSWORD,
            phone: '0600000000',
            department: { value: 'PARIS', label: 'Paris' },
          },
        },
        { swallow: false }
      );
      renderContent(result.current.step.content);
      await act(async () => {
        store.dispatch(registrationActions.createUserRequested());
        await flushPromises();
      });

      await waitFor(() =>
        expect(mockFormRef.setFieldError).toHaveBeenCalledWith(
          'email',
          'Cette adresse email est déjà utilisée,'
        )
      );
    });
  });

  describe('useWizardStepRefererAccount', () => {
    const baseFields = {
      firstName: 'Ada',
      lastName: 'L',
      phone: '0600000000',
      email: 'ada@asso.fr',
      department: { value: 'Paris (75)', label: 'Paris (75)' },
      acceptCGU: true,
      confirmPassword: 'p',
      password: 'p',
    };

    it('registers directly with an existing organization', async () => {
      const { result, renderContent, dispatched } = setup(() =>
        useWizardStepRefererAccount()
      );
      renderContent(result.current.step.content);
      const organizationId = { value: 'org-1', label: 'Asso' };
      await submitForm({
        ...baseFields,
        organizationId,
        nameOrganization: 'x',
      });

      expect(mockedApi.postOrganization).not.toHaveBeenCalled();
      expect(dispatched).toContainEqual(
        registrationActions.moveForwardInRegistration({
          data: {
            firstName: 'Ada',
            lastName: 'L',
            phone: '0600000000',
            email: 'ada@asso.fr',
            department: baseFields.department,
            password: 'p',
            organizationId,
          } as any,
        })
      );
      expect(dispatched).toContainEqual(
        registrationActions.createUserRequested()
      );
    });

    it('creates the new organization first and uses its id', async () => {
      mockedApi.postOrganization.mockResolvedValue({
        data: { id: 'new-id', name: 'Nouvelle asso' },
      } as any);
      const { result, renderContent, dispatched } = setup(() =>
        useWizardStepRefererAccount()
      );
      renderContent(result.current.step.content);
      const department = DEPARTMENTS[0];
      await submitForm({
        ...baseFields,
        department: { value: department.name, label: department.name },
        organizationId: { value: 'createNewOrganization', label: 'x' },
        nameOrganization: 'Nouvelle asso',
      });

      expect(mockedApi.postOrganization).toHaveBeenCalledWith({
        name: 'Nouvelle asso',
        zone: department.zone,
        referentFirstName: 'Ada',
        referentLastName: 'L',
        referentPhone: '0600000000',
        referentMail: 'ada@asso.fr',
      });
      const move = dispatched.find(
        (a) =>
          a.type ===
          registrationActions.moveForwardInRegistration({} as any).type
      );
      expect(move.payload.data.organizationId).toEqual({
        label: 'Nouvelle asso',
        value: 'new-id',
      });
      expect(move.payload.data.nameOrganization).toBeUndefined();
    });

    it('notifies and stops when the organization cannot be created', async () => {
      mockedApi.postOrganization.mockRejectedValue(new Error('boom'));
      const { result, renderContent, dispatched } = setup(() =>
        useWizardStepRefererAccount()
      );
      renderContent(result.current.step.content);
      await submitForm({
        ...baseFields,
        organizationId: { value: 'createNewOrganization', label: 'x' },
        nameOrganization: 'Nouvelle asso',
      });

      expect(dispatched).toEqual([
        notificationsActions.addNotification({
          type: 'danger',
          message:
            "Une erreur s'est produite lors de la création de l'association",
        }),
      ]);
    });
  });

  describe('useWizardStepEmailConfirmation', () => {
    const run = (
      state: Record<string, unknown> = { data: { email: 'a@b.fr' } }
    ) => {
      const onEditEmail = jest.fn();
      const utils = setup(
        () => useWizardStepEmailConfirmation(onEditEmail),
        state
      );
      utils.renderContent(utils.result.current.content);
      return { onEditEmail, ...utils };
    };
    const typeCode = (code: string) =>
      act(() => {
        mockFormProps.current.onCodeChange(code);
      });
    const otpActions = (dispatched: any[]) =>
      dispatched.filter(
        (a) =>
          a.type === authenticationActions.verifyOtpRequested({} as any).type
      );

    it('is the email confirmation step of the registration section', () => {
      const { result } = run();

      expect(result.current.id).toBe('email-confirmation');
      expect(result.current.section).toBe('inscription');
    });

    it('auto-submits the code once the 6 digits are entered, only once', async () => {
      const { result, dispatched } = run();

      typeCode('12345');
      expect(otpActions(dispatched)).toHaveLength(0);
      typeCode('123456');
      expect(otpActions(dispatched)).toEqual([
        authenticationActions.verifyOtpRequested({
          email: 'a@b.fr',
          code: '123456',
        }),
      ]);

      // The manual "Valider" click does not dispatch the same code twice.
      await act(async () => {
        await result.current.onSubmit!();
      });
      expect(otpActions(dispatched)).toHaveLength(1);
    });

    it('blocks the manual submission while the code is incomplete', async () => {
      const { result, dispatched } = run();
      typeCode('123');

      await expect(result.current.onSubmit!()).resolves.toBe(false);
      expect(otpActions(dispatched)).toHaveLength(0);
    });

    it('does not submit without email', () => {
      const { dispatched } = run({ data: null });
      typeCode('123456');

      expect(otpActions(dispatched)).toHaveLength(0);
    });

    it('forwards the edit email callback to the input', () => {
      const { onEditEmail } = run();

      mockFormProps.current.onEditEmail();
      expect(onEditEmail).toHaveBeenCalledTimes(1);
    });
  });
});
