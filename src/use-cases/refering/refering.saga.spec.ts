jest.mock('@/src/api');

// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { CandidateYesNo } from '@/src/constants';
import { Genders } from '@/src/constants/genders';
import { ReferingStepData } from '@/src/features/backoffice/referer/Refering/Refering.types';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { slice } from './refering.slice';

const { actions } = slice;
const mockedApi = getMockedApi();

function buildAxiosError(status: number) {
  return {
    isAxiosError: true,
    response: { status },
  };
}

// A complete, valid data set spanning all 4 refering steps, matching the
// fields each step's form schema declares (see
// src/features/backoffice/referer/forms/*).
function buildFullReferingData(
  overrides: Partial<{
    'step-1': Record<string, unknown>;
    'step-2': Record<string, unknown>;
    'step-3': Record<string, unknown>;
    'step-4': Record<string, unknown>;
  }> = {}
): ReferingStepData {
  return {
    'step-1': {
      firstName: 'Jean',
      lastName: 'Dupont',
      gender: Genders.MALE,
      phone: '+33612345678',
      email: 'jean@example.com',
      confirmReferingRules: true,
      ...overrides['step-1'],
    },
    'step-2': {
      nudgeIds: ['nudge-1'],
      ...overrides['step-2'],
    },
    'step-3': {
      birthDate: '2000-01-01',
      department: { value: 'Paris', label: 'Paris' },
      workingRight: CandidateYesNo.YES,
      materialInsecurity: CandidateYesNo.NO,
      networkInsecurity: CandidateYesNo.NO,
      ...overrides['step-3'],
    },
    'step-4': {
      businessSectorId0: { value: 'sector-1', label: 'Sector One' },
      occupation0: 'Chef de projet',
      businessSectorId1: { value: 'sector-2', label: 'Sector Two' },
      occupation1: 'Développeur',
      ...overrides['step-4'],
    },
  } as unknown as ReferingStepData;
}

describe('refering saga', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('referCandidateRequested', () => {
    it('posts the flattened, computed candidate payload on success', async () => {
      const store = createTestStore({
        refering: { ...slice.getInitialState(), data: buildFullReferingData() },
      });
      mockedApi.postUserRefering.mockResolvedValue({} as any);

      store.dispatch(actions.referCandidateRequested());
      await flushPromises();

      expect(mockedApi.postUserRefering).toHaveBeenCalledWith({
        firstName: 'Jean',
        lastName: 'Dupont',
        gender: Genders.MALE,
        phone: '+33612345678',
        email: 'jean@example.com',
        birthDate: '2000-01-01',
        department: 'Paris',
        workingRight: CandidateYesNo.YES,
        materialInsecurity: CandidateYesNo.NO,
        networkInsecurity: CandidateYesNo.NO,
        sectorOccupations: [
          {
            businessSectorId: 'sector-1',
            businessSector: { id: 'sector-1', name: 'Sector One' },
            occupation: { name: 'Chef de projet' },
            order: 0,
          },
          {
            businessSectorId: 'sector-2',
            businessSector: { id: 'sector-2', name: 'Sector Two' },
            occupation: { name: 'Développeur' },
            order: 1,
          },
        ],
        nudges: [{ id: 'nudge-1' }],
      });
      expect(store.getState().refering.referCandate.status).toBe('SUCCEEDED');
    });

    it('omits nudges when no nudge was selected', async () => {
      const store = createTestStore({
        refering: {
          ...slice.getInitialState(),
          data: buildFullReferingData({ 'step-2': { nudgeIds: [] } }),
        },
      });
      mockedApi.postUserRefering.mockResolvedValue({} as any);

      store.dispatch(actions.referCandidateRequested());
      await flushPromises();

      expect(mockedApi.postUserRefering).toHaveBeenCalledWith(
        expect.objectContaining({ nudges: undefined })
      );
    });

    it('stores a DUPLICATE_EMAIL error on a 409 conflict', async () => {
      const store = createTestStore({
        refering: { ...slice.getInitialState(), data: buildFullReferingData() },
      });
      mockedApi.postUserRefering.mockRejectedValue(buildAxiosError(409));

      store.dispatch(actions.referCandidateRequested());
      await flushPromises();

      expect(store.getState().refering.referCandate.status).toBe('FAILED');
      expect(store.getState().refering.referCandidateError).toBe(
        'DUPLICATE_EMAIL'
      );
    });

    it('stores no error on a generic failure', async () => {
      const store = createTestStore({
        refering: { ...slice.getInitialState(), data: buildFullReferingData() },
      });
      mockedApi.postUserRefering.mockRejectedValue(new Error('boom'));

      store.dispatch(actions.referCandidateRequested());
      await flushPromises();

      expect(store.getState().refering.referCandate.status).toBe('FAILED');
      expect(store.getState().refering.referCandidateError).toBeNull();
    });
  });

  describe('setReferingCurrentStepData', () => {
    it('submits the candidate when the current step is the last one', async () => {
      const store = createTestStore({
        refering: {
          ...slice.getInitialState(),
          currentStep: 'step-4',
          data: buildFullReferingData(),
        },
      });
      mockedApi.postUserRefering.mockResolvedValue({} as any);

      store.dispatch(
        actions.setReferingCurrentStepData({
          businessSectorId0: { value: 'sector-1', label: 'Sector One' },
          occupation0: 'Chef de projet',
          businessSectorId1: { value: 'sector-2', label: 'Sector Two' },
          occupation1: 'Développeur',
        })
      );
      await flushPromises();

      expect(store.getState().refering.isLoading).toBe(true);
      expect(mockedApi.postUserRefering).toHaveBeenCalled();
      expect(store.getState().refering.referCandate.status).toBe('SUCCEEDED');
    });

    it('does not submit the candidate on an intermediate step', async () => {
      const store = createTestStore({
        refering: {
          ...slice.getInitialState(),
          currentStep: 'step-2',
          data: buildFullReferingData(),
        },
      });

      store.dispatch(
        actions.setReferingCurrentStepData({ nudgeIds: ['nudge-1'] })
      );
      await flushPromises();

      expect(mockedApi.postUserRefering).not.toHaveBeenCalled();
      expect(store.getState().refering.referCandate.status).toBe('IDLE');
    });
  });

  describe('setReferingStep', () => {
    it('stops loading after the step-change delay', async () => {
      const store = createTestStore();

      store.dispatch(actions.setReferingStep('step-2'));

      expect(store.getState().refering.currentStep).toBe('step-2');
      expect(store.getState().refering.isLoading).toBe(true);

      // `setReferingStepSaga` waits a real 500ms (`asyncTimeout`) before
      // dispatching `setReferingIsLoading(false)` — not backed by a mock or
      // fake timer, so the test waits it out for real.
      await new Promise((resolve) => setTimeout(resolve, 700));

      expect(store.getState().refering.isLoading).toBe(false);
    });
  });
});
