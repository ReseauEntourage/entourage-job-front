jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

const mockSyncProps: { current: any } = { current: null };
jest.mock('@/src/features/wizard/FormWithValidationSync', () => ({
  FormWithValidationSync: (props: any) => {
    mockSyncProps.current = props;
    return <div data-testid="sync-form" />;
  },
}));
jest.mock(
  '@/src/features/wizard/sidepanels/WizardCompatibleProfilesSidePanel',
  () => ({
    WizardCompatibleProfilesSidePanel: (props: any) => (
      <div data-testid="side-panel">{`${props.mode}-${props.subtitleContext}`}</div>
    ),
  })
);

import { act, render, renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Provider } from 'react-redux';
import { RegistrationFlow } from '@/src/features/registration/flows/flows.types';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { registrationActions } from '@/src/use-cases/registration';
import { slice } from '@/src/use-cases/registration/registration.slice';
import { useWizardStepSectorsJobs } from './useWizardStepSectorsJobs';

function setup(state: Record<string, unknown> = {}) {
  const store = createTestStore({
    registration: { ...slice.getInitialState(), ...state },
  } as any);
  const dispatched: any[] = [];
  jest.spyOn(store, 'dispatch').mockImplementation(((action: any) => {
    dispatched.push(action);
    return action;
  }) as any);
  const utils = renderHook(() => useWizardStepSectorsJobs(), {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });
  const renderContent = () =>
    render(
      <Provider store={store}>
        {utils.result.current.step.content as any}
      </Provider>
    );
  return { dispatched, renderContent, ...utils };
}

const sector = (value: string) => ({ value, label: value });
const lastPreferences = (dispatched: any[]) =>
  dispatched
    .filter(
      (a) =>
        a.type ===
        registrationActions.setPreRegistrationPreferences({} as any).type
    )
    .pop().payload;

describe('useWizardStepSectorsJobs', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('candidate flow (default)', () => {
    it('asks for jobs and sectors and keeps next disabled until a sector is chosen', () => {
      const { result, renderContent } = setup();
      renderContent();

      expect(result.current.step.id).toBe('sectors-jobs');
      expect(result.current.step.title).toBe(
        'Quel métier(s) et secteur(s) visez-vous ?'
      );
      expect(result.current.step.isNextEnabled).toBe(false);

      act(() => {
        mockSyncProps.current.onWatch({ businessSectorId0: sector('s1') });
      });
      expect(result.current.step.isNextEnabled).toBe(true);
    });

    it('requires a second sector when a second occupation is typed', () => {
      const { result, renderContent } = setup();
      renderContent();

      act(() => {
        mockSyncProps.current.onWatch({
          businessSectorId0: sector('s1'),
          occupation1: 'Plombier',
        });
      });
      expect(result.current.step.isNextEnabled).toBe(false);

      act(() => {
        mockSyncProps.current.onWatch({
          businessSectorId0: sector('s1'),
          occupation1: 'Plombier',
          businessSectorId1: sector('s2'),
        });
      });
      expect(result.current.step.isNextEnabled).toBe(true);
    });

    it('pushes the sector ids to the pre-registration preferences while watching', () => {
      const { renderContent, dispatched } = setup();
      renderContent();

      act(() => {
        mockSyncProps.current.onWatch({
          businessSectorId0: sector('s1'),
          occupation0: 'Chef',
          businessSectorId1: sector('s2'),
          occupation1: 'Cuisinier',
        });
      });

      const prefs = lastPreferences(dispatched);
      expect(prefs.businessSectorIds).toEqual(['s1', 's2']);
      expect(prefs.sectorOccupations).toHaveLength(2);
      expect(prefs.currentJob).toBeUndefined();
    });

    it('stores the preferences and moves to the next step on submit', () => {
      const { renderContent, dispatched } = setup({ currentStep: 1 });
      renderContent();

      act(() => {
        mockSyncProps.current.onSubmit({
          businessSectorId0: sector('s1'),
          occupation0: 'Chef',
        });
      });

      expect(lastPreferences(dispatched).businessSectorIds).toEqual(['s1']);
      expect(dispatched).toContainEqual(
        registrationActions.moveForwardInRegistration({ step: 2 })
      );
    });
  });

  describe('coach flow', () => {
    const coachState = { selectedFlow: RegistrationFlow.COACH };

    it('asks for a job and the sectors of the network', () => {
      const { result } = setup(coachState);

      expect(result.current.step.title).toBe(
        'Quel est votre métier, et dans quels secteurs avez-vous du réseau ?'
      );
      expect(result.current.step.summary.title).toBe('Vos secteurs');
    });

    it('enables next only with a job and at least one sector', () => {
      const { result, renderContent } = setup(coachState);
      renderContent();

      act(() => {
        mockSyncProps.current.onWatch({
          currentJob: 'Dev',
          businessSectorIds: [],
        });
      });
      expect(result.current.step.isNextEnabled).toBe(false);

      act(() => {
        mockSyncProps.current.onWatch({
          currentJob: '',
          businessSectorIds: [sector('s1')],
        });
      });
      expect(result.current.step.isNextEnabled).toBe(false);

      act(() => {
        mockSyncProps.current.onWatch({
          currentJob: 'Dev',
          businessSectorIds: [sector('s1')],
        });
      });
      expect(result.current.step.isNextEnabled).toBe(true);
    });

    it('builds ordered occupations from the sectors and carries the current job', () => {
      const { renderContent, dispatched } = setup(coachState);
      renderContent();

      act(() => {
        mockSyncProps.current.onWatch({
          currentJob: 'Dev',
          businessSectorIds: [sector('a'), sector('b')],
        });
      });

      expect(lastPreferences(dispatched)).toEqual({
        sectorOccupations: [
          { businessSectorId: 'a', order: 0 },
          { businessSectorId: 'b', order: 1 },
        ],
        businessSectorIds: ['a', 'b'],
        currentJob: 'Dev',
      });
    });
  });

  it('renders the compatible profiles side panel for the sectors context', () => {
    const { result } = setup();
    const { getByTestId } = render(
      <>{result.current.step.sidePanelContent!('full') as any}</>
    );

    expect(getByTestId('side-panel').textContent).toBe('full-sectors');
    expect(result.current.step.mobileBottomSheet).toBe(true);
  });
});
